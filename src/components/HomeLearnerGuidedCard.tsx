// src/components/HomeLearnerGuidedCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface StarterTopic {
  title: string;
  subject: string;
  unit: string;
  icon: string;
  badge: string;
  hook: string;
}

interface SubjectItem {
  id: string;
  label: string;
  icon: string;
  defaultUnit: string;
}

interface StageConfig {
  id: string; // 'ks1', 'ks2', 'ks3', 'ks4'
  displayName: string;
  ageSpan: string;
  summary: string;
  subjects: SubjectItem[];
  starterTopics: StarterTopic[];
}

const STAGES: StageConfig[] = [
  {
    id: 'ks1',
    displayName: 'Primary Foundation',
    ageSpan: 'Ages 5–7 • Key Stage 1',
    summary: 'Build early confidence with friendly visual numbers, phonics reading, weather, and animal habits.',
    subjects: [
      { id: 'maths', label: 'Mathematics', icon: '🔢', defaultUnit: 'Addition & Subtraction within 20' },
      { id: 'science', label: 'Science', icon: '🌱', defaultUnit: 'Seasonal Changes' },
      { id: 'english', label: 'English', icon: '📖', defaultUnit: 'Phonics & Simple Sentences' },
      { id: 'geography', label: 'Geography', icon: '🌍', defaultUnit: 'Our Local Area' },
      { id: 'history', label: 'History', icon: '⏳', defaultUnit: 'Significant Historical Figures' },
      { id: 'religious-education', label: 'Faith & Ethics', icon: '🕊️', defaultUnit: 'Baptism and Belonging' },
    ],
    starterTopics: [
      {
        title: 'Number Bonds & Counting on a Line',
        subject: 'Mathematics',
        unit: 'Addition & Subtraction within 20',
        icon: '🔢',
        badge: 'Numbers to 20',
        hook: 'How many steps forward on the number line does it take to reach 10 and 20?',
      },
      {
        title: 'The Four Seasons & Weather',
        subject: 'Science',
        unit: 'Seasonal Changes',
        icon: '🌦️',
        badge: 'Seasons & Nature',
        hook: 'Why do deciduous trees lose their leaves in autumn and bloom in spring?',
      },
      {
        title: 'Phonics & Capital Letters',
        subject: 'English',
        unit: 'Phonics & Simple Sentences',
        icon: '🔤',
        badge: 'Reading & Sentences',
        hook: 'Spot how capital letters open a sentence and full stops finish our thought.',
      },
    ],
  },
  {
    id: 'ks2',
    displayName: 'Junior Mastery',
    ageSpan: 'Ages 7–11 • Key Stage 2',
    summary: 'Master fractions, decimals, the solar system, water cycles, sentence punctuation, and world history.',
    subjects: [
      { id: 'maths', label: 'Mathematics', icon: '📐', defaultUnit: 'Fractions and Decimals' },
      { id: 'science', label: 'Science', icon: '🔬', defaultUnit: 'States of Matter' },
      { id: 'english', label: 'English', icon: '✍️', defaultUnit: 'Fronted Adverbials & Commas' },
      { id: 'geography', label: 'Geography', icon: '🌊', defaultUnit: 'Rivers & The Water Cycle' },
      { id: 'history', label: 'History', icon: '🏛️', defaultUnit: 'Ancient Egypt & Pharaohs' },
      { id: 'computing', label: 'Computing', icon: '💻', defaultUnit: 'Scratch Block Programming' },
      { id: 'mfl', label: 'Languages', icon: '🗣️', defaultUnit: 'French: Greetings, Family & Gender of Nouns' },
      { id: 'religious-education', label: 'Faith & Values', icon: '🕊️', defaultUnit: 'Baptism: Belonging to the Family of God' },
    ],
    starterTopics: [
      {
        title: 'Fractions: Equal Parts & Decimals',
        subject: 'Mathematics',
        unit: 'Fractions and Decimals',
        icon: '🍕',
        badge: 'Core Maths',
        hook: 'When sharing food equally, why does a bigger denominator mean smaller pieces?',
      },
      {
        title: 'Solids, Liquids & The Water Cycle',
        subject: 'Science',
        unit: 'States of Matter',
        icon: '💧',
        badge: 'Physical Science',
        hook: 'How does water turn to invisible vapor, form clouds, and fall back as rain?',
      },
      {
        title: 'Fronted Adverbials & Commas',
        subject: 'English',
        unit: 'Fronted Adverbials & Commas',
        icon: '📝',
        badge: 'Grammar & Writing',
        hook: '"Quietly in the dark, the owl flew." See how time and place adverbials set the scene.',
      },
      {
        title: 'Earth, Sun & Day/Night Orbit',
        subject: 'Science',
        unit: 'Earth and Space',
        icon: '🪐',
        badge: 'Earth & Space',
        hook: 'Why is it daytime on one side of our planet while the other side sleeps?',
      },
    ],
  },
  {
    id: 'ks3',
    displayName: 'Secondary Foundations',
    ageSpan: 'Ages 11–14 • Key Stage 3',
    summary: 'Independent exploration of linear equations, cells, forces, ecosystems, plate tectonics, and modern languages.',
    subjects: [
      { id: 'maths', label: 'Mathematics', icon: '📊', defaultUnit: 'Linear Equations' },
      { id: 'science', label: 'Science', icon: '🧪', defaultUnit: 'Cells, Tissues and Organs' },
      { id: 'english', label: 'English', icon: '📚', defaultUnit: 'Shakespeare: Themes & Rhetoric' },
      { id: 'geography', label: 'Geography', icon: '🌋', defaultUnit: 'Volcanoes and Earthquakes' },
      { id: 'history', label: 'History', icon: '⚔️', defaultUnit: 'The Vikings & Anglo-Saxons' },
      { id: 'computing', label: 'Computing', icon: '⚙️', defaultUnit: 'Algorithms & Sequencing' },
      { id: 'mfl', label: 'Languages', icon: '🌍', defaultUnit: 'Spanish: Phonics, Numbers & Animals' },
      { id: 'religious-education', label: 'Philosophy & RE', icon: '🕊️', defaultUnit: 'The Paschal Mystery & Covenant' },
    ],
    starterTopics: [
      {
        title: 'Solving Linear Equations (Balance Method)',
        subject: 'Mathematics',
        unit: 'Linear Equations',
        icon: '⚖️',
        badge: 'Algebra',
        hook: 'Treat equations like a balanced scale: whatever you do to one side, you do to the other.',
      },
      {
        title: 'Plant & Animal Cells Under a Lens',
        subject: 'Science',
        unit: 'Cells, Tissues and Organs',
        icon: '🔬',
        badge: 'Biology',
        hook: 'What makes plant cells rigid enough to stand tall without having a skeleton?',
      },
      {
        title: 'Forces, Friction & Speed (F = ma)',
        subject: 'Science',
        unit: 'Forces and Motion',
        icon: '🏎️',
        badge: 'Physics',
        hook: 'Why does sliding on ice feel frictionless while bicycle brakes stop you fast?',
      },
    ],
  },
  {
    id: 'ks4',
    displayName: 'GCSE & Senior Revision',
    ageSpan: 'Ages 14–16 • Key Stage 4 (GCSE)',
    summary: 'Rigorous exam preparation: quadratic equations, stoichiometry, Newtonian mechanics, and literary analysis.',
    subjects: [
      { id: 'maths', label: 'Mathematics', icon: '📈', defaultUnit: 'Quadratic Equations & Graphs' },
      { id: 'science', label: 'Combined Science', icon: '⚛️', defaultUnit: 'Atomic Structure & Periodic Table' },
      { id: 'chemistry', label: 'Chemistry', icon: '⚗️', defaultUnit: 'Balancing Chemical Equations' },
      { id: 'physics', label: 'Physics', icon: '⚡', defaultUnit: 'Newtonian Mechanics & Force' },
      { id: 'english', label: 'English Literature', icon: '🎭', defaultUnit: 'Romeo and Juliet: Themes & Quotes' },
      { id: 'geography', label: 'Geography', icon: '🏔️', defaultUnit: 'Glacial Landscapes & Geomorphology' },
      { id: 'religious-education', label: 'Catholic Ethics', icon: '🕊️', defaultUnit: 'Catholic Ethics & Moral Decision Making' },
    ],
    starterTopics: [
      {
        title: 'Factorising & Solving Quadratics',
        subject: 'Mathematics',
        unit: 'Quadratic Equations & Graphs',
        icon: '📈',
        badge: 'GCSE Higher / Foundation',
        hook: 'Find where curved trajectories cross the x-axis to calculate falling distances.',
      },
      {
        title: 'Balancing Chemical Equations (Conservation of Mass)',
        subject: 'Chemistry',
        unit: 'Balancing Chemical Equations',
        icon: '⚗️',
        badge: 'GCSE Chemistry',
        hook: 'Atoms cannot appear or vanish: balance every reactant molecule with products.',
      },
      {
        title: "Newton's Laws of Motion (Resultant Force)",
        subject: 'Physics',
        unit: 'Newtonian Mechanics & Force',
        icon: '🚀',
        badge: 'GCSE Physics',
        hook: 'Calculate how mass and net force dictate acceleration from rockets to bicycles.',
      },
    ],
  },
];

export default function HomeLearnerGuidedCard() {
  const [selectedStageIndex, setSelectedStageIndex] = useState(1); // Default to KS2 (Junior)
  const currentStage = STAGES[selectedStageIndex];

  const [selectedSubjectId, setSelectedSubjectId] = useState(currentStage.subjects[0].id);
  const activeSubject = currentStage.subjects.find((s) => s.id === selectedSubjectId) || currentStage.subjects[0];

  const handleStageChange = (idx: number) => {
    setSelectedStageIndex(idx);
    setSelectedSubjectId(STAGES[idx].subjects[0].id);
  };

  // Build target query strings
  const teachUrl = `/learning-zone?ks=${encodeURIComponent(currentStage.id)}&sub=${encodeURIComponent(activeSubject.label)}&unit=${encodeURIComponent(activeSubject.defaultUnit)}`;
  const practiceUrl = `/practice-lab?ks=${encodeURIComponent(currentStage.displayName)}&sub=${encodeURIComponent(activeSubject.label)}&unit=${encodeURIComponent(activeSubject.defaultUnit)}`;

  return (
    <section
      id="home-learner-guided-pathway"
      style={{
        background: '#ffffff',
        border: '2px solid #3b82f6',
        borderRadius: '24px',
        padding: '2.5rem',
        marginBottom: '3.5rem',
        boxShadow: '0 12px 30px -6px rgba(59, 130, 246, 0.15)',
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
          background: 'linear-gradient(90deg, #2563eb 0%, #10b981 50%, #3b82f6 100%)',
        }}
      />

      {/* Header with Loving Mission Note */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: '0.84rem',
            fontWeight: 700,
            marginBottom: '0.85rem',
          }}
        >
          <span>🕊️ Guided Independent Learning</span>
          <span>&bull;</span>
          <span>100% Free &bull; Works Offline</span>
        </div>

        <h2
          style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '0.65rem',
            letterSpacing: '-0.02em',
          }}
        >
          Start Here: A Guided Learning Pathway for Every Child
        </h2>
        <p
          style={{
            fontSize: '1.05rem',
            color: '#475569',
            maxWidth: '740px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Whether you are educating at home, studying independently, or learning without access to a regular classroom:
          this portal teaches you from the ground up. It breaks down every concept step by step, reads text aloud, and guides you patiently through mistakes.
        </p>
      </div>

      {/* Step 1: Choose Your Key Stage / Age */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            1
          </span>
          <span>Choose Your Age or Stage:</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {STAGES.map((stg, idx) => {
            const isSelected = idx === selectedStageIndex;
            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => handleStageChange(idx)}
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.15rem',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: isSelected ? '#eff6ff' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                }}
              >
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isSelected ? '#1d4ed8' : '#0f172a', marginBottom: '3px' }}>
                  {stg.displayName}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? '#2563eb' : '#64748b', marginBottom: '6px' }}>
                  {stg.ageSpan}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  {stg.summary}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Choose Your Subject */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            2
          </span>
          <span>Pick a Subject to Explore:</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
          }}
        >
          {currentStage.subjects.map((sub) => {
            const isSubSelected = sub.id === selectedSubjectId;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubjectId(sub.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.6rem 1rem',
                  borderRadius: '9999px',
                  border: isSubSelected ? '2px solid #16a34a' : '1px solid #cbd5e1',
                  background: isSubSelected ? '#f0fdf4' : '#ffffff',
                  color: isSubSelected ? '#15803d' : '#334155',
                  fontWeight: isSubSelected ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSubSelected ? '0 2px 8px rgba(22, 163, 74, 0.18)' : 'none',
                }}
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Choose How to Start */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '0.85rem',
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            3
          </span>
          <span>How Would You Like to Learn Today?</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Card A: Teach Me First */}
          <div
            style={{
              background: 'linear-gradient(145deg, #f0fdf4 0%, #ffffff 100%)',
              border: '2px solid #86efac',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📖</span>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Recommended For New Topics
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Option A: Teach Me First (Lesson Guide)
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
                Read the real-world story, observe worked rules, and click the speaker to listen aloud in English or your native language before answering questions.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, marginBottom: '1.25rem' }}>
                Selected: {activeSubject.label} &bull; {activeSubject.defaultUnit}
              </div>
            </div>

            <Link
              to={teachUrl}
              aria-label={`Open Lesson Guide & Audio for ${activeSubject.label}: ${activeSubject.defaultUnit}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.85rem 1.5rem',
                borderRadius: '10px',
                background: '#16a34a',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                transition: 'background-color 0.15s ease',
              }}
            >
              <span>📖 Open Lesson Guide &amp; Audio</span>
              <span>➔</span>
            </Link>
          </div>

          {/* Card B: Practice with Clues */}
          <div
            style={{
              background: 'linear-gradient(145deg, #eff6ff 0%, #ffffff 100%)',
              border: '2px solid #93c5fd',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Interactive Practice
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Option B: Practice with Clues (Interactive Lab)
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
                Try interactive questions with instant hints. If you pick a wrong option, the engine explains the exact cognitive trap so you learn without getting stuck.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#1d4ed8', fontWeight: 700, marginBottom: '1.25rem' }}>
                Selected: {activeSubject.label} &bull; {activeSubject.defaultUnit}
              </div>
            </div>

            <Link
              to={practiceUrl}
              aria-label={`Start Practice Session for ${activeSubject.label}: ${activeSubject.defaultUnit}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.85rem 1.5rem',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'background-color 0.15s ease',
              }}
            >
              <span>⚡ Start Practice Session</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick-Launch Recommended Starter Lessons */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              One-Click Starter Lessons
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
              Recommended Starting Points for {currentStage.displayName}
            </h4>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Click any lesson below to jump straight in
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.85rem',
          }}
        >
          {currentStage.starterTopics.map((topic, i) => {
            const topicTeachUrl = `/learning-zone?ks=${encodeURIComponent(currentStage.id)}&sub=${encodeURIComponent(topic.subject)}&unit=${encodeURIComponent(topic.unit)}`;
            const topicPracticeUrl = `/practice-lab?ks=${encodeURIComponent(currentStage.displayName)}&sub=${encodeURIComponent(topic.subject)}&unit=${encodeURIComponent(topic.unit)}`;

            return (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{topic.icon}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#1e40af',
                        background: '#dbeafe',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      {topic.badge}
                    </span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a', marginBottom: '4px' }}>
                    {topic.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                    {topic.hook}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link
                    to={topicTeachUrl}
                    aria-label={`Read lesson: ${topic.title} (${activeSubject.label})`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '8px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#15803d',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    📖 Read Lesson
                  </Link>
                  <Link
                    to={topicPracticeUrl}
                    aria-label={`Practice questions: ${topic.title} (${activeSubject.label})`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    ⚡ Practice
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 4 Golden Rules for Home Learners */}
      <div
        style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🎧</span>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>1. Listen or Translate</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              Click speaker buttons to read aloud, or use the top language bar for 20+ languages.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>💡</span>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>2. Use the Clues</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              Never guess blindly. The "Need a Clue?" button teaches the underlying rule first.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌱</span>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>3. Mistakes Teach You</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              Wrong answers explain the exact trap so you understand why, without penalties.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>📱</span>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>4. Study Offline</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              Install to device from the browser menu or footer. Practice anywhere without Wi-Fi.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
