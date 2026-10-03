// src/components/ExpressLessonLaunchpad.tsx
/**
 * Express 2-Click Lesson Launchpad
 * 
 * Provides an immediate, zero-friction fast track to lessons:
 * 1. Pick Year Group (Reception -> GCSE)
 * 2. Pick Subject or Search Topic
 * -> 1-Click into the Lesson or Practice Quiz.
 */

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface ExpressLessonItem {
  id: string;
  yearGroup: string; // 'Reception' | 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Year 5' | 'Year 6' | 'KS3' | 'GCSE'
  stageKey: string; // 'ks1' | 'ks2' | 'ks3' | 'ks4'
  subject: string;
  subjectIcon: string;
  unit: string;
  lessonTitle: string;
  hook: string;
  specialTool?: {
    label: string;
    url: string;
    icon: string;
  };
}

const EXPRESS_LESSONS: ExpressLessonItem[] = [
  // Reception / EYFS
  {
    id: 'eyfs-phonics',
    yearGroup: 'Reception',
    stageKey: 'ks1',
    subject: 'English & Phonics',
    subjectIcon: '🔤',
    unit: 'Phonics & Simple Sentences',
    lessonTitle: 'Phase 2 Sounds & Sound Buttons',
    hook: 'Press the sound buttons for s, a, t, p, i, n and blend your first decodable words.',
    specialTool: {
      label: 'Open Phonics Lab & Soundboard',
      url: '/player?preset=phonics-lab&mode=game',
      icon: '🔤',
    },
  },
  {
    id: 'eyfs-maths',
    yearGroup: 'Reception',
    stageKey: 'ks1',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Addition & Subtraction within 20',
    lessonTitle: 'Counting to 10 with Ten-Frames',
    hook: 'Explore subitising and count objects with visual ten-frames and counters.',
  },
  {
    id: 'eyfs-re',
    yearGroup: 'Reception',
    stageKey: 'ks1',
    subject: 'Catholic RE',
    subjectIcon: '🕊️',
    unit: 'Baptism and Belonging',
    lessonTitle: 'God Made the World & Loves Everyone',
    hook: 'Discover the creation story and why every living creature is a gift from God.',
  },

  // Year 1
  {
    id: 'y1-phonics-check',
    yearGroup: 'Year 1',
    stageKey: 'ks1',
    subject: 'English & Phonics',
    subjectIcon: '🔤',
    unit: 'Phonics & Simple Sentences',
    lessonTitle: 'Year 1 Phonics Screening Check Simulator',
    hook: 'Practice decoding 40 real and alien pseudo-words with audio feedback and threshold tracking.',
    specialTool: {
      label: 'Launch Screening Check Simulator',
      url: '/player?preset=phonics-lab&mode=game',
      icon: '👾',
    },
  },
  {
    id: 'y1-maths-bonds',
    yearGroup: 'Year 1',
    stageKey: 'ks1',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Addition & Subtraction within 20',
    lessonTitle: 'Number Bonds to 10 and 20',
    hook: 'Find pairs of numbers that hold hands to make 10 and 20 on an interactive number line.',
  },
  {
    id: 'y1-science-seasons',
    yearGroup: 'Year 1',
    stageKey: 'ks1',
    subject: 'Science',
    subjectIcon: '🌱',
    unit: 'Seasonal Changes',
    lessonTitle: 'The Four Seasons & Daylight Changes',
    hook: 'Learn why the sun sets earlier in winter and how trees transform across spring, summer, and autumn.',
  },
  {
    id: 'y1-re-baptism',
    yearGroup: 'Year 1',
    stageKey: 'ks1',
    subject: 'Catholic RE',
    subjectIcon: '🕊️',
    unit: 'Baptism and Belonging',
    lessonTitle: 'The Signs and Symbols of Baptism',
    hook: 'Explore the holy water, white garment, chrism oil, and baptismal candle.',
  },

  // Year 2
  {
    id: 'y2-maths-tables',
    yearGroup: 'Year 2',
    stageKey: 'ks1',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Addition & Subtraction within 20',
    lessonTitle: 'Multiplication Arrays (2x, 5x, 10x Tables)',
    hook: 'Group dots into rows and columns to master times tables without counting on fingers.',
  },
  {
    id: 'y2-english-sentences',
    yearGroup: 'Year 2',
    stageKey: 'ks1',
    subject: 'English & Phonics',
    subjectIcon: '🔤',
    unit: 'Capital Letters & Full Stops',
    lessonTitle: 'Expanded Noun Phrases & Conjunctions',
    hook: 'Connect exciting sentences using "and", "but", "so", and descriptive adjectives.',
  },
  {
    id: 'y2-science-habitats',
    yearGroup: 'Year 2',
    stageKey: 'ks1',
    subject: 'Science',
    subjectIcon: '🔬',
    unit: 'Plants & Animals',
    lessonTitle: 'Living Things and Their Habitats',
    hook: 'Discover micro-habitats under stones and explore how woodland creatures stay safe and fed.',
  },

  // Year 3
  {
    id: 'y3-maths-fractions',
    yearGroup: 'Year 3',
    stageKey: 'ks2',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Fractions and Decimals',
    lessonTitle: 'Unit Fractions & Finding Parts of a Set',
    hook: 'Cut pizzas and chocolate bars into equal shares: 1/2, 1/3, 1/4, and 1/8.',
    specialTool: {
      label: 'Open Interactive Fraction Lab',
      url: '/player?preset=fractions&mode=game',
      icon: '🍕',
    },
  },
  {
    id: 'y3-re-first-communion',
    yearGroup: 'Year 3',
    stageKey: 'ks2',
    subject: 'Catholic RE',
    subjectIcon: '🕊️',
    unit: 'First Holy Communion',
    lessonTitle: 'The Liturgy of the Eucharist & Real Presence',
    hook: 'Master the Mass parts, liturgical colours, and spiritual preparation for First Holy Communion.',
    specialTool: {
      label: 'Open First Communion Mastery Lab',
      url: '/learning-zone?tab=first-communion',
      icon: '🍷',
    },
  },
  {
    id: 'y3-science-forces',
    yearGroup: 'Year 3',
    stageKey: 'ks2',
    subject: 'Science',
    subjectIcon: '🔬',
    unit: 'Circuits & Conductors',
    lessonTitle: 'Forces, Friction and Magnetic Poles',
    hook: 'Test why magnets attract and repel and investigate why shoes grip on grass but slip on ice.',
  },

  // Year 4
  {
    id: 'y4-maths-mtc',
    yearGroup: 'Year 4',
    stageKey: 'ks2',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Fractions and Decimals',
    lessonTitle: 'Multiplication Tables Check (12x12 Mastery)',
    hook: 'Rapid-fire fluency across all multiplication tables to ace the statutory Year 4 MTC.',
    specialTool: {
      label: 'Launch 12×12 Times Table Array & Splitter',
      url: '/player?preset=times-tables&mode=game',
      icon: '📐',
    },
  },
  {
    id: 'y4-english-adverbials',
    yearGroup: 'Year 4',
    stageKey: 'ks2',
    subject: 'English & Phonics',
    subjectIcon: '🔤',
    unit: 'Fronted Adverbials & Commas',
    lessonTitle: 'Fronted Adverbials & The Magic Comma',
    hook: 'Start sentences with Where, When, and How: "Cautiously creeping, the cat pounced."',
  },
  {
    id: 'y4-science-states',
    yearGroup: 'Year 4',
    stageKey: 'ks2',
    subject: 'Science',
    subjectIcon: '🔬',
    unit: 'States of Matter',
    lessonTitle: 'Solids, Liquids, Gases & The Water Cycle',
    hook: 'Zoom into molecular vibrations during evaporation, condensation, and melting.',
    specialTool: {
      label: 'Open Particle Simulation',
      url: '/player?preset=atom&mode=game',
      icon: '⚛️',
    },
  },

  // Year 5
  {
    id: 'y5-maths-percentages',
    yearGroup: 'Year 5',
    stageKey: 'ks2',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Fractions and Decimals',
    lessonTitle: 'Percentages, Decimals and Equivalent Fractions',
    hook: 'Convert between 50%, 0.5, and 1/2 like second nature with visual grid shading.',
  },
  {
    id: 'y5-science-space',
    yearGroup: 'Year 5',
    stageKey: 'ks2',
    subject: 'Science',
    subjectIcon: '🔬',
    unit: 'Earth and Space',
    lessonTitle: 'The Solar System & Planetary Orbits',
    hook: 'Simulate Earth spinning on its axis to create day and night while orbiting the Sun.',
    specialTool: {
      label: 'Launch 3D Solar System Flight',
      url: '/player?preset=solar-system&mode=game',
      icon: '🪐',
    },
  },
  {
    id: 'y5-history-vikings',
    yearGroup: 'Year 5',
    stageKey: 'ks2',
    subject: 'History & Geography',
    subjectIcon: '🌍',
    unit: 'Anglo-Saxons and Vikings',
    lessonTitle: 'Viking Raids, Longships & Danelaw',
    hook: 'Discover the seafaring navigation of longships and the treaty between King Alfred and Guthrum.',
  },

  // Year 6
  {
    id: 'y6-maths-bodmas',
    yearGroup: 'Year 6',
    stageKey: 'ks2',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Algebra & Equations',
    lessonTitle: 'Order of Operations: BODMAS / BIDMAS Clamping',
    hook: 'Experience operator physics: magnetic multiplication clamps, bracket shields, and avoid the classic SATs trap.',
    specialTool: {
      label: 'Launch BODMAS Forcefield Clamping Lab',
      url: '/player?preset=bodmas&mode=game',
      icon: '🧮',
    },
  },
  {
    id: 'y6-maths-sats',
    yearGroup: 'Year 6',
    stageKey: 'ks2',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Algebra & Equations',
    lessonTitle: 'Ratio, Proportion & Algebra Equations',
    hook: 'Solve missing-value algebra puzzles (2x + 7 = 25) and scale recipe ratios with confidence.',
  },
  {
    id: 'y6-science-circulatory',
    yearGroup: 'Year 6',
    stageKey: 'ks2',
    subject: 'Science',
    subjectIcon: '🔬',
    unit: 'Cell Biology',
    lessonTitle: 'The Human Circulatory System & Heart Chambers',
    hook: 'Trace oxygenated blood from the lungs into the left ventricle and across the body.',
  },
  {
    id: 'y6-re-sacraments',
    yearGroup: 'Year 6',
    stageKey: 'ks2',
    subject: 'Catholic RE',
    subjectIcon: '🕊️',
    unit: 'Sacraments and Vocation',
    lessonTitle: 'The Seven Sacraments & Confirmation',
    hook: 'Understand the seven gifts of the Holy Spirit and the apostolic laying on of hands.',
    specialTool: {
      label: 'Explore Catholic Life & Sacraments',
      url: '/catholic-life',
      icon: '✝️',
    },
  },

  // Key Stage 3 (Years 7–9)
  {
    id: 'ks3-maths-pythagoras',
    yearGroup: 'KS3',
    stageKey: 'ks3',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Linear Equations & Graphs',
    lessonTitle: 'Pythagoras’ Theorem & Right-Angled Triangles',
    hook: 'Prove a² + b² = c² geometrically with animated square transformations.',
    specialTool: {
      label: 'Open Pythagoras Vector Studio',
      url: '/player?preset=pythagoras&mode=game',
      icon: '📐',
    },
  },
  {
    id: 'ks3-science-photosynthesis',
    yearGroup: 'KS3',
    stageKey: 'ks3',
    subject: 'Science',
    subjectIcon: '🔬',
    unit: 'Photosynthesis & Respiration',
    lessonTitle: 'Photosynthesis Equation & Chloroplasts',
    hook: 'Carbon Dioxide + Water + Sunlight ➔ Glucose + Oxygen. Explore the chemical reaction.',
    specialTool: {
      label: 'Open Photosynthesis Lab',
      url: '/player?preset=photosynthesis&mode=game',
      icon: '🌿',
    },
  },
  {
    id: 'ks3-english-shakespeare',
    yearGroup: 'KS3',
    stageKey: 'ks3',
    subject: 'English & Phonics',
    subjectIcon: '🔤',
    unit: 'Poetic Techniques & Imagery',
    lessonTitle: 'Shakespeare’s Globe & Dramatic Irony',
    hook: 'Step onto the stage of Elizabethan London and decode iambic pentameter in Macbeth and Romeo & Juliet.',
    specialTool: {
      label: 'Step Inside Globe Theatre Lab',
      url: '/player?preset=shakespeare&mode=game',
      icon: '🎭',
    },
  },
  {
    id: 'ks3-languages-spanish',
    yearGroup: 'KS3',
    stageKey: 'ks3',
    subject: 'Languages',
    subjectIcon: '🗣️',
    unit: 'Sentence Construction',
    lessonTitle: 'Spanish & French Pronunciation & Verb Conjugation',
    hook: 'Listen to native speakers and master regular -ar/-er/-ir verb endings with speech recognition.',
    specialTool: {
      label: 'Launch MFL Interactive Player',
      url: '/player?preset=languages&mode=game',
      icon: '🇪🇸',
    },
  },

  // GCSE / Key Stage 4
  {
    id: 'gcse-maths-quadratics',
    yearGroup: 'GCSE',
    stageKey: 'ks4',
    subject: 'Mathematics',
    subjectIcon: '🔢',
    unit: 'Quadratic Equations & Graphs',
    lessonTitle: 'Solving Quadratics: Factoring & Quadratic Formula',
    hook: 'Find roots and turning points of parabolas using x = (-b ± √(b² - 4ac)) / 2a.',
  },
  {
    id: 'gcse-science-mitosis',
    yearGroup: 'GCSE',
    stageKey: 'ks4',
    subject: 'Science',
    subjectIcon: '🔬',
    unit: 'Genetics and Evolution',
    lessonTitle: 'Cell Mitosis, Meiosis and DNA Replication',
    hook: 'Watch chromosomes line up along the equator and divide to form diploid daughter cells.',
    specialTool: {
      label: 'Launch Mitosis Animation',
      url: '/player?preset=cell-mitosis&mode=game',
      icon: '🧬',
    },
  },
  {
    id: 'gcse-re-ethics',
    yearGroup: 'GCSE',
    stageKey: 'ks4',
    subject: 'Catholic RE',
    subjectIcon: '🕊️',
    unit: 'Catholic Ethics and Social Teaching',
    lessonTitle: 'Catholic Social Teaching & Dignity of the Human Person',
    hook: 'Apply Laudato Si’, subsidiarity, solidarity, and preferential option for the poor to moral dilemmas.',
  },
];

const YEAR_GROUPS = [
  'All',
  'Reception',
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Year 5',
  'Year 6',
  'KS3',
  'GCSE',
];

const SUBJECT_FILTERS = [
  { id: 'All', label: 'All Subjects', icon: '✨' },
  { id: 'Mathematics', label: 'Maths', icon: '🔢' },
  { id: 'English & Phonics', label: 'English & Phonics', icon: '🔤' },
  { id: 'Science', label: 'Science', icon: '🔬' },
  { id: 'Catholic RE', label: 'Catholic RE', icon: '🕊️' },
  { id: 'History & Geography', label: 'History & Geog', icon: '🌍' },
  { id: 'Languages', label: 'Languages', icon: '🗣️' },
];

export default function ExpressLessonLaunchpad(): React.JSX.Element {
  const [selectedYear, setSelectedYear] = useState<string>('Year 3');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const filteredLessons = useMemo(() => {
    return EXPRESS_LESSONS.filter((item) => {
      // Year filter
      if (selectedYear !== 'All' && item.yearGroup !== selectedYear) {
        return false;
      }
      // Subject filter
      if (selectedSubject !== 'All' && item.subject !== selectedSubject) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.lessonTitle.toLowerCase().includes(q);
        const matchUnit = item.unit.toLowerCase().includes(q);
        const matchHook = item.hook.toLowerCase().includes(q);
        const matchSub = item.subject.toLowerCase().includes(q);
        const matchYear = item.yearGroup.toLowerCase().includes(q);
        return matchTitle || matchUnit || matchHook || matchSub || matchYear;
      }
      return true;
    });
  }, [selectedYear, selectedSubject, searchQuery]);

  return (
    <section
      id="express-lesson-launchpad"
      aria-label="Express Lesson Launchpad"
      style={{
        background: '#ffffff',
        border: '2px solid #2563eb',
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        marginBottom: '3rem',
        boxShadow: '0 12px 30px -6px rgba(37, 99, 235, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner Accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 35%, #10b981 70%, #f59e0b 100%)',
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 16px',
            borderRadius: '9999px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.75rem',
          }}
        >
          <span>⚡ 2-Click Fast Track</span>
          <span>&bull;</span>
          <span>Jump Straight Into Any Lesson</span>
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
          What Would You Like to Learn Today?
        </h2>
        <p style={{ fontSize: '1rem', color: '#475569', maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
          Pick your school year and subject below to jump directly into the lesson explanation, audio narration, and interactive practice.
        </p>
      </div>

      {/* STEP 1: Select Year Group */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.65rem' }}>
          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem', fontWeight: 800 }}>
            1
          </span>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Choose School Year / Key Stage:
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {YEAR_GROUPS.map((yr) => {
            const isSelected = selectedYear === yr;
            return (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                style={{
                  padding: '0.5rem 0.95rem',
                  borderRadius: '9999px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  color: isSelected ? '#1d4ed8' : '#334155',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.2)' : 'none',
                }}
              >
                {yr}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Subject Filter & Quick Search */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.76rem', fontWeight: 800 }}>
              2
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Filter by Subject:
            </span>
          </div>

          {/* Quick Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic (e.g. fractions, phonics)..."
              style={{
                width: '100%',
                padding: '6px 12px 6px 32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                outline: 'none',
                background: '#f8fafc',
              }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '7px', fontSize: '0.82rem', color: '#94a3b8' }}>
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '5px',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Subject Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {SUBJECT_FILTERS.map((sub) => {
            const isSelected = selectedSubject === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubject(sub.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                  background: isSelected ? '#f0fdf4' : '#f8fafc',
                  color: isSelected ? '#047857' : '#475569',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DIRECT LESSON CARDS GRID */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
            Showing {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'} for{' '}
            <strong style={{ color: '#0f172a' }}>{selectedYear}</strong>
            {selectedSubject !== 'All' && ` • ${selectedSubject}`}
          </div>
          <Link
            to="/learning-zone"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
          >
            Browse Full Oak Directory ➔
          </Link>
        </div>

        {filteredLessons.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '16px',
              color: '#64748b',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 700, color: '#334155' }}>
              No quick-launch lessons matched your current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedYear('All');
                setSelectedSubject('All');
                setSearchQuery('');
              }}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredLessons.map((item) => {
              const teachUrl = `/learning-zone?ks=${encodeURIComponent(item.stageKey)}&sub=${encodeURIComponent(item.subject)}&unit=${encodeURIComponent(item.unit)}`;
              const practiceUrl = `/practice-lab?ks=${encodeURIComponent(item.stageKey)}&sub=${encodeURIComponent(item.subject)}&unit=${encodeURIComponent(item.unit)}`;

              return (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(37, 99, 235, 0.12)';
                    e.currentTarget.style.borderColor = '#93c5fd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div>
                    {/* Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '6px' }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      >
                        {item.yearGroup}
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#0369a1',
                          background: '#e0f2fe',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        <span>{item.subjectIcon}</span>
                        <span>{item.subject}</span>
                      </span>
                    </div>

                    {/* Lesson Title */}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', lineHeight: 1.35 }}>
                      {item.lessonTitle}
                    </h3>

                    {/* Hook / Summary */}
                    <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                      {item.hook}
                    </p>
                  </div>

                  <div>
                    {/* Special Tool Shortcut if available */}
                    {item.specialTool && (
                      <Link
                        to={item.specialTool.url}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '0.55rem',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                          border: '1px solid #86efac',
                          color: '#15803d',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          textDecoration: 'none',
                          marginBottom: '0.65rem',
                        }}
                      >
                        <span>{item.specialTool.icon}</span>
                        <span>{item.specialTool.label} ➔</span>
                      </Link>
                    )}

                    {/* 2-Click Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <Link
                        to={teachUrl}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          background: '#16a34a',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          textDecoration: 'none',
                          textAlign: 'center',
                          boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                        }}
                      >
                        <span>📖</span>
                        <span>Teach Me</span>
                      </Link>

                      <Link
                        to={practiceUrl}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          background: '#2563eb',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          textDecoration: 'none',
                          textAlign: 'center',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                        }}
                      >
                        <span>⚡</span>
                        <span>Practice</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
