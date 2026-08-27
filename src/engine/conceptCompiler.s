// src/engine/conceptCompiler.ts
export interface ConceptASTNode {
  id: string;
  axiom: string;
  faultyState: string;
  transform: { op: string; vars: Record<string, number | string> };
  proofSteps: Array<{ step: number; assert: string }>;
  diagnostic: { probe: string; target: string; distractors: string[] };
}

export function compileConceptView(node: ConceptASTNode): RenderableLesson {
  // Pure deterministic macro expansion on the client CPU
  return {
    title: node.id,
    rule: expandSymbolicAxiom(node.axiom),
    pitfall: expandFaultyState(node.faultyState),
    steps: node.proofSteps.map(s => expandProofStep(s)),
    check: node.diagnostic
  };
}