// src/curriculum/index.ts
import defaultUkCurriculum from './curriculum.ast.ts';
import minedSubstrateAst from './curriculumoutput.ast.ts';
import { parseAST, ASTNode } from '../engine/ast-loader';
import { 
  OAK_CURRICULUM_CATALOGUE, 
  DEFAULT_OAK_CATALOGUE,
  OakStage 
} from './oakCatalogue';
import { adaptOakStage } from './curriculumAdapter';

export interface CurriculumPackage {
  id: string;
  country: string;
  framework: string;
  ast: ASTNode | null;
  raw: string;
  catalogueStage?: OakStage;
}

// 1. Module Registry built directly from mined substrate exports
const SUBSTRATE_REGISTRY: Record<string, any> = {
  adaptOakStage,
  getActiveCurriculum,
  OAK_CURRICULUM_CATALOGUE,
  DEFAULT_OAK_CATALOGUE,
  CurriculumRegistry: null as any,
};

// 2. Hydrate all stages using the mined substrate AST
export const CurriculumRegistry: Record<string, CurriculumPackage> = Object.values(
  OAK_CURRICULUM_CATALOGUE
).reduce((acc, stage) => {
  const stageKey = `uk-${stage.id}`;
  const rawAst = stage.id === 'ks2' ? defaultUkCurriculum : minedSubstrateAst;

  acc[stageKey] = {
    id: stageKey,
    country: 'UK',
    framework: stage.title,
    ast: parseAST(rawAst),
    raw: rawAst,
    catalogueStage: stage,
  };

  return acc;
}, {} as Record<string, CurriculumPackage>);

SUBSTRATE_REGISTRY.CurriculumRegistry = CurriculumRegistry;

export function getActiveCurriculum(id = 'uk-ks2'): CurriculumPackage {
  const normalizedId = id.startsWith('uk-') ? id : `uk-${id.toLowerCase()}`;
  return CurriculumRegistry[normalizedId] ?? CurriculumRegistry['uk-ks2'];
}

/**
 * Dynamic Intent Dispatcher
 * Invokes mined AST exports dynamically without static wiring
 */
export function dispatchAstIntent<T = any>(symbolName: string, ...args: any[]): T {
  const target = SUBSTRATE_REGISTRY[symbolName];
  
  if (typeof target === 'function') {
    return target(...args);
  }
  
  if (target !== undefined) {
    return target;
  }
  
  throw new Error(`[AST Substrate] Symbol "${symbolName}" not found in curriculum graph.`);
}