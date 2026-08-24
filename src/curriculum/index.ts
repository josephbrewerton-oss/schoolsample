import defaultUkCurriculum from './curriculum.ast';
import { parseAST, ASTNode } from '../engine/ast-loader';
import { OAK_CURRICULUM_CATALOGUE, OakStage } from './oakCatalogue';

export interface CurriculumPackage {
  id: string;
  country: string;
  framework: string;
  ast: ASTNode | null;
  raw: string;
  catalogueStage?: OakStage;
}

// Automatically scaffold the entire registry from OAK_CURRICULUM_CATALOGUE
export const CurriculumRegistry: Record<string, CurriculumPackage> = Object.values(
  OAK_CURRICULUM_CATALOGUE
).reduce((acc, stage) => {
  const stageKey = `uk-${stage.id}`;
  const isDefaultKs2 = stage.id === 'ks2';

  acc[stageKey] = {
    id: stageKey,
    country: 'UK',
    framework: stage.title,
    // Hydrate KS2 with the default static AST, leave others as null for JIT compilation
    ast: isDefaultKs2 ? parseAST(defaultUkCurriculum) : null,
    raw: isDefaultKs2 ? defaultUkCurriculum : '',
    catalogueStage: stage,
  };

  return acc;
}, {} as Record<string, CurriculumPackage>);

export function getActiveCurriculum(id = 'uk-ks2'): CurriculumPackage {
  return CurriculumRegistry[id] ?? CurriculumRegistry['uk-ks2'];
}