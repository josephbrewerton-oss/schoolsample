export interface ExtractedQuestion {
  prompt: string;
  options: string[];
  answerKey: number;
}

export function extractQuestionFromStream(rawStream: string): ExtractedQuestion | null {
  const cleanRaw = rawStream
    .replace(/```[a-z]*/gi, '')
    .replace(/```/g, '')
    .trim();

  let prompt = cleanRaw.match(/:prompt\s+"([^"]+)"/i)?.[1] ||
               cleanRaw.match(/:prompt\s+([^\(\):]+)/i)?.[1] ||
               'Select the correct answer:';
  prompt = prompt.replace(/:route[\s\S]*$/i, '').trim();

  let options: string[] = [];
  const optionsBlockMatch = cleanRaw.match(/:options\s*\((?:list\s+)?([\s\S]*?)\)(?=\s*:answer-key|\s*\)|\s*$)/i);

  if (optionsBlockMatch) {
    const blockContent = optionsBlockMatch[1].trim();
    const quotedMatches = blockContent.match(/"([^"]+)"/g);
    if (quotedMatches && quotedMatches.length > 0) {
      options = quotedMatches.map(s => s.replace(/^"|"$/g, '').trim());
    } else {
      options = blockContent
        .split(/\s+/)
        .filter(t => t && t !== 'list')
        .map(t => t.replace(/^["']|["']$/g, '').trim());
    }
  }

  const keyMatch = cleanRaw.match(/:answer-key\s+(\d+)/i);
  const answerKey = keyMatch ? parseInt(keyMatch[1], 10) : 0;

  if (options.length < 2) return null;

  return { prompt, options, answerKey };
}