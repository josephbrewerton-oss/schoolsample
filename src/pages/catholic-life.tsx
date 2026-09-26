import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import FirstCommunionMasteryLab from '../components/FirstCommunionMasteryLab';
import SevenSacramentsGuide from '../components/SevenSacramentsGuide';
import LiturgicalCalendarGuide from '../components/LiturgicalCalendarGuide';
import LatinMassPrayersChapel from '../components/LatinMassPrayersChapel';
import CreedExplorer from '../components/CreedExplorer';
import CommandmentsMoralGuide from '../components/CommandmentsMoralGuide';
import RosaryMysteryWalk from '../components/RosaryMysteryWalk';
import AstVectorMediaPlayer from '../components/AstVectorMediaPlayer';
import SanctuaryPilgrimQuest from '../components/SanctuaryPilgrimQuest';
import { speakInLanguage, cancelSpeech } from '../engine/translationService';
import { playSuccessChime, triggerHapticSuccess } from '../services/soundHaptics';

export type CatholicLifeTab =
  | 'overview'
  | 'church-tour'
  | 'mass'
  | 'sacraments'
  | 'first-communion'
  | 'rosary'
  | 'creed'
  | 'commandments'
  | 'liturgical-year'
  | 'sacred-objects'
  | 'prayers-latin'
  | 'cst-virtues'
  | 'journal';

interface CSTPrinciple {
  id: string;
  title: string;
  childTitle: string;
  icon: string;
  scripture: string;
  summary: string;
  schoolAction: string;
}

const CST_PRINCIPLES: CSTPrinciple[] = [
  {
    id: 'human-dignity',
    title: 'Dignity of the Human Person',
    childTitle: 'Everyone is Loved & Precious to God (Human Dignity)',
    icon: '👑',
    scripture: 'Genesis 1:27 — "So God created mankind in his own image."',
    summary: 'Every single person is made by God and is deeply loved. No matter where you come from, what you look like, or what you are good at, you are special and have infinite worth in God’s eyes.',
    schoolAction: 'We treat every classmate with kindness and respect, help anyone who is feeling left out, and say NO to bullying.',
  },
  {
    id: 'common-good',
    title: 'The Common Good',
    childTitle: 'Thinking of Everyone, Not Just Ourselves (Common Good)',
    icon: '🤝',
    scripture: '1 Corinthians 12:26 — "If one part suffers, every part suffers with it."',
    summary: 'True happiness happens when we make sure everyone in our class and community has what they need to be safe, healthy, and happy — not just a lucky few.',
    schoolAction: 'We share school toys, take turns, tidy up after ourselves, and think about how our actions make the whole classroom feel.',
  },
  {
    id: 'solidarity',
    title: 'Solidarity & Global Neighbour',
    childTitle: 'We Are One Big World Family (Solidarity)',
    icon: '🌍',
    scripture: 'Luke 10:29-37 — The Parable of the Good Samaritan',
    summary: 'God made us all brothers and sisters across the planet. Loving our neighbour means caring about children living across the ocean just as much as our best friends next door.',
    schoolAction: 'We support CAFOD and our local foodbank, pray for refugee families, and celebrate friends from every culture.',
  },
  {
    id: 'subsidiarity',
    title: 'Subsidiarity & Participation',
    childTitle: 'Everyone Has a Voice & Role (Participation)',
    icon: '🗣️',
    scripture: 'Exodus 18:21 — Choosing wise community leaders',
    summary: 'Everyone, including children, should have a voice in things that affect them. Leaders should listen closely to the people they are helping.',
    schoolAction: 'Our School Council and Eco-monitors share children’s ideas in school meetings and help make our school a happier place.',
  },
  {
    id: 'option-for-poor',
    title: 'Preferential Option for the Poor',
    childTitle: 'Helping Those in Greatest Need (Option for the Poor)',
    icon: '🤲',
    scripture: 'Matthew 25:40 — "Whatever you did for one of the least of these, you did for me."',
    summary: 'Jesus always spent His time with the poor, sick, and lonely. He taught us that the most important test of love is how we look after those who need help the most.',
    schoolAction: 'We collect warm winter coats, donate food, and make sure every child can take part in fun school activities and trips.',
  },
  {
    id: 'dignity-of-work',
    title: 'Dignity of Work & Rights of Workers',
    childTitle: 'Valuing Hard Work & Fairness (Workers’ Rights)',
    icon: '🛠️',
    scripture: 'Genesis 2:15 — The Lord God put man in the Garden to care for it',
    summary: 'Working and learning helps us use our God-given talents. Everyone who works deserves fair pay, safe conditions, and a friendly thank-you.',
    schoolAction: 'We smile and say "thank you" to our school cooks, cleaners, and caretakers every day, and choose Fairtrade snacks.',
  },
  {
    id: 'care-for-creation',
    title: 'Care for God’s Creation (Laudato Si’)',
    childTitle: 'Looking After Our Beautiful Earth (Laudato Si’)',
    icon: '🌱',
    scripture: 'Psalm 24:1 — "The earth is the Lord’s, and everything in it."',
    summary: 'Pope Francis wrote a special letter called Laudato Si’ reminding us that the Earth is our wonderful common home. We are called to protect nature, oceans, and animals for the future.',
    schoolAction: 'We plant school wildflowers for bees, switch off lights, recycle paper, and pick up litter in the playground.',
  },
];

interface SchoolVirtue {
  name: string;
  icon: string;
  patronExample: string;
  definition: string;
  reflectionQuestion: string;
}

const SCHOOL_VIRTUES: SchoolVirtue[] = [
  {
    name: 'Quiet Kindness & Staying Humble (Like St Joseph)',
    icon: '🪵',
    patronExample: 'St Joseph was a hard-working carpenter who faithfully cared for Jesus and Mary without ever boasting or seeking praise.',
    definition: 'Doing the right thing quietly because it is good, with an honest modesty and a peaceful heart.',
    reflectionQuestion: 'Can you do a secret act of kindness today without telling anyone?',
  },
  {
    name: 'Kindness & Forgiving Others (Compassion & Mercy)',
    icon: '❤️',
    patronExample: 'Jesus washed His disciples’ feet at the Last Supper and forgave those who hurt Him, showing that love never gives up.',
    definition: 'Noticing when someone is struggling or hurting, and gently stepping forward to comfort them.',
    reflectionQuestion: 'Who in our class looks lonely or left out, and how can you invite them into your game?',
  },
  {
    name: 'Trusting God & Daily Prayer (Faithfulness)',
    icon: '🕯️',
    patronExample: 'Our Blessed Mother Mary trusted God completely and whispered her joyful "Yes" to God at the Annunciation.',
    definition: 'Starting each morning with prayer, trusting God with our whole heart, and keeping our promises.',
    reflectionQuestion: 'Have you taken a quiet minute today to chat to Jesus in your own words, just like a friend?',
  },
  {
    name: 'Fairness & Telling the Truth (Justice & Integrity)',
    icon: '⚖️',
    patronExample: 'The Prophets and Saints bravely stood up for truth and fairness, even when it was difficult.',
    definition: 'Speaking the honest truth, playing by fair rules, and admitting our mistakes with courage.',
    reflectionQuestion: 'How can you be a fair player when playing games and taking turns on the school pitch?',
  },
  {
    name: 'Cheerful Sharing & Bringing Joy (Generosity & Joy)',
    icon: '✨',
    patronExample: 'St Francis of Assisi gave away all worldly riches to share Christ’s joy with the poorest of the poor.',
    definition: 'Sharing our time, laughter, talents, and treats cheerfully without holding anything back.',
    reflectionQuestion: 'What talent has God blessed you with that you can use to bring a big smile to someone today?',
  },
];

export default function CatholicLifePage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<CatholicLifeTab>(() => {
    const tabParam = searchParams.get('tab');
    if (
      tabParam &&
      [
        'overview',
        'church-tour',
        'mass',
        'sacraments',
        'first-communion',
        'rosary',
        'creed',
        'commandments',
        'liturgical-year',
        'sacred-objects',
        'prayers-latin',
        'cst-virtues',
        'journal',
      ].includes(tabParam)
    ) {
      return tabParam as CatholicLifeTab;
    }
    return 'overview';
  });

  const [selectedCst, setSelectedCst] = useState<CSTPrinciple>(CST_PRINCIPLES[0]);
  const [selectedVirtue, setSelectedVirtue] = useState<SchoolVirtue>(SCHOOL_VIRTUES[0]);

  // Keep state synced with URL search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      if (
        [
          'overview',
          'church-tour',
          'mass',
          'sacraments',
          'first-communion',
          'rosary',
          'creed',
          'commandments',
          'liturgical-year',
          'sacred-objects',
          'prayers-latin',
          'cst-virtues',
          'journal',
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam as CatholicLifeTab);
      }
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (tab: CatholicLifeTab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'overview' ? {} : { tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navCards = [
    {
      tab: 'church-tour' as CatholicLifeTab,
      icon: '⛪',
      title: 'Tour of a Catholic Church',
      desc: 'Interactive AST vector walkthrough of the Narthex, Nave, Ambo, Altar, Tabernacle & Lady Chapel.',
      color: '#0284c7',
      bg: '#f0f9ff',
      badge: 'Interactive Tour (< 4 KB)',
    },
    {
      tab: 'mass' as CatholicLifeTab,
      icon: '⛪',
      title: 'The Holy Mass & Liturgy',
      desc: 'Interactive step-by-step walkthrough, postures, congregation responses & liturgy sequencing game.',
      color: '#4338ca',
      bg: '#eef2ff',
      badge: 'Interactive Walkthrough',
    },
    {
      tab: 'sacraments' as CatholicLifeTab,
      icon: '🕊️',
      title: 'The Seven Sacraments',
      desc: 'Sacraments of Initiation, Healing, and Service. Outward signs, form, matter, scripture & CCC roots.',
      color: '#0891b2',
      bg: '#ecfeff',
      badge: 'Foundations of Grace',
    },
    {
      tab: 'first-communion' as CatholicLifeTab,
      icon: '🍞',
      title: 'First Holy Communion Lab',
      desc: 'Reconciliation preparation, Examination of Conscience, receiving reverently & Thanksgiving.',
      color: '#b45309',
      bg: '#fffbeb',
      badge: 'Parish & Family Companion',
    },
    {
      tab: 'rosary' as CatholicLifeTab,
      icon: '📿',
      title: 'The Holy Rosary',
      desc: 'Interactive virtual decade walk through the Joyful, Luminous, Sorrowful & Glorious Mysteries.',
      color: '#059669',
      bg: '#ecfdf5',
      badge: '20 Mysteries with Scripture',
    },
    {
      tab: 'cst-virtues' as CatholicLifeTab,
      icon: '🤝',
      title: 'Catholic Social Teaching & Virtues',
      desc: '7 Core CST Principles (Human Dignity, Laudato Si\', Common Good) & St Joseph’s school virtues.',
      color: '#15803d',
      bg: '#f0fdf4',
      badge: 'Faith in Action',
    },
    {
      tab: 'creed' as CatholicLifeTab,
      icon: '🏛️',
      title: 'The Creeds of the Church',
      desc: 'Apostles\' Creed and Nicene Creed broken down clause-by-clause with theological clarity.',
      color: '#7c3aed',
      bg: '#f5f3ff',
      badge: 'What We Believe',
    },
    {
      tab: 'commandments' as CatholicLifeTab,
      icon: '📜',
      title: 'Commandments & Beatitudes',
      desc: 'Ten Commandments for young disciples and Jesus’s 8 Beatitudes from the Sermon on the Mount.',
      color: '#c026d3',
      bg: '#fdf4ff',
      badge: 'Moral Compass',
    },
    {
      tab: 'liturgical-year' as CatholicLifeTab,
      icon: '🌿',
      title: 'Liturgical Calendar & Seasons',
      desc: 'Advent, Christmas, Lent, Easter, Pentecost & Ordinary Time. Vestment colours, meanings & feasts.',
      color: '#16a34a',
      bg: '#f0fdf4',
      badge: 'Church Seasons',
    },
    {
      tab: 'sacred-objects' as CatholicLifeTab,
      icon: '🏺',
      title: 'Sacred Objects & Vestments',
      desc: 'Chalice, Monstrance, Ciborium, Tabernacle, Alb, Stole, Chasuble & 10-question recognition quiz.',
      color: '#d97706',
      bg: '#fffbeb',
      badge: 'Sanctuary Tour',
    },
    {
      tab: 'prayers-latin' as CatholicLifeTab,
      icon: '📖',
      title: 'Prayers & Latin Mass Chapel',
      desc: 'Daily school prayers with fill-in blanks + Traditional Latin Mass prayers with spoken audio.',
      color: '#1e3a8a',
      bg: '#eff6ff',
      badge: 'Bilingual Latin & English',
    },
    {
      tab: 'journal' as CatholicLifeTab,
      icon: '📓',
      title: 'My Mass & Prayer Journal',
      desc: 'Personal Sunday Gospel reflections, parish prayer intentions, and stars earned stored on-device.',
      color: '#475569',
      bg: '#f8fafc',
      badge: 'Zero-Cloud Private Journal',
    },
  ];

  return (
    <PageMeta
      title="Catholic Life & Faith Sanctuary"
      description="St Joseph's Whole-School Catholic Faith Sanctuary: Holy Mass, Seven Sacraments, Rosary, Daily Prayers, Creeds, Liturgical Seasons, and Catholic Social Teaching. Unified in one place for all ages."
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem 3.5rem 1rem' }}>
        {/* Whole-School Spiritual Banner */}
        <section
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 100%)',
            borderRadius: '20px',
            color: '#ffffff',
            padding: '2.5rem 2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(30, 27, 75, 0.25)',
            border: '2px solid #facc15',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              fontSize: '12rem',
              opacity: 0.04,
              pointerEvents: 'none',
              lineHeight: 1,
            }}
          >
            ✝️
          </div>

          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span
                style={{
                  background: 'rgba(250, 204, 21, 0.2)',
                  color: '#fef08a',
                  border: '1px solid rgba(250, 204, 21, 0.4)',
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>✝️</span>
                <span>Whole-School &amp; Parish Community</span>
              </span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                🌿 Not Key Staged &bull; For All Year Groups &amp; Families
              </span>
            </div>

            <h1
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                margin: '0 0 0.85rem 0',
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              St Joseph's Catholic Life &amp; Faith Sanctuary
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#e0e7ff',
                margin: '0 0 1.5rem 0',
              }}
            >
              <em>"Christ at the Heart of All That We Do."</em> Our Catholic faith is not a textbook subject split into Key Stages. It is a living, lifelong communion shared by every pupil from Reception to Year 6, our families, catechists, and parish priests.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleTabChange('overview')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: activeTab === 'overview' ? '#facc15' : 'rgba(255, 255, 255, 0.15)',
                  color: activeTab === 'overview' ? '#1e1b4b' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeTab === 'overview' ? '0 2px 8px rgba(250, 204, 21, 0.4)' : 'none',
                }}
              >
                🏠 Sanctuary Overview
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('church-tour')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: activeTab === 'church-tour' ? '#facc15' : 'rgba(255, 255, 255, 0.15)',
                  color: activeTab === 'church-tour' ? '#1e1b4b' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeTab === 'church-tour' ? '0 2px 8px rgba(250, 204, 21, 0.4)' : 'none',
                }}
              >
                ⛪ Church Tour
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('mass')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: activeTab === 'mass' ? '#facc15' : 'rgba(255, 255, 255, 0.15)',
                  color: activeTab === 'mass' ? '#1e1b4b' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                ⛪ The Holy Mass
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('sacraments')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: activeTab === 'sacraments' ? '#facc15' : 'rgba(255, 255, 255, 0.15)',
                  color: activeTab === 'sacraments' ? '#1e1b4b' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🕊️ Seven Sacraments
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('rosary')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: activeTab === 'rosary' ? '#facc15' : 'rgba(255, 255, 255, 0.15)',
                  color: activeTab === 'rosary' ? '#1e1b4b' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                📿 Holy Rosary
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('cst-virtues')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: activeTab === 'cst-virtues' ? '#facc15' : 'rgba(255, 255, 255, 0.15)',
                  color: activeTab === 'cst-virtues' ? '#1e1b4b' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🤝 CST &amp; Virtues
              </button>
            </div>
          </div>
        </section>

        {/* Secondary Category Navigation Bar */}
        <div
          role="navigation"
          aria-label="Catholic Sanctuary Sections"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '10px',
            marginBottom: '1.75rem',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {[
            { id: 'overview', label: '🏠 Overview' },
            { id: 'church-tour', label: '⛪ Church Tour' },
            { id: 'mass', label: '⛪ The Mass' },
            { id: 'sacraments', label: '🕊️ 7 Sacraments' },
            { id: 'first-communion', label: '🍞 First Communion' },
            { id: 'rosary', label: '📿 Holy Rosary' },
            { id: 'cst-virtues', label: '🤝 CST & Virtues' },
            { id: 'creed', label: '🏛️ Creeds' },
            { id: 'commandments', label: '📜 Commandments' },
            { id: 'liturgical-year', label: '🌿 Church Seasons' },
            { id: 'sacred-objects', label: '🏺 Sacred Objects' },
            { id: 'prayers-latin', label: '📖 Prayers & Latin' },
            { id: 'journal', label: '📓 Mass Journal' },
          ].map((item) => {
            const isCur = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id as CatholicLifeTab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${isCur ? '#312e81' : '#cbd5e1'}`,
                  background: isCur ? '#312e81' : '#ffffff',
                  color: isCur ? '#ffffff' : '#334155',
                  fontWeight: isCur ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.12s ease',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW HUB */}
        {activeTab === 'overview' && (
          <div>
            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fef08a',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>🌟</span>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#78350f', margin: '0 0 2px 0' }}>
                    Welcome to our Unified Catholic Life &amp; Faith Portal
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#92400e', margin: 0 }}>
                    Here, children, parents, teachers, and parish catechists can explore every element of Catholic teaching in one unified space.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleTabChange('church-tour')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ⛪ Interactive Church Tour &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('mass')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#d97706',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Walk Through The Mass &rarr;
                </button>
              </div>
            </div>

            {/* Featured Church Tour Vector Player on Overview */}
            <div
              style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '2.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>⛪</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                      Featured: Interactive Tour of a Catholic Church
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                      Narthex, Nave, Ambo, Altar, Tabernacle &amp; Lady Chapel &bull; Continuous vector motion &amp; hotspots
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('church-tour')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Full Tour &amp; Stations &rarr;
                </button>
              </div>
              <AstVectorMediaPlayer
                preset="church-tour"
                autoPlay={true}
                height="480px"
                allowPresetSwitch={true}
              />
            </div>

            {/* Grid of All Sanctuary Modules */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem',
                marginBottom: '3rem',
              }}
            >
              {navCards.map((card) => (
                <div
                  key={card.tab}
                  onClick={() => handleTabChange(card.tab)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.05)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(15, 23, 42, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(15, 23, 42, 0.05)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: card.bg,
                          color: card.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                        }}
                      >
                        {card.icon}
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: card.color,
                          background: card.bg,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        {card.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                      {card.title}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                      {card.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: card.color }}>
                    <span>Explore Section</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Catholic Social Teaching Featurette on Overview */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '2px solid #bbf7d0',
                borderRadius: '18px',
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Living Our Faith
                  </span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#064e3b', margin: '4px 0 0 0' }}>
                    Catholic Social Teaching &amp; School Virtues
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('cst-virtues')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  View All 7 CST Pillars &rarr;
                </button>
              </div>

              <p style={{ fontSize: '0.95rem', color: '#047857', lineHeight: 1.6, maxWidth: '800px', margin: '0 0 1.5rem 0' }}>
                Rooted in the Gospel and papal encyclicals including <em>Laudato Si’</em> and <em>Fratelli Tutti</em>, Catholic Social Teaching equips our students to build a world where the dignity of every person is honoured, creation is protected, and the poorest are cherished.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {CST_PRINCIPLES.slice(0, 3).map((p) => (
                  <div key={p.id} style={{ background: '#ffffff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #dcfce7' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{p.icon}</div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>{p.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CATHOLIC SOCIAL TEACHING & SCHOOL VIRTUES */}
        {activeTab === 'cst-virtues' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.8rem' }}>🤝</span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Catholic Social Teaching (CST) &amp; St Joseph's Virtues
                </h2>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
                How we put the Gospel into daily action: our 7 CST Pillars and our school patron virtues.
              </p>
            </div>

            {/* CST Principles Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* Pillar List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e3a8a', margin: '0 0 6px 0' }}>
                  The 7 Pillars of Catholic Social Teaching
                </h3>
                {CST_PRINCIPLES.map((cst) => {
                  const isSelected = selectedCst.id === cst.id;
                  return (
                    <button
                      key={cst.id}
                      type="button"
                      onClick={() => setSelectedCst(cst)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${isSelected ? '#15803d' : '#e2e8f0'}`,
                        background: isSelected ? '#f0fdf4' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.6rem' }}>{cst.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? '#166534' : '#0f172a' }}>
                          {cst.childTitle}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: isSelected ? '#15803d' : '#64748b', marginTop: '2px' }}>
                          {cst.title} &bull; {cst.scripture}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Pillar Detail Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #bbf7d0',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: '0 4px 14px rgba(21, 128, 61, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{selectedCst.icon}</span>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                        Catholic Social Teaching &bull; {selectedCst.title}
                      </span>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                        {selectedCst.childTitle}
                      </h3>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderLeft: '4px solid #15803d',
                      padding: '10px 14px',
                      borderRadius: '0 8px 8px 0',
                      marginBottom: '1.25rem',
                      fontStyle: 'italic',
                      fontSize: '0.88rem',
                      color: '#334155',
                    }}
                  >
                    📖 {selectedCst.scripture}
                  </div>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                    Catholic Teaching:
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                    {selectedCst.summary}
                  </p>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', margin: '0 0 6px 0' }}>
                    🏫 What This Looks Like at St Joseph’s:
                  </h4>
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #dcfce7',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '0.88rem',
                      color: '#166534',
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedCst.schoolAction}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      speakInLanguage(`${selectedCst.title}. Scripture: ${selectedCst.scripture}. At St Joseph's: ${selectedCst.schoolAction}`, 'en');
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#15803d',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🔊 Listen to Reflection</span>
                  </button>
                </div>
              </div>
            </div>

            {/* St Joseph's School Virtues */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '18px',
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem' }}>⭐</span>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    St Joseph’s School Virtues
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Inspired by our patron St Joseph: humble, faithful, compassionate, and brave.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {SCHOOL_VIRTUES.map((v) => {
                  const isSel = selectedVirtue.name === v.name;
                  return (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVirtue(v)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: `1px solid ${isSel ? '#2563eb' : '#cbd5e1'}`,
                        background: isSel ? '#eff6ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>{v.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isSel ? '#1d4ed8' : '#0f172a' }}>
                        {v.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #dbeafe',
                  borderRadius: '12px',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{selectedVirtue.icon}</span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>
                    {selectedVirtue.name}
                  </h4>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  <strong>Definition:</strong> {selectedVirtue.definition}
                </p>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  <strong>Holy Example:</strong> {selectedVirtue.patronExample}
                </p>
                <div
                  style={{
                    background: '#eff6ff',
                    borderLeft: '4px solid #3b82f6',
                    padding: '10px 14px',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.9rem',
                    color: '#1e40af',
                    fontWeight: 600,
                  }}
                >
                  💡 Daily Pupil Question: {selectedVirtue.reflectionQuestion}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. THE HOLY MASS & SACRAMENTS & OTHER SUB-MODULES */}
        {activeTab !== 'overview' && activeTab !== 'cst-virtues' && (
          <div>
            {activeTab === 'sacraments' && (
              <div style={{ marginBottom: '2rem' }}>
                <SevenSacramentsGuide />
              </div>
            )}

            {activeTab === 'liturgical-year' && (
              <div style={{ marginBottom: '2rem' }}>
                <LiturgicalCalendarGuide />
              </div>
            )}

            {activeTab === 'prayers-latin' && (
              <div style={{ marginBottom: '2rem' }}>
                <LatinMassPrayersChapel />
              </div>
            )}

            {activeTab === 'creed' && (
              <div style={{ marginBottom: '2rem' }}>
                <CreedExplorer />
              </div>
            )}

            {activeTab === 'commandments' && (
              <div style={{ marginBottom: '2rem' }}>
                <CommandmentsMoralGuide />
              </div>
            )}

            {activeTab === 'rosary' && (
              <div style={{ marginBottom: '2rem' }}>
                <RosaryMysteryWalk />
              </div>
            )}

            {activeTab === 'church-tour' && (
              <div style={{ marginBottom: '2.5rem' }}>
                <SanctuaryPilgrimQuest />

                {/* Liturgical Architecture FAQ */}
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '1.25rem 1.5rem',
                    marginTop: '2rem',
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    Catechetical Insights for Pupils &amp; Families
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.82rem', color: '#475569' }}>
                    <div>
                      <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                        Why is a Catholic church shaped like a cross?
                      </strong>
                      Traditional Catholic churches follow a <em>Cruciform</em> (Latin cross) floor plan. It constantly reminds us that Christ’s Cross is the foundation of our faith. Churches are traditionally oriented facing East (<em>Ad Orientem</em>) towards the rising sun, symbolizing the Resurrection and the Second Coming.
                    </div>
                    <div>
                      <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                        Why do we genuflect on the right knee?
                      </strong>
                      Genuflecting (from Latin <em>genu flectere</em>, to bend the knee) is an ancient royal posture reserved only for God. In the Catholic church, we bend our right knee toward the Tabernacle to acknowledge that the King of Kings, Jesus Christ, is truly present in the Holy Eucharist.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sacred-objects' && (
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⛪</span>
                  <span style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>
                    Looking for a full walkthrough of the sanctuary and sacred spaces?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('church-tour')}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Explore Church Tour &rarr;
                </button>
              </div>
            )}

            {(activeTab === 'mass' || activeTab === 'first-communion' || activeTab === 'sacred-objects' || activeTab === 'journal') && (
              <div style={{ marginBottom: '2rem' }}>
                <FirstCommunionMasteryLab />
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation Back to Hub */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            &larr; Back to Catholic Sanctuary Overview
          </button>

          <Link
            to="/learning-zone"
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Explore National Curriculum Lessons</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </PageMeta>
  );
}
