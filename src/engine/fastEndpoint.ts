// src/engine/fastEndpoint.ts
import {
  ROOT_EXPORT_CATALOG,
  DOMAIN_SUBSTRATE_REGISTRY,
} from './rootSubstrate.generated';

// Dynamic module cache to prevent redundant imports
const MODULE_CACHE = new Map<string, any>();

async function executeModuleImport<T>(meta: { relPath: string }, symbolName: string, args: any[]): Promise<T> {
  const cleanPath = meta.relPath.replace(/\.tsx?$/, '');

  // Dynamic import on-demand
  if (!MODULE_CACHE.has(cleanPath)) {
    const mod = await import(`../${cleanPath}`);
    MODULE_CACHE.set(cleanPath, mod);
  }

  const targetModule = MODULE_CACHE.get(cleanPath);
  const target = targetModule[symbolName];

  if (typeof target === 'function') {
    return target(...args);
  }

  if (target !== undefined) {
    return target;
  }

  throw new Error(`[Substrate Gateway] Target "${symbolName}" was cataloged but not found on runtime export.`);
}

/**
 * Domain-Scoped Intent Endpoint
 * Dispatches against exports constrained to a specific architectural domain ('ui' | 'engine' | 'services' | 'core')
 */
export async function invokeDomainSubstrate<T = any>(
  domain: keyof typeof DOMAIN_SUBSTRATE_REGISTRY,
  symbolName: string,
  ...args: any[]
): Promise<T> {
  const catalog = DOMAIN_SUBSTRATE_REGISTRY[domain]?.catalog;
  const meta = catalog ? (catalog as readonly any[]).find((item) => item.name === symbolName) : undefined;

  if (!meta) {
    throw new Error(`[Substrate Gateway] Unknown AST symbol "${symbolName}" in domain "${domain}".`);
  }

  return executeModuleImport<T>(meta, symbolName, args);
}

/**
 * Universal Intent Endpoint
 * Dispatches against ANY collated export across the entire codebase
 */
export async function invokeSubstrate<T = any>(symbolName: string, ...args: any[]): Promise<T> {
  const meta = ROOT_EXPORT_CATALOG.find((item) => item.name === symbolName);

  if (!meta) {
    throw new Error(`[Substrate Gateway] Unknown AST symbol "${symbolName}".`);
  }

  return executeModuleImport<T>(meta, symbolName, args);
}
