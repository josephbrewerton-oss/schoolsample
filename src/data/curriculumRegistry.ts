// src/data/curriculumRegistry.ts
import { adaptOakStage, StandardStage } from '../curriculum/curriculumAdapter';
import { OAK_CURRICULUM_CATALOGUE } from '../curriculum/oakCatalogue'; // <-- updated path

export type CurriculumProviderKey = 'uk_oak' | 'international';

export const CURRICULUM_PROVIDERS: Record<CurriculumProviderKey, () => Record<string, StandardStage>> = {
  uk_oak: () => {
    const res: Record<string, StandardStage> = {};
    for (const [key, stage] of Object.entries(OAK_CURRICULUM_CATALOGUE)) {
      res[key] = adaptOakStage(stage);
    }
    return res;
  },
  international: () => {
    const res: Record<string, StandardStage> = {};
    for (const [key, stage] of Object.entries(OAK_CURRICULUM_CATALOGUE)) {
      const adapted = adaptOakStage(stage);
      res[key] = {
        ...adapted,
        subjects: adapted.subjects
          .map(sub => ({
            ...sub,
            topics: sub.topics.filter(t => t.scope === 'universal')
          }))
          .filter(sub => sub.topics.length > 0)
      };
    }
    return res;
  }
};

export function getActiveCurriculumTree(providerKey: CurriculumProviderKey = 'uk_oak'): Record<string, StandardStage> {
  const provider = CURRICULUM_PROVIDERS[providerKey] || CURRICULUM_PROVIDERS.uk_oak;
  return provider();
}