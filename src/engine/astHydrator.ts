// src/engine/astHydrator.ts

export interface CurriculumAstNode {
  id: string;
  stage: string;
  subject: string;
  topic: string;
  axiom: string;
  trap: string;
  scaffolding: {
    hook: string;
    activity: string;
    socraticCheck: string;
  };
  compiledAt: number;
}

/**
 * Strips AST complexity before prompting Nano,
 * then deterministically re-compiles the response into the AST schema.
 */
export async function compileAstNode(
  stage: string,
  subject: string,
  topic: string,
  rawAiOutput: { axiom?: string; trap?: string; hook?: string; guidedStep?: string; prompt?: string }
): Promise<CurriculumAstNode> {
  const nodeKey = `${stage}:${subject}:${topic}`.toLowerCase().replace(/\s+/g, '-');

  return {
    id: nodeKey,
    stage,
    subject,
    topic,
    axiom: rawAiOutput.axiom?.trim() || `Core standard for ${topic}`,
    trap: rawAiOutput.trap?.trim() || `Common misconception in ${topic}`,
    scaffolding: {
      hook: rawAiOutput.hook?.trim() || `Why is ${topic} important?`,
      activity: rawAiOutput.guidedStep?.trim() || `Investigate properties of ${topic}.`,
      socraticCheck: rawAiOutput.prompt?.trim() || `What is the key rule of ${topic}?`,
    },
    compiledAt: Date.now(),
  };
}