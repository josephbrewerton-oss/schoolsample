// src/data/curriculumRegistry.ts
import { adaptOakStage, StandardStage } from '../curriculum/curriculumAdapter';
import { OAK_CURRICULUM_CATALOGUE } from '../curriculum/oakCatalogue'; // <-- updated path
import { getCustomStandardStages } from '../services/curriculumPackStore';

export type CurriculumProviderKey = 'uk_oak' | 'international' | 'custom_imported';

export const CURRICULUM_PROVIDERS: Record<CurriculumProviderKey, () => Record<string, StandardStage>> = {
  uk_oak: () => {
    const res: Record<string, StandardStage> = {};
    for (const [key, stage] of Object.entries(OAK_CURRICULUM_CATALOGUE)) {
      res[key] = adaptOakStage(stage);
    }
    // Also append any custom installed overseas/school stages so they are always accessible
    const customStages = getCustomStandardStages();
    return { ...res, ...customStages };
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
    const customStages = getCustomStandardStages();
    return { ...res, ...customStages };
  },
  custom_imported: () => {
    const customStages = getCustomStandardStages();
    if (Object.keys(customStages).length > 0) {
      return customStages;
    }
    // Fallback to UK Oak if no custom stages installed yet
    const res: Record<string, StandardStage> = {};
    for (const [key, stage] of Object.entries(OAK_CURRICULUM_CATALOGUE)) {
      res[key] = adaptOakStage(stage);
    }
    return res;
  },
};

export function getActiveCurriculumTree(providerKey: CurriculumProviderKey = 'uk_oak'): Record<string, StandardStage> {
  const provider = CURRICULUM_PROVIDERS[providerKey] || CURRICULUM_PROVIDERS.uk_oak;
  return provider();
}
