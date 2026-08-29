// src/engine/fastEndpoint.ts
import { ROOT_EXPORT_CATALOG } from './rootSubstrate.generated';

// Dynamic module cache to prevent redundant imports
const MODULE_CACHE = new Map<string, any>();

/**
 * Universal Intent Endpoint
 * Dispatches against ANY collated export across the entire codebase
 */
export async function invokeSubstrate<T = any>(symbolName: string, ...args: any[]): Promise<T> {
  const meta = ROOT_EXPORT_CATALOG.find((item) => item.name === symbolName);

  if (!meta) {
    throw new Error(`[Substrate Gateway] Unknown AST symbol "${symbolName}".`);
  }

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