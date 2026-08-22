import defaultUkCurriculum from './curriculum.ast';
import { parseAST, ASTNode } from '../engine/ast-loader';

export interface CurriculumPackage {
  id: string;
  country: string;
  framework: string;
  ast: ASTNode | null;
  raw: string;
}

export const CurriculumRegistry: Record<string, CurriculumPackage> = {
  'uk-ks2': {
    id: 'uk-ks2',
    country: 'UK',
    framework: 'KeyStage 2',
    ast: parseAST(defaultUkCurriculum),
    raw: defaultUkCurriculum,
  },
};

export function getActiveCurriculum(id = 'uk-ks2'): CurriculumPackage {
  return CurriculumRegistry[id] ?? CurriculumRegistry['uk-ks2'];
}