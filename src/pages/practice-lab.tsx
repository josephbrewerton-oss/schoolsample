// src/pages/practice-lab.tsx
import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import NeuralLabCanvas from '../components/NeuralLabCanvas';
import NanoAssistantPanel from '../components/NanoAssistantPanel';
import PageMeta from '../components/PageMeta';
import { getAssetUrl } from '../utils/url';
import {
  getSavedLanguage,
  listenToLanguageChange,
} from '../engine/operational-language';
import { dispatch } from '../engine/hypercall';
import { hypervisor } from '../engine/hypervisor';

import { ALL_CURRICULUM_ROUTES } from '../curriculum/curriculumMesh';

// Known AST and topic shortcode mappings to curriculum coordinates
const TOPIC_ALIAS_MAP: Record<string, { stage: string; subject: string; unit: string }> = {
  'sci-states': { stage: 'Key Stage 2', subject: 'Science', unit: 'States of Matter' },
  'sci-ecosystems': { stage: 'Key Stage 2', subject: 'Science', unit: 'Ecosystems & Energy' },
  'sci-plants': { stage: 'Key Stage 2', subject: 'Science', unit: 'Plant Nutrition' },
  'mat-fractions': { stage: 'Key Stage 2', subject: 'Mathematics', unit: 'Fractions and Decimals' },
  'mat-angles': { stage: 'Key Stage 2', subject: 'Mathematics', unit: 'Angles and Triangles' },
  'comp-algorithms': { stage: 'Key Stage 2', subject: 'Computing', unit: 'Algorithms and Sequencing' },
  're-eucharist': { stage: 'Key Stage 2', subject: 'Religious Education (Catholic)', unit: 'The Holy Eucharist & Sacraments' },
  'seasonal-changes': { stage: 'Key Stage 1', subject: 'Science', unit: 'Seasonal Changes' },
  'animals-humans': { stage: 'Key Stage 1', subject: 'Science', unit: 'Animals and Humans' },
  'materials-properties': { stage: 'Key Stage 1', subject: 'Science', unit: 'Materials and Properties' },
  'phonics-simple-sentences': { stage: 'Key Stage 1', subject: 'English', unit: 'Phonics & Simple Sentences' },
  'living-memory': { stage: 'Key Stage 1', subject: 'History', unit: 'Changes Within Living Memory' },
};

function resolveTopicParam(topicParam: string): { stage: string; subject: string; unit: string } | null {
  if (!topicParam) return null;
  const clean = topicParam.trim().toLowerCase();
  if (TOPIC_ALIAS_MAP[clean]) return TOPIC_ALIAS_MAP[clean];

  // Try matching against ALL_CURRICULUM_ROUTES
  const found = ALL_CURRICULUM_ROUTES.find(
    (r) =>
      r.topicId.toLowerCase() === clean ||
      r.topicTitle.toLowerCase() === clean ||
      r.urn.toLowerCase().includes(clean)
  );
  if (found) {
    return {
      stage: found.stageTitle,
      subject: found.subjectTitle,
      unit: found.topicTitle,
    };
  }
  return null;
}

function getInitialPracticeSelection(): { stage: string; subject: string; unit: string } {
  if (typeof window === 'undefined') {
    return { stage: 'Key Stage 1', subject: 'Science', unit: 'Seasonal Changes' };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const urlKs = searchParams.get('ks');
  const urlSub = searchParams.get('sub');
  const urlUnit = searchParams.get('unit');
  const urlTopic = searchParams.get('topic');

  // 1. Explicit query parameters (e.g. ?ks=...&sub=...&unit=...)
  if (urlKs || urlSub || urlUnit) {
    const stage = urlKs || localStorage.getItem('stj_active_stage') || 'Key Stage 1';
    const subject = urlSub || localStorage.getItem('stj_active_subject') || 'Science';
    const unit = urlUnit || localStorage.getItem('stj_active_unit') || 'Seasonal Changes';
    return { stage, subject, unit };
  }

  // 2. Topic shortcode or URN (?topic=sci-states, etc.)
  if (urlTopic) {
    const resolved = resolveTopicParam(urlTopic);
    if (resolved) return resolved;
  }

  // 3. User's previously chosen / remembered subject & unit from localStorage
  const savedSub = localStorage.getItem('stj_active_subject');
  const savedStage = localStorage.getItem('stj_active_stage');
  const savedUnit = localStorage.getItem('stj_active_unit');

  if (savedSub) {
    return {
      stage: savedStage || 'Key Stage 1',
      subject: savedSub,
      unit: savedUnit || 'Seasonal Changes',
    };
  }

  // 4. Default: Key Stage 1 Science (Seasonal Changes) — no hardcoded Mathematics
  return {
    stage: 'Key Stage 1',
    subject: 'Science',
    unit: 'Seasonal Changes',
  };
}

// In-line error boundary to capture child crashes without wiping the page
class ComponentGuard extends Component<
  { label: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[Guard] Crash inside ${this.props.label}:`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            margin: '1rem 0',
            padding: '1.25rem',
            background: '#450a0a',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            color: '#fecaca',
            fontFamily: 'monospace',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f87171' }}>
            Error rendering {this.props.label}:
          </strong>
          <code>{(this.state.error as Error).message}</code>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PracticeLabPage() {
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });

  const location = useLocation();

  const [initialCoordinates] = useState(getInitialPracticeSelection);
  const [activeStage, setActiveStage] = useState(initialCoordinates.stage);
  const [activeSubject, setActiveSubject] = useState(initialCoordinates.subject);
  const [activeUnit, setActiveUnit] = useState(initialCoordinates.unit);
  const [activeAxiomCheck, setActiveAxiomCheck] = useState<string | undefined>(undefined);

  // 2. Mount status
  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Query Param Ingestion
  useEffect(() => {
    if (typeof window !== 'undefined' && location?.search) {
      const searchParams = new URLSearchParams(location.search);
      const urlKs = searchParams.get('ks');
      const urlSub = searchParams.get('sub');
      const urlUnit = searchParams.get('unit');
      const urlTopic = searchParams.get('topic');

      if (urlKs || urlSub || urlUnit) {
        if (urlKs && urlKs !== activeStage) setActiveStage(urlKs);
        if (urlSub && urlSub !== activeSubject) setActiveSubject(urlSub);
        if (urlUnit && urlUnit !== activeUnit) setActiveUnit(urlUnit);
      } else if (urlTopic) {
        const resolved = resolveTopicParam(urlTopic);
        if (resolved) {
          setActiveStage(resolved.stage);
          setActiveSubject(resolved.subject);
          setActiveUnit(resolved.unit);
        }
      }
    }
  }, [location.search]);

  // Persist subject selection so it is remembered across all sessions and page refreshes
  useEffect(() => {
    if (typeof window !== 'undefined' && activeSubject) {
      localStorage.setItem('stj_active_stage', activeStage);
      localStorage.setItem('stj_active_subject', activeSubject);
      localStorage.setItem('stj_active_unit', activeUnit);
    }
  }, [activeStage, activeSubject, activeUnit]);

  // 4. Baseline Dispatch with Safe Promise Guard
  useEffect(() => {
    let isCancelled = false;

    try {
      const call = dispatch('LessonSynthesizer', {
        intent: 'inflate:baseline',
        payload: {
          stage: activeStage,
          subject: activeSubject,
          topic: activeUnit,
        },
      });

      if (call && typeof call.then === 'function') {
        call
          .then((res) => {
            if (!isCancelled && res?.ok && res?.data?.socraticCheck) {
              setActiveAxiomCheck(res.data.socraticCheck);
            }
          })
          .catch(() => {});
      }
    } catch {
      // Graceful fallback
    }

    return () => {
      isCancelled = true;
    };
  }, [activeStage, activeSubject, activeUnit]);

  return (
    <PageMeta title="Practice Arena" description="St Joseph's Interactive Curriculum Practice Arena">
      {/* Explicit dark container so content never blends with a white layout */}
      <div
        style={{
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '1.5rem 1rem 3rem 1rem',
        }}
      >
        {mounted ? (
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
                Practice Arena &amp; Neural Lab
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>
                Interactive curriculum drills, adaptive question mastery, and on-device Socratic guidance.
              </p>
            </div>

            <ComponentGuard label="NeuralLabCanvas">
              <NeuralLabCanvas
                initialKeyStage={activeStage}
                initialSubject={activeSubject}
                initialUnit={activeUnit}
                onTopicChange={(stage, sub, unit) => {
                  if (stage) setActiveStage(stage);
                  if (sub) setActiveSubject(sub);
                  if (unit) setActiveUnit(unit);
                }}
              />
            </ComponentGuard>

            <ComponentGuard label="NanoAssistantPanel">
              <NanoAssistantPanel
                seedKey={`${activeStage}:${activeSubject}:${activeUnit}`}
                keyStage={activeStage}
                subject={activeSubject}
                unit={activeUnit}
                contextTopic={`${activeStage} • ${activeSubject}: ${activeUnit}`}
                activePrompt={activeAxiomCheck}
              />
            </ComponentGuard>
          </div>
        ) : (
          <div style={{ maxWidth: '1100px', margin: '3rem auto', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading St Joseph&apos;s Practice Arena...</p>
          </div>
        )}
      </div>
    </PageMeta>
  );
}