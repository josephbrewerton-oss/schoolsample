// scripts/collateSubstrates.ts
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const tsEngine: typeof ts = (ts as any).default || ts;

interface SubstrateExport {
  name: string;
  kind: 'function' | 'const' | 'class';
  returnType: string;
  params: { name: string; type: string }[];
  sourceFile: string;
  relPath: string;
}

function getTsFilesRecursive(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
      results = results.concat(getTsFilesRecursive(fullPath));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
      !entry.name.endsWith('.d.ts') &&
      !entry.name.endsWith('.ast.ts')
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

export function collateProject(srcDir: string, outPath: string) {
  const allFiles = getTsFilesRecursive(srcDir);
  const program = tsEngine.createProgram(allFiles, {
    target: tsEngine.ScriptTarget?.ES2022 ?? 99,
    module: tsEngine.ModuleKind?.CommonJS ?? 1,
  });
  const checker = program.getTypeChecker();
  const collatedExports: SubstrateExport[] = [];

  for (const filePath of allFiles) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) continue;

    const fileSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!fileSymbol) continue;

    const exports = checker.getExportsOfModule(fileSymbol);
    const relPath = path.relative(srcDir, filePath).replace(/\\/g, '/');

    for (const sym of exports) {
      const decl = sym.valueDeclaration || (sym.declarations && sym.declarations[0]);
      if (!decl) continue;

      const symType = checker.getTypeOfSymbolAtLocation(sym, decl);
      const callSigs = symType.getCallSignatures();

      if (callSigs.length > 0) {
        const sig = callSigs[0];
        const params = sig.parameters.map((p) => {
          const pDecl = p.valueDeclaration || (p.declarations && p.declarations[0]);
          const pType = pDecl ? checker.getTypeOfSymbolAtLocation(p, pDecl) : checker.getAnyType();
          return { name: p.getName(), type: checker.typeToString(pType) };
        });

        collatedExports.push({
          name: sym.getName(),
          kind: tsEngine.isFunctionDeclaration(decl) ? 'function' : 'const',
          returnType: checker.typeToString(sig.getReturnType()),
          params,
          sourceFile: path.basename(filePath),
          relPath,
        });
      } else {
        collatedExports.push({
          name: sym.getName(),
          kind: tsEngine.isClassDeclaration(decl) ? 'class' : 'const',
          returnType: checker.typeToString(symType),
          params: [],
          sourceFile: path.basename(filePath),
          relPath,
        });
      }
    }
  }

  // Generate S-Expression Manifest
  let astContent = `;; Collated Root AST Manifest\n(:root-substrate\n`;
  for (const exp of collatedExports) {
    const paramStr = exp.params.map((p) => `(:param "${p.name}" :type "${p.type}")`).join(' ');
    astContent += `  (:symbol "${exp.name}" :from "${exp.relPath}" :kind :${exp.kind} :return "${exp.returnType}" :params (${paramStr}))\n`;
  }
  astContent += `)\n`;

  // Output runtime TypeScript registry
  const tsOutput = `// Auto-generated Global AST Substrate Manifest
export const ROOT_AST_STRING = ${JSON.stringify(astContent)};
export const ROOT_EXPORT_CATALOG = ${JSON.stringify(collatedExports, null, 2)} as const;
`;

  fs.writeFileSync(outPath, tsOutput, 'utf-8');
  console.log(`[AST Collator] Indexed ${collatedExports.length} exports across ${allFiles.length} files.`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcRoot = path.resolve(__dirname, '../src');
const outputFile = path.resolve(srcRoot, 'engine/rootSubstrate.generated.ts');

collateProject(srcRoot, outputFile);