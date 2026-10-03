// src/components/CatholicRitesExplorer.tsx
import React, { useState } from 'react';
import {
  LITURGICAL_RITE_FAMILIES,
  SUI_IURIS_CHURCHES,
  LITURGICAL_COMPARISONS,
  CONSECRATION_VOICES,
  LiturgicalRiteFamily,
  SuiIurisChurch,
} from '../data/catholic/catholicRitesData';
import { speakInLanguage, cancelSpeech } from '../engine/translationService';
import { playSuccessChime, triggerHapticSuccess } from '../services/soundHaptics';

interface CatholicRitesExplorerProps {
  theme?: 'dark' | 'light';
}

export default function CatholicRitesExplorer({
  theme = 'light',
}: CatholicRitesExplorerProps): React.JSX.Element {
  const [selectedRiteId, setSelectedRiteId] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'churches' | 'comparisons' | 'consecration' | 'quiz'>('churches');
  
  // Interactive Comparison Selection
  const [selectedComparisonId, setSelectedComparisonId] = useState<string>(LITURGICAL_COMPARISONS[0].id);

  // Audio Speech state
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const QUIZ_QUESTIONS = [
    {
      question: 'How many autonomous (sui iuris) Churches make up the one Universal Catholic Church in full communion with the Pope?',
      options: ['Only 1 (The Roman Catholic Church)', '6 Churches', '24 Churches across 6 Liturgical Rites', '100 separate denominations'],
      correct: 2,
      explanation: 'The Catholic Church is a communion of 24 autonomous Churches (1 Western Latin Church + 23 Eastern Catholic Churches) all united in one faith under the Bishop of Rome.',
    },
    {
      question: 'Which ancient Eastern Catholic Church in the Middle East has NEVER broken communion with the Pope throughout its entire history?',
      options: ['The Maronite Catholic Church of Lebanon', 'The Church of England', 'The Byzantine Empire', 'The Roman Senate'],
      correct: 0,
      explanation: 'The Maronite Catholic Church, tracing its monastic heritage to St. Maron in Mount Lebanon, has maintained unbroken communion with the Holy See through all centuries.',
    },
    {
      question: 'In India, the Syro-Malabar and Syro-Malankara Catholic Churches trace their direct apostolic foundation to which Apostle?',
      options: ['St. Peter', 'St. Thomas the Apostle (AD 52)', 'St. Patrick', 'St. Augustine'],
      correct: 1,
      explanation: 'St. Thomas the Apostle sailed to Kerala, India in AD 52, establishing the ancient St. Thomas Christians (Nasranis) centuries before Western European exploratory voyages.',
    },
    {
      question: 'Why do Byzantine and Eastern Catholic Churches use leavened bread (Prosphora) for the Holy Eucharist?',
      options: ['They forgot how to bake flat wafers', 'Because yeast represents the Risen Life of Christ and the Holy Spirit breathing life into the bread', 'Because it costs less to bake', 'Only unleavened bread is allowed by God'],
      correct: 1,
      explanation: 'Leaven symbolizes the Holy Spirit and Christ rising from the dead! The Latin Church recalls the Passover unleavened bread (sacrifice); both are holy, ancient, and fully valid.',
    },
  ];

  // Filtered churches
  const filteredChurches = SUI_IURIS_CHURCHES.filter((church) => {
    const matchesRite = selectedRiteId === 'all' || church.riteId === selectedRiteId;
    const matchesRegion =
      selectedRegion === 'all' ||
      church.primaryRegions.some((r) => r.toLowerCase().includes(selectedRegion.toLowerCase())) ||
      church.geographicHeartland.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      church.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.seeCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.riteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.geographicHeartland.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRite && matchesRegion && matchesSearch;
  });

  const handlePlayVoice = (sample: typeof CONSECRATION_VOICES[0], index: number) => {
    cancelSpeech();
    setSpeakingIndex(index);
    speakInLanguage(sample.speechText, sample.langCode, {
      onEnd: () => setSpeakingIndex(null),
      onError: () => setSpeakingIndex(null),
    });
  };

  const handleStopVoice = () => {
    cancelSpeech();
    setSpeakingIndex(null);
  };

  const selectedComparison = LITURGICAL_COMPARISONS.find((c) => c.id === selectedComparisonId) || LITURGICAL_COMPARISONS[0];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 60%, #064e3b 100%)',
          color: '#ffffff',
          padding: '2rem 1.5rem',
          borderRadius: '16px',
          marginBottom: '1.75rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: '#f59e0b', color: '#78350f', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800 }}>
            CATECHISM OF THE CATHOLIC CHURCH §§ 1200–1209
          </span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: '#e2e8f0', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
            Orientale Lumen &bull; Pope St. John Paul II
          </span>
          <span style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#6ee7b7', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
            Dedicated to the Global South, Africa, India &amp; Middle East
          </span>
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          🌍 The 6 Liturgical Rites &amp; 24 Churches of the Catholic Communion
        </h1>
        <p style={{ fontSize: '1rem', color: '#cbd5e1', margin: '0 0 1rem 0', maxWidth: '800px', lineHeight: 1.5 }}>
          <em>&ldquo;The Church must breathe with her two lungs — East and West!&rdquo;</em> Catholic teaching is far richer than just the Roman tradition. Explore the 24 autonomous Catholic Churches in full communion with the Pope.
        </p>

        {/* Quick Stat Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>COMMUNION STRUCTURE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#facc15' }}>24 Churches</div>
            <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>1 Western + 23 Eastern</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>LITURGICAL FAMILIES</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>6 Sacred Rites</div>
            <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Latin, Byzantine, Alexandrian...</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>APOSTOLIC LANGUAGE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#4ade80' }}>Aramaic &amp; Ge’ez</div>
            <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Tongue of Jesus &amp; Apostles</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>UNITY UNDER ROME</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#e879f9' }}>100% Catholic</div>
            <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>One Faith &bull; Valid Sacraments</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('churches')}
          style={{
            padding: '10px 16px',
            fontWeight: 800,
            fontSize: '0.92rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'churches' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'churches' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🏛️</span> The 24 Catholic Churches
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comparisons')}
          style={{
            padding: '10px 16px',
            fontWeight: 800,
            fontSize: '0.92rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'comparisons' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'comparisons' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>⚖️</span> East vs. West Liturgical Matrix
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consecration')}
          style={{
            padding: '10px 16px',
            fontWeight: 800,
            fontSize: '0.92rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'consecration' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'consecration' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🔊</span> Consecration in Apostolic Tongues
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          style={{
            padding: '10px 16px',
            fontWeight: 800,
            fontSize: '0.92rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'quiz' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'quiz' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🎓</span> Socratic Rites Challenge
        </button>
      </div>

      {/* TAB 1: THE 24 CHURCHES & 6 RITES CATALOG */}
      {activeTab === 'churches' && (
        <div>
          {/* 6 Rites Family Ribbon */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              Filter by Liturgical Family:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSelectedRiteId('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: selectedRiteId === 'all' ? '2px solid #0f172a' : '1px solid #cbd5e1',
                  background: selectedRiteId === 'all' ? '#0f172a' : '#ffffff',
                  color: selectedRiteId === 'all' ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                }}
              >
                All 6 Rites (24 Churches)
              </button>
              {LITURGICAL_RITE_FAMILIES.map((rf) => (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setSelectedRiteId(rf.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: selectedRiteId === rf.id ? `2px solid ${rf.colorScheme.border}` : '1px solid #cbd5e1',
                    background: selectedRiteId === rf.id ? rf.colorScheme.border : '#ffffff',
                    color: selectedRiteId === rf.id ? '#ffffff' : rf.colorScheme.text,
                    cursor: 'pointer',
                  }}
                >
                  {rf.name} ({rf.churchesCount})
                </button>
              ))}
            </div>
          </div>

          {/* Region and Search Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem', background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search Church, city (Damascus, Kyiv, Baghdad, Kerala...), language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                }}
              />
            </div>
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  background: '#ffffff',
                  color: '#1e293b',
                  fontWeight: 600,
                }}
              >
                <option value="all">🌍 All Developing World &amp; Global Regions</option>
                <option value="middle east">Middle East &amp; Holy Land (Lebanon, Syria, Iraq, Egypt)</option>
                <option value="india">India &amp; South Asia (Kerala, Nasrani Tradition)</option>
                <option value="africa">Horn of Africa (Ethiopia &amp; Eritrea)</option>
                <option value="ukraine">Eastern &amp; Central Europe (Ukraine, Romania)</option>
                <option value="europe">Western Europe &amp; Rome</option>
              </select>
            </div>
          </div>

          {/* Churches Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredChurches.map((church) => {
              const riteFamily = LITURGICAL_RITE_FAMILIES.find((r) => r.id === church.riteId);
              return (
                <div
                  key={church.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{church.sacredSymbolEmoji}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: riteFamily?.colorScheme.badgeBg || '#e2e8f0',
                          color: riteFamily?.colorScheme.text || '#0f172a',
                          border: `1px solid ${riteFamily?.colorScheme.border || '#cbd5e1'}`,
                        }}
                      >
                        {church.riteName}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                      {church.name}
                    </h3>

                    <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700, marginBottom: '8px' }}>
                      📍 See: {church.seeCity} &bull; {church.headTitle}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '10px', lineHeight: 1.4 }}>
                      <strong>Heartland:</strong> {church.geographicHeartland}
                    </div>

                    <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', fontSize: '0.78rem', color: '#334155', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>APOSTOLIC ORIGINS:</div>
                      {church.historicalOrigins}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700, marginBottom: '8px' }}>
                      🗣️ Sacred Tongues: {church.liturgicalLanguages.join(', ')}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Distinctive Liturgical Treasures:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#334155', lineHeight: 1.45 }}>
                        {church.distinctiveTreasures.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                      Faithful: <strong>{church.approximateFaithful}</strong>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 800, background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                      Full Communion With Rome
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EAST VS WEST LITURGICAL MATRIX */}
      {activeTab === 'comparisons' && (
        <div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#1e40af' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800 }}>
              💡 The Principle of Legitimate Diversity in Unity
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5 }}>
              Different liturgical traditions are NOT opposing doctrines. They are complementary spiritual treasures that have developed under the guidance of the same Holy Spirit. Both Eastern and Western customs are 100% valid, authentic Catholic sacraments.
            </p>
          </div>

          {/* Topic Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '1.5rem' }}>
            {LITURGICAL_COMPARISONS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedComparisonId(comp.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: selectedComparisonId === comp.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: selectedComparisonId === comp.id ? '#f0fdf4' : '#ffffff',
                  color: selectedComparisonId === comp.id ? '#166534' : '#1e293b',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{comp.category}</div>
                <div>{comp.title.split(':')[0]}</div>
              </button>
            ))}
          </div>

          {/* Detailed Side-by-Side Comparison Box */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              {selectedComparison.title}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '1.5rem' }}>
              {/* Western Latin Column */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', background: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>
                    WESTERN LATIN TRADITION
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  {selectedComparison.westernLatinPractice.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  {selectedComparison.westernLatinPractice.description}
                </p>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#1e3a8a' }}>
                  <strong>Theological Meaning:</strong> {selectedComparison.westernLatinPractice.theologicalMeaning}
                </div>
              </div>

              {/* Eastern Catholic Column */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>☦️</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                    EASTERN CATHOLIC TRADITION
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#78350f', margin: '0 0 6px 0' }}>
                  {selectedComparison.easternCatholicPractice.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#451a03', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  {selectedComparison.easternCatholicPractice.description}
                </p>
                <div style={{ background: '#ffffff', border: '1px solid #fef3c7', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#78350f' }}>
                  <strong>Theological Meaning:</strong> {selectedComparison.easternCatholicPractice.theologicalMeaning}
                </div>
              </div>
            </div>

            {/* Socratic Synthesis Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>
                ✨ Socratic Harmonisation &bull; Catechism Insight:
              </div>
              <p style={{ fontSize: '0.88rem', color: '#14532d', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                {selectedComparison.socraticSynthesis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONSECRATION IN APOSTOLIC TONGUES */}
      {activeTab === 'consecration' && (
        <div>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              🎙️ The Living Voice of the Apostles: Words of Institution
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
              Listen to the words spoken by Christ at the Last Supper (*“This is My Body”*) as chanted across the ancient Catholic Rites in Aramaic (the Lord’s native dialect), Koine Greek, Ecclesiastical Latin, and Ge’ez.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {CONSECRATION_VOICES.map((sample, idx) => {
              const isPlaying = speakingIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1d4ed8', background: '#dbeafe', padding: '3px 8px', borderRadius: '6px' }}>
                        {sample.rite}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                        {sample.language}
                      </span>
                    </div>

                    {/* Original Script */}
                    <div
                      style={{
                        background: '#0f172a',
                        color: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        textAlign: 'center',
                        fontSize: '1.15rem',
                        lineHeight: 1.6,
                        fontFamily: 'serif',
                      }}
                    >
                      {sample.scriptText}
                    </div>

                    {/* Transliteration */}
                    <div style={{ fontSize: '0.84rem', fontStyle: 'italic', color: '#0369a1', marginBottom: '8px', lineHeight: 1.4 }}>
                      &ldquo;{sample.transliteration}&rdquo;
                    </div>

                    {/* English Translation */}
                    <div style={{ fontSize: '0.82rem', color: '#1e293b', marginBottom: '10px', lineHeight: 1.4, fontWeight: 500 }}>
                      <strong>English:</strong> {sample.englishTranslation}
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#64748b', background: '#f8fafc', padding: '6px 8px', borderRadius: '6px' }}>
                      {sample.historicalContext}
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    {isPlaying ? (
                      <button
                        type="button"
                        onClick={handleStopVoice}
                        style={{
                          width: '100%',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        ⏹️ Stop Audio Playback
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(sample, idx)}
                        style={{
                          width: '100%',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        ▶️ Listen to Consecration
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SOCRATIC RITES CHALLENGE (QUIZ) */}
      {activeTab === 'quiz' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
              🎓 Socratic Catholic Rites Mastery Check
            </h2>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b' }}>
              Test your knowledge of the 24 Catholic Churches, the Eastern liturgical traditions, and how unity and diversity harmonize in the body of Christ.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = quizAnswers[qIndex];
              const isCorrect = selectedOpt === q.correct;
              return (
                <div
                  key={qIndex}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '1.2rem',
                  }}
                >
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                    {qIndex + 1}. {q.question}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map((opt, optIndex) => {
                      let btnBg = '#ffffff';
                      let btnBorder = '#cbd5e1';
                      let btnColor = '#1e293b';

                      if (quizSubmitted) {
                        if (optIndex === q.correct) {
                          btnBg = '#dcfce7';
                          btnBorder = '#22c55e';
                          btnColor = '#15803d';
                        } else if (selectedOpt === optIndex) {
                          btnBg = '#fee2e2';
                          btnBorder = '#ef4444';
                          btnColor = '#b91c1c';
                        }
                      } else if (selectedOpt === optIndex) {
                        btnBg = '#eff6ff';
                        btnBorder = '#3b82f6';
                        btnColor = '#1d4ed8';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => {
                            setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
                          }}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: `1.5px solid ${btnBorder}`,
                            background: btnBg,
                            color: btnColor,
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: quizSubmitted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>({String.fromCharCode(65 + optIndex)})</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: isCorrect ? '#f0fdf4' : '#fffbeb',
                        border: `1px solid ${isCorrect ? '#86efac' : '#fcd34d'}`,
                        fontSize: '0.82rem',
                        color: isCorrect ? '#166534' : '#92400e',
                        lineHeight: 1.4,
                      }}
                    >
                      <strong>{isCorrect ? '✅ Spot on!' : '💡 Catechetical Insight:'}</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {!quizSubmitted ? (
              <button
                type="button"
                onClick={() => {
                  setQuizSubmitted(true);
                  playSuccessChime();
                  triggerHapticSuccess();
                }}
                disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length ? '#16a34a' : '#cbd5e1',
                  color: '#ffffff',
                  fontWeight: 800,
                  border: 'none',
                  fontSize: '0.92rem',
                  cursor: Object.keys(quizAnswers).length === QUIZ_QUESTIONS.length ? 'pointer' : 'not-allowed',
                }}
              >
                Submit Answers &amp; Check Results
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 800,
                  border: 'none',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                🔄 Reset &amp; Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
