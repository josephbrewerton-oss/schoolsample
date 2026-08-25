// src/curriculum/curriculumAdapter.ts

export interface StandardTopic {
  id: string;
  title: string;
  scope: 'universal' | 'regional_uk';
}

export interface StandardSubject {
  id: string;
  title: string;
  domain: 'stem' | 'humanities' | 'languages';
  topics: StandardTopic[];
}

export interface StandardStage {
  id: string;
  title: string;
  subjects: StandardSubject[];
}

const REGIONAL_KEYWORDS = [
  'britain', 'british', 'uk', 'norman', 'tudor', 'victorian',
  'parliament', 'london', 'anglo-saxons', 'monarchy', 'thames', 
  'elizabethan', 'christian-practices'
];

export function adaptOakStage(stage: any): StandardStage {
  return {
    id: stage.id,
    title: stage.title,
    subjects: stage.subjects.map((sub: any): StandardSubject => {
      const isSTEM = ['science', 'biology', 'chemistry', 'physics', 'maths', 'computing']
        .includes((sub.id || '').toLowerCase());

      const domain = isSTEM
        ? 'stem'
        : (['english', 'mfl', 'french', 'spanish', 'german'].includes((sub.id || '').toLowerCase())
            ? 'languages'
            : 'humanities');

      return {
        id: sub.id,
        title: sub.title,
        domain,
        topics: sub.topics.map((top: any): StandardTopic => {
          const isRegional = !isSTEM && REGIONAL_KEYWORDS.some(k =>
            (top.id + ' ' + top.title).toLowerCase().includes(k)
          );

          return {
            id: top.id,
            title: top.title,
            scope: isRegional ? 'regional_uk' : 'universal'
          };
        })
      };
    })
  };
}