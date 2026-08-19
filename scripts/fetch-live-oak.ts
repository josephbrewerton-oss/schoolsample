import fs from 'fs';
import path from 'path';

const OAK_API_KEY = process.env.OAK_API_KEY || 'YOUR_OAK_API_KEY_HERE';
const BASE_URL = 'https://open-api.thenational.academy/api/v1';

async function fetchSubjectQuestions(keyStage: string, subject: string) {
  const url = `${BASE_URL}/key-stages/${keyStage}/subject/${subject}/questions`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${OAK_API_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${subject} (${keyStage}): ${res.statusText}`);
  }

  const data = await res.json();
  const outDir = path.join(process.cwd(), 'data', 'oak_raw');
  fs.mkdirSync(outDir, { recursive: true });
  
  fs.writeFileSync(
    path.join(outDir, `${subject}-${keyStage}.json`),
    JSON.stringify(data, null, 2)
  );
  console.log(`Saved ${subject} (${keyStage}) to data/oak_raw/`);
}

// Example usage:
// fetchSubjectQuestions('key-stage-3', 'science');
// fetchSubjectQuestions('key-stage-2', 'maths');