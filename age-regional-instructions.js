// static/age-regional-instructions.js

export const KEY_STAGE_CONSTRAINTS = {
  KS1: "Ages 5-7 (Primary). Short simple sentences, everyday words, basic concrete items (e.g. shapes, single-digit counting).",
  KS2: "Ages 7-11 (Middle Primary). Simple sentence structures, foundational subject terms. One-step reasoning.",
  KS3: "Ages 11-14 (Lower Secondary). Core foundational concepts only. DO NOT use advanced GCSE/A-Level terminology.",
  KS4: "Ages 14-16 (Upper Secondary / GCSE standard). Rigorous terminology, quantitative relations, multi-step deduction."
};

export const REGIONAL_CONSTRAINTS = {
  uk_oak: `
- CURRICULUM FRAMEWORK: UK National Curriculum (Oak National Academy aligned).
- DIALECT: Standard UK English spelling ('colour', 'neutralise', 'aluminium', 'centimetre').
- UNITS & CURRENCY: SI Metric units, Celsius (°C), and British Pounds (£/p).
- TERMINOLOGY: UK schooling terminology (e.g. 'full stop', 'speech marks' / 'inverted commas').
`.trim(),

  international: `
- CURRICULUM FRAMEWORK: International / Universal (Cambridge & IB aligned).
- DIALECT: Globally neutral international English (avoid regional colloquialisms).
- UNITS & CURRENCY: Strict SI Metric units ONLY (m, km, kg, s, °C). Do NOT use local currencies (£, $, €).
- TERMINOLOGY: Globally neutral schooling terminology ('full stop / period', 'quotation marks').
`.trim()
};

export function resolveKeyStageRule(ksRaw = '') {
  const norm = String(ksRaw).toUpperCase().replace(/\s+/g, '');
  if (norm.includes('KS1') || norm.includes('KEYSTAGE1') || norm.includes('STAGE1') || norm.includes('YEAR1') || norm.includes('YEAR2')) {
    return KEY_STAGE_CONSTRAINTS.KS1;
  }
  if (norm.includes('KS2') || norm.includes('KEYSTAGE2') || norm.includes('STAGE2') || norm.includes('YEAR3') || norm.includes('YEAR4') || norm.includes('YEAR5') || norm.includes('YEAR6')) {
    return KEY_STAGE_CONSTRAINTS.KS2;
  }
  if (norm.includes('KS4') || norm.includes('KEYSTAGE4') || norm.includes('STAGE4') || norm.includes('GCSE')) {
    return KEY_STAGE_CONSTRAINTS.KS4;
  }
  return KEY_STAGE_CONSTRAINTS.KS3;
}