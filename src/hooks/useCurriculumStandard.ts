// src/hooks/useCurriculumStandard.ts
import { useState, useEffect } from 'react';
import { CurriculumProviderKey } from '../data/curriculumRegistry';

export function useCurriculumStandard(): [CurriculumProviderKey, (val: CurriculumProviderKey) => void] {
  const [standard, setStandard] = useState<CurriculumProviderKey>(() => {
    return (typeof window !== 'undefined' && 
      (localStorage.getItem('curriculum_standard') as CurriculumProviderKey)) || 'uk_oak';
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('curriculum_standard') as CurriculumProviderKey;
      if (saved && saved !== standard) {
        setStandard(saved);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [standard]);

  const updateStandard = (next: CurriculumProviderKey) => {
    setStandard(next);
    localStorage.setItem('curriculum_standard', next);
    window.dispatchEvent(new Event('storage'));
  };

  return [standard, updateStandard];
}