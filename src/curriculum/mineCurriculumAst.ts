// src/curriculum/mineCurriculumAst.ts
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

// Handle both CJS and ESM typescript import structures
const tsEngine: typeof ts = (ts as any).default || ts;

interface ExportedFunctionNode {
  name: string;
  kind: 'function' | 'const' | 'class' | 'method';
  parameters: { name: string; type: string }[];
  returnType: string;
}

interface FileAstManifest {
  fileName: string;
  exports: ExportedFunctionNode[];
}

function analyzeFile(filePath: string, program: ts.Program): FileAstManifest {
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(filePath);
  const result: FileAstManifest = {
    fileName: path.basename(filePath),
    exports: [],
  };

  if (!sourceFile) return result;

  const fileSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!fileSymbol) return result;

  const exportedSymbols = checker.getExportsOfModule(fileSymbol);

  for (const sym of exportedSymbols) {
    const decl = sym.valueDeclaration || (sym.declarations && sym.declarations[0]);
    if (!decl) continue;

    const symType = checker.getTypeOfSymbolAtLocation(sym, decl);
    const callSignatures = symType.getCallSignatures();

    if (callSignatures.length > 0) {
      const sig = callSignatures[0];
      const params = sig.parameters.map((p) => {
        const pDecl = p.valueDeclaration || (p.declarations && p.declarations[0]);
        const pType = pDecl ? checker.getTypeOfSymbolAtLocation(p, pDecl) : checker.getAnyType();
        return {
          name: p.getName(),
          type: checker.typeToString(pType),
        };
      });

      result.exports.push({
        name: sym.getName(),
        kind: tsEngine.isFunctionDeclaration(decl) ? 'function' : 'const',
        parameters: params,
        returnType: checker.typeToString(sig.getReturnType()),
      });
    } else if (tsEngine.isClassDeclaration(decl)) {
      result.exports.push({
        name: sym.getName(),
        kind: 'class',
        parameters: [],
        returnType: sym.getName(),
      });
    } else {
      result.exports.push({
        name: sym.getName(),
        kind: 'const',
        parameters: [],
        returnType: checker.typeToString(symType),
      });
    }
  }

  return result;
}

export function generateCurriculumAst(dirPath: string, outputPath: string) {
  const files = fs
    .readdirSync(dirPath)
    .filter(
      (f) =>
        (f.endsWith('.ts') || f.endsWith('.tsx')) &&
        !f.endsWith('.d.ts') &&
        !f.endsWith('.ast.ts') &&
        f !== 'mineCurriculumAst.ts'
    )
    .map((f) => path.join(dirPath, f));

  // Numeric literals for target (99 = ESNext / ES2022) and module (1 = CommonJS / 99 = ESNext)
  const program = tsEngine.createProgram(files, {
    target: tsEngine.ScriptTarget?.ES2022 ?? 99,
    module: tsEngine.ModuleKind?.CommonJS ?? 1,
  });

  const manifests = files.map((f) => analyzeFile(f, program));

  let astContent = `;; Curriculum AST Export Manifest\n;; Auto-generated from ${path.basename(dirPath)}\n\n(:curriculum-substrate\n`;

  for (const m of manifests) {
    astContent += `  (:module "${m.fileName}"\n    :exports (\n`;
    for (const exp of m.exports) {
      const paramsList = exp.parameters.map((p) => `(:param "${p.name}" :type "${p.type}")`).join(' ');
      astContent += `      (:symbol "${exp.name}" :kind :${exp.kind} :return-type "${exp.returnType}" :params (${paramsList}))\n`;
    }
    astContent += `    )\n  )\n`;
  }
  astContent += `)\n`;

  // 1. Write the raw .ast S-expression manifest
  fs.writeFileSync(outputPath, astContent, 'utf-8');

  // 2. Write the TS-wrapped version for direct Webpack bundling
  const tsWrappedContent = `// Auto-generated AST Substrate\nconst AST_SUBSTRATE: string = ${JSON.stringify(astContent)};\nexport default AST_SUBSTRATE;\n`;
  const tsOutputPath = outputPath.replace(/\.ast$/, '.ast.ts');
  fs.writeFileSync(tsOutputPath, tsWrappedContent, 'utf-8');

  // 3. Ensure curriculum.ast also has a TS-wrapped twin if it exists
  const defaultAstPath = path.join(dirPath, 'curriculum.ast');
  if (fs.existsSync(defaultAstPath)) {
    const defaultRaw = fs.readFileSync(defaultAstPath, 'utf-8');
    const defaultTsWrapped = `// Auto-generated Static AST Substrate\nconst DEFAULT_AST: string = ${JSON.stringify(defaultRaw)};\nexport default DEFAULT_AST;\n`;
    fs.writeFileSync(path.join(dirPath, 'curriculum.ast.ts'), defaultTsWrapped, 'utf-8');
  }

  console.log(`[AST Miner] Successfully emitted ${outputPath} and .ast.ts wrappers.`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = __dirname;
const targetOut = path.join(targetDir, 'curriculumoutput.ast');
generateCurriculumAst(targetDir, targetOut);