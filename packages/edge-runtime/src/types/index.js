/**
 * St Joseph's Universal AST Grammar & Edge-Runtime Type Definitions
 *
 * Unifies the S-Expression dialects across:
 * 1. Vector Media Player (:scene, :keyframes, :bindings, :subtitles, :checkpoints, :physics)
 * 2. Curriculum Question Engine (:route, :calc, :prompt, :options, :answer-key, :hint, :explanation)
 * 3. Structured Lesson Units (:lesson, :stage, :units, :steps)
 *
 * Provides strong TypeScript contracts to prevent schema drift across runtime, player,
 * and external curriculum authoring tools.
 */
/**
 * Type guard for Question / Assessment AST units
 */
export function isAstQuestion(node) {
    return Boolean(node &&
        typeof node === 'object' &&
        typeof node.prompt === 'string' &&
        Array.isArray(node.options) &&
        (typeof node.answerKey === 'number' || typeof node.answer === 'number'));
}
/**
 * Type guard for Vector Scene AST units
 */
export function isAstScene(node) {
    return Boolean(node &&
        typeof node === 'object' &&
        typeof node.id === 'string' &&
        typeof node.duration === 'number' &&
        (Array.isArray(node.keyframes) || Array.isArray(node.bindings)));
}
/**
 * Type guard for Lesson Curriculum AST units
 */
export function isAstLesson(node) {
    return Boolean(node &&
        typeof node === 'object' &&
        typeof node.id === 'string' &&
        typeof node.stage === 'string' &&
        (Array.isArray(node.questions) || Array.isArray(node.interactiveScenes)));
}
