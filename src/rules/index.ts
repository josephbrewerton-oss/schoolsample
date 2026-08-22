import quizRulesAst from './quiz.rules.ast';
import { parseAST, ASTNode } from '../engine/ast-loader';

export interface RulePackage {
  target: string;
  version: string;
  ast: ASTNode | null;
  raw: string;
}

export const RulesRegistry: Record<string, RulePackage> = {
  quiz: {
    target: 'worker.html',
    version: '1.0.0',
    ast: parseAST(quizRulesAst),
    raw: quizRulesAst,
  },
};

export function getRuleSet(name = 'quiz'): RulePackage {
  return RulesRegistry[name] ?? RulesRegistry['quiz'];
}