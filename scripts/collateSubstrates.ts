// scripts/collateSubstrates.ts
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const tsEngine: typeof ts = (ts as any).default || ts;

export type SubstrateDomain = 'ui' | 'engine' | 'services' | 'core';

export interface SubstrateExport {
  name: string;
  kind: 'function' | 'const' | 'class';
  returnType: string;
  params: { name: string; type: string }[];
  sourceFile: string;
  relPath: string;
}

export function getFileDomain(relPath: string): SubstrateDomain {
  const norm = relPath.replace(/\\/g, '/');
  if (norm.startsWith('components/') || norm.startsWith('pages/') || norm.startsWith('theme/')) {
    return 'ui';
  }
  if (norm.startsWith('engine/')) {
    return 'engine';
  }
  if (norm.startsWith('services/') || norm.startsWith('lib/') || norm.startsWith('hooks/')) {
    return 'services';
  }
  return 'core';
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
      !entry.name.endsWith('.ast.ts') &&
      !entry.name.includes('.generated.') &&
      !entry.name.includes('.substrate.')
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function generateDomainAst(domainName: string, exports: SubstrateExport[]): string {
  let astContent = `;; Domain AST Manifest: ${domainName}\n(:domain-substrate :${domainName}\n`;
  for (const exp of exports) {
    const paramStr = exp.params.map((p) => `(:param "${p.name}" :type "${p.type}")`).join(' ');
    astContent += `  (:symbol "${exp.name}" :from "${exp.relPath}" :kind :${exp.kind} :return "${exp.returnType}" :params (${paramStr}))\n`;
  }
  astContent += `)\n`;
  return astContent;
}

export function collateProject(srcDir: string, outPath: string) {
  const allFiles = getTsFilesRecursive(srcDir);
  const program = tsEngine.createProgram(allFiles, {
    target: tsEngine.ScriptTarget?.ES2022 ?? 99,
    module: tsEngine.ModuleKind?.CommonJS ?? 1,
  });
  const checker = program.getTypeChecker();

  const domainExports: Record<SubstrateDomain, SubstrateExport[]> = {
    ui: [],
    engine: [],
    services: [],
    core: [],
  };

  for (const filePath of allFiles) {
    const sourceFile = program.getSourceFile(filePath);
    if (!sourceFile) continue;

    const fileSymbol = checker.getSymbolAtLocation(sourceFile);
    if (!fileSymbol) continue;

    const exports = checker.getExportsOfModule(fileSymbol);
    const relPath = path.relative(srcDir, filePath).replace(/\\/g, '/');
    const domain = getFileDomain(relPath);

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

        domainExports[domain].push({
          name: sym.getName(),
          kind: tsEngine.isFunctionDeclaration(decl) ? 'function' : 'const',
          returnType: checker.typeToString(sig.getReturnType()),
          params,
          sourceFile: path.basename(filePath),
          relPath,
        });
      } else {
        domainExports[domain].push({
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

  // Ensure substrates directory exists
  const substratesDir = path.join(path.dirname(outPath), 'substrates');
  if (!fs.existsSync(substratesDir)) {
    fs.mkdirSync(substratesDir, { recursive: true });
  }

  // Generate domain-scoped substrate modules
  const domains: SubstrateDomain[] = ['ui', 'engine', 'services', 'core'];
  for (const dom of domains) {
    const list = domainExports[dom];
    const domAst = generateDomainAst(dom, list);
    const varPrefix = dom.toUpperCase();
    const filePath = path.join(substratesDir, `${dom}.substrate.ts`);
    const fileContent = `// Auto-generated Domain Substrate: ${dom.toUpperCase()}
export const ${varPrefix}_AST_STRING = ${JSON.stringify(domAst)};
export const ${varPrefix}_EXPORT_CATALOG = ${JSON.stringify(list, null, 2)} as const;
`;
    fs.writeFileSync(filePath, fileContent, 'utf-8');
  }

  // Output lean aggregator registry
  const aggregatorOutput = `// Auto-generated Global AST Substrate Manifest (Domain-Scoped Aggregator)
import { UI_AST_STRING, UI_EXPORT_CATALOG } from './substrates/ui.substrate';
import { ENGINE_AST_STRING, ENGINE_EXPORT_CATALOG } from './substrates/engine.substrate';
import { SERVICES_AST_STRING, SERVICES_EXPORT_CATALOG } from './substrates/services.substrate';
import { CORE_AST_STRING, CORE_EXPORT_CATALOG } from './substrates/core.substrate';

export {
  UI_AST_STRING,
  UI_EXPORT_CATALOG,
  ENGINE_AST_STRING,
  ENGINE_EXPORT_CATALOG,
  SERVICES_AST_STRING,
  SERVICES_EXPORT_CATALOG,
  CORE_AST_STRING,
  CORE_EXPORT_CATALOG,
};

export const DOMAIN_SUBSTRATE_REGISTRY = {
  ui: { ast: UI_AST_STRING, catalog: UI_EXPORT_CATALOG },
  engine: { ast: ENGINE_AST_STRING, catalog: ENGINE_EXPORT_CATALOG },
  services: { ast: SERVICES_AST_STRING, catalog: SERVICES_EXPORT_CATALOG },
  core: { ast: CORE_AST_STRING, catalog: CORE_EXPORT_CATALOG },
} as const;

export const ROOT_EXPORT_CATALOG = [
  ...UI_EXPORT_CATALOG,
  ...ENGINE_EXPORT_CATALOG,
  ...SERVICES_EXPORT_CATALOG,
  ...CORE_EXPORT_CATALOG,
] as const;

export const ROOT_AST_STRING =
  ';; Collated Root AST Manifest\\n(:root-substrate\\n' +
  UI_AST_STRING +
  ENGINE_AST_STRING +
  SERVICES_AST_STRING +
  CORE_AST_STRING +
  ')\\n';
`;

  fs.writeFileSync(outPath, aggregatorOutput, 'utf-8');
  const total = domainExports.ui.length + domainExports.engine.length + domainExports.services.length + domainExports.core.length;
  console.log(`[AST Collator] Indexed ${total} exports across ${allFiles.length} files (UI: ${domainExports.ui.length}, Engine: ${domainExports.engine.length}, Services: ${domainExports.services.length}, Core: ${domainExports.core.length}).`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcRoot = path.resolve(__dirname, '../src');
const outputFile = path.resolve(srcRoot, 'engine/rootSubstrate.generated.ts');

collateProject(srcRoot, outputFile);
