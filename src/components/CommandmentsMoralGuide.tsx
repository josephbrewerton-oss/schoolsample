import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';
import {
  playSuccessChime,
  playIncorrectTone,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticError,
  triggerHapticClick,
} from '../services/soundHaptics';

export interface Commandment {
  number: number;
  traditionalText: string;
  childTitle: string;
  positiveVirtue: string;
  sinAvoided: string;
  table: 'Love of God (First Tablet: 1-3)' | 'Love of Neighbor (Second Tablet: 4-10)';
  catechismRef: string;
  howWeLiveIt: string;
  childQuestion: string;
}

const TEN_COMMANDMENTS: Commandment[] = [
  {
    number: 1,
    traditionalText: 'I am the Lord your God: you shall not have strange Gods before me.',
    childTitle: 'Put God First in Everything',
    positiveVirtue: 'Faith, hope, and deep love for God; praying each morning and night.',
    sinAvoided: 'Putting video games, money, toys, or popularity ahead of God and doing what is right.',
    table: 'Love of God (First Tablet: 1-3)',
    catechismRef: 'CCC 2084-2141',
    howWeLiveIt: 'Start each morning with a little prayer to Jesus. Ask yourself: does anything in my day matter more to me than loving God and being kind?',
    childQuestion: 'Did I remember to pray every day and put God first before games or toys?'
  },
  {
    number: 2,
    traditionalText: 'You shall not take the name of the Lord your God in vain.',
    childTitle: 'Use God’s Name with Love and Respect',
    positiveVirtue: 'Speaking the holy names of God and Jesus with praise, gentle awe, and love.',
    sinAvoided: 'Using God’s or Jesus’s name as an angry swear word, or making false promises in God’s name.',
    table: 'Love of God (First Tablet: 1-3)',
    catechismRef: 'CCC 2142-2167',
    howWeLiveIt: 'Names are special. Jesus’s name is holy and full of peace. When we say His name, we do so with reverence, love, and a joyful heart.',
    childQuestion: 'Did I always use God’s and Jesus’s holy name politely, never shouting it in anger?'
  },
  {
    number: 3,
    traditionalText: 'Remember to keep holy the Lord\'s Day.',
    childTitle: 'Keep Sunday Special for God and Family',
    positiveVirtue: 'Going to Holy Mass on Sunday, singing, praying, resting, and enjoying family meals.',
    sinAvoided: 'Skipping Sunday Mass without being ill, or letting busy chores push prayer aside.',
    table: 'Love of God (First Tablet: 1-3)',
    catechismRef: 'CCC 2168-2195',
    howWeLiveIt: 'Sunday is the day Jesus rose from the dead! We celebrate with our parish community at Mass, rest our minds, and spend happy time with family.',
    childQuestion: 'Did I go to Holy Mass on Sunday with my family and try my best to listen and pray?'
  },
  {
    number: 4,
    traditionalText: 'Honor your father and your mother.',
    childTitle: 'Love and Obey Parents, Carers and Teachers',
    positiveVirtue: 'Gratitude, cheerful obedience, helping at home, and respecting grandparents and elders.',
    sinAvoided: 'Answering back rudely, throwing tantrums, disobeying, or ignoring our carers’ advice.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2196-2257',
    howWeLiveIt: 'Our parents and carers look after us with unconditional love. Saying "thank you", helping tidy our bedroom, and listening carefully shows true love.',
    childQuestion: 'Did I listen politely to my parents, carers, and teachers, and help out cheerfully at home?'
  },
  {
    number: 5,
    traditionalText: 'You shall not kill.',
    childTitle: 'Protect Life and Be a Peacemaker',
    positiveVirtue: 'Kindness, protecting life and animals, forgiving others quickly, and welcoming lonely classmates.',
    sinAvoided: 'Fighting, hitting, pushing, name-calling, bullying, or holding onto angry grudges.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2258-2330',
    howWeLiveIt: 'Jesus taught that mean words hurt someone inside just like hitting. We choose to be gentle peacemakers in the playground and classroom.',
    childQuestion: 'Was I kind to everyone today? Did I avoid hitting, teasing, or leaving someone out?'
  },
  {
    number: 6,
    traditionalText: 'You shall not commit adultery.',
    childTitle: 'Keep Your Promises & Respect Special Friendships',
    positiveVirtue: 'Loyalty in friendships, honoring family promises, and treating our bodies with respect.',
    sinAvoided: 'Breaking promises, gossiping about friends, or treating people’s bodies without respect.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2331-2400',
    howWeLiveIt: 'Our bodies are holy temples of the Holy Spirit. We treat boys and girls with total respect, value marriage and family, and always keep our word.',
    childQuestion: 'Did I keep my promises, act as a true and loyal friend, and respect my body and others?'
  },
  {
    number: 7,
    traditionalText: 'You shall not steal.',
    childTitle: 'Do Not Take What Belongs to Others',
    positiveVirtue: 'Honesty, asking before borrowing, returning things safely, and sharing with those in need.',
    sinAvoided: 'Taking money, toys, or snacks without permission; cheating in games, tests, or schoolwork.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2401-2463',
    howWeLiveIt: 'Respecting what belongs to others is a sign of fairness. If you borrow a pencil or book, return it safely. Share generously with those who have less.',
    childQuestion: 'Did I ask before borrowing anything, avoid taking what isn’t mine, and play fairly?'
  },
  {
    number: 8,
    traditionalText: 'You shall not bear false witness against your neighbor.',
    childTitle: 'Always Tell the Truth and Never Gossip',
    positiveVirtue: 'Honesty, courage to admit mistakes, standing up for friends, and speaking kindly.',
    sinAvoided: 'Telling lies, blaming someone else for our own mistake, spreading rumours, or whispering mean tales.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2464-2513',
    howWeLiveIt: 'Truth builds trust. When you make a mistake, be brave and tell the truth. Jesus said the truth will set us free. Always protect other people’s good name.',
    childQuestion: 'Did I tell the honest truth, without making up stories or blaming others for my mistakes?'
  },
  {
    number: 9,
    traditionalText: 'You shall not covet your neighbor\'s wife.',
    childTitle: 'Keep a Pure Heart and Be Kind in Your Thoughts',
    positiveVirtue: 'Thinking pure, joyful, and clean thoughts; wishing the very best for everyone’s family.',
    sinAvoided: 'Holding mean, spiteful, or jealous thoughts about other people’s families or friendships.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2514-2533',
    howWeLiveIt: 'Jesus said: "Blessed are the pure in heart, for they will see God." Fill your mind with good books, kind stories, and cheerful prayers.',
    childQuestion: 'Did I keep my thoughts kind and clean, wishing happiness for my friends and their families?'
  },
  {
    number: 10,
    traditionalText: 'You shall not covet your neighbor\'s goods.',
    childTitle: 'Be Thankful for What You Have',
    positiveVirtue: 'Gratitude, being happy with our blessings, and cheering on friends when they succeed.',
    sinAvoided: 'Feeling jealous, envious, or grumpy because a classmate got a new game, toy, or prize.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2534-2557',
    howWeLiveIt: 'When your friend gets a lovely gift or does well in a test, be happy for them! Say "Well done!" and thank God for everything He gives you.',
    childQuestion: 'Was I grateful for all my blessings, and truly happy for my friends without feeling jealous?'
  }
];

export interface Beatitude {
  text: string;
  promise: string;
  meaning: string;
}

const BEATITUDES: Beatitude[] = [
  {
    text: 'Blessed are the poor in spirit,',
    promise: 'for theirs is the kingdom of heaven.',
    meaning: 'Those who know they need God’s love and guidance every day, never boasting or acting superior.'
  },
  {
    text: 'Blessed are those who mourn,',
    promise: 'for they shall be comforted.',
    meaning: 'Those who feel sorrow when people are sad or hurting; God gently wraps them in His loving peace.'
  },
  {
    text: 'Blessed are the meek,',
    promise: 'for they shall inherit the earth.',
    meaning: 'Those who are gentle, patient, and humble, never pushing their way to the front or shouting others down.'
  },
  {
    text: 'Blessed are those who hunger and thirst for righteousness,',
    promise: 'for they shall be satisfied.',
    meaning: 'Those who eagerly want fairness, truth, and kindness to win in our school and world.'
  },
  {
    text: 'Blessed are the merciful,',
    promise: 'for they shall obtain mercy.',
    meaning: 'Those who forgive easily, offer second chances, and help anyone having a difficult day.'
  },
  {
    text: 'Blessed are the pure in heart,',
    promise: 'for they shall see God.',
    meaning: 'Those whose hearts are honest, innocent, and focused on loving God and helping others.'
  },
  {
    text: 'Blessed are the peacemakers,',
    promise: 'for they shall be called sons of God.',
    meaning: 'Those who calm down arguments, help friends make up, and spread peace on the playground.'
  },
  {
    text: 'Blessed are those who are persecuted for righteousness\' sake,',
    promise: 'for theirs is the kingdom of heaven.',
    meaning: 'Those who are brave enough to do the right thing and follow Jesus, even if others tease them.'
  }
];

export default function CommandmentsMoralGuide() {
  const [selectedNum, setSelectedNum] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState<'commandments' | 'beatitudes' | 'examination'>('commandments');
  const [examChecklist, setExamChecklist] = useState<Record<number, boolean>>({});

  const activeCmd = TEN_COMMANDMENTS.find(c => c.number === selectedNum) || TEN_COMMANDMENTS[0];

  const handleSelectCmd = (num: number) => {
    playClickTone();
    triggerHapticClick();
    setSelectedNum(num);
  };

  const handleListen = (text: string) => {
    speakInLanguage(text, 'en');
  };

  const toggleCheck = (num: number) => {
    playClickTone();
    triggerHapticClick();
    setExamChecklist(prev => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <div style={{ padding: '1.25rem', background: 'var(--stj-surface)', color: 'var(--stj-text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem' }}>⚖️</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--stj-primary)' }}>
              God&apos;s Ten Commandments &amp; The Beatitudes
            </h2>
            <span className="stj-badge stj-badge-primary">For All Ages &bull; Whole School</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--stj-text-muted)', maxWidth: '750px', lineHeight: 1.5 }}>
            God&apos;s loving rules to guide our lives and Jesus&apos;s 8 Beatitudes for true joy. Discover how each commandment helps us love God and care for our neighbour.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleListen(`Commandment ${activeCmd.number}: ${activeCmd.childTitle}. ${activeCmd.traditionalText}. ${activeCmd.howWeLiveIt}`)}
          className="stj-btn stj-btn-secondary"
          style={{ minHeight: '38px', padding: '4px 14px', fontSize: '0.82rem' }}
        >
          <span>🔊</span>
          <span>Listen Commandment {activeCmd.number}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => {
            playClickTone();
            setActiveSubTab('commandments');
          }}
          className={`stj-btn ${activeSubTab === 'commandments' ? 'stj-btn-primary' : 'stj-btn-secondary'}`}
          style={{ fontSize: '0.84rem', padding: '6px 14px' }}
        >
          📜 The Ten Commandments (Decalogue)
        </button>
        <button
          type="button"
          onClick={() => {
            playClickTone();
            setActiveSubTab('beatitudes');
          }}
          className={`stj-btn ${activeSubTab === 'beatitudes' ? 'stj-btn-primary' : 'stj-btn-secondary'}`}
          style={{ fontSize: '0.84rem', padding: '6px 14px' }}
        >
          🕊️ The Beatitudes (Matthew 5)
        </button>
        <button
          type="button"
          onClick={() => {
            playClickTone();
            setActiveSubTab('examination');
          }}
          className={`stj-btn ${activeSubTab === 'examination' ? 'stj-btn-primary' : 'stj-btn-secondary'}`}
          style={{ fontSize: '0.84rem', padding: '6px 14px' }}
        >
          🪞 Examination of Conscience
        </button>
      </div>

      {/* TAB 1: COMMANDMENTS EXPLORER */}
      {activeSubTab === 'commandments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Column 1: List of 10 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '540px', overflowY: 'auto', paddingRight: '4px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--stj-primary)', letterSpacing: '0.05em' }}>
              First Tablet: Love of God (1-3)
            </div>
            {TEN_COMMANDMENTS.filter(c => c.number <= 3).map((cmd) => (
              <button
                key={cmd.number}
                type="button"
                onClick={() => handleSelectCmd(cmd.number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--stj-radius-md)',
                  border: `2px solid ${cmd.number === selectedNum ? 'var(--stj-primary)' : 'var(--stj-border)'}`,
                  background: cmd.number === selectedNum ? 'var(--stj-primary-surface)' : 'var(--stj-canvas)',
                  color: 'var(--stj-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '0.85rem', width: '22px' }}>{cmd.number}.</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--stj-primary)' }}>{cmd.childTitle}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--stj-text-muted)', fontStyle: 'italic' }}>{cmd.traditionalText}</div>
                </div>
              </button>
            ))}

            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--stj-primary)', letterSpacing: '0.05em', marginTop: '10px' }}>
              Second Tablet: Love of Neighbor (4-10)
            </div>
            {TEN_COMMANDMENTS.filter(c => c.number >= 4).map((cmd) => (
              <button
                key={cmd.number}
                type="button"
                onClick={() => handleSelectCmd(cmd.number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--stj-radius-md)',
                  border: `2px solid ${cmd.number === selectedNum ? 'var(--stj-primary)' : 'var(--stj-border)'}`,
                  background: cmd.number === selectedNum ? 'var(--stj-primary-surface)' : 'var(--stj-canvas)',
                  color: 'var(--stj-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '0.85rem', width: '22px' }}>{cmd.number}.</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--stj-primary)' }}>{cmd.childTitle}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--stj-text-muted)', fontStyle: 'italic' }}>{cmd.traditionalText}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Column 2: Detailed Moral Profile */}
          <div className="stj-card" style={{ border: '2px solid var(--stj-primary)', background: 'var(--stj-canvas)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="stj-badge stj-badge-primary">Commandment {activeCmd.number}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stj-primary)' }}>
                {activeCmd.table}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--stj-primary)' }}>
              {activeCmd.childTitle}
            </h3>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--stj-text-muted)', margin: '0 0 12px 0' }}>
              &ldquo;{activeCmd.traditionalText}&rdquo;
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{ padding: '10px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-md)', borderLeft: '4px solid var(--stj-success)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--stj-success)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  ✓ Positive Virtue to Practice:
                </div>
                <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                  {activeCmd.positiveVirtue}
                </div>
              </div>

              <div style={{ padding: '10px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-md)', borderLeft: '4px solid var(--stj-danger)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--stj-danger)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  ✕ Sin or Slip to Avoid:
                </div>
                <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                  {activeCmd.sinAvoided}
                </div>
              </div>

              <div style={{ padding: '10px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-md)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--stj-primary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  💡 How We Live This as Followers of Jesus:
                </div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--stj-text)' }}>
                  {activeCmd.howWeLiveIt}
                </div>
              </div>
            </div>

            <div style={{ padding: '6px 12px', background: 'var(--stj-surface)', borderRadius: '6px', fontSize: '0.8rem', display: 'inline-block' }}>
              🏛️ <strong>Catechism Reference:</strong> {activeCmd.catechismRef}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BEATITUDES */}
      {activeSubTab === 'beatitudes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--stj-canvas)', borderRadius: 'var(--stj-radius-md)', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--stj-primary)' }}>
              Jesus&apos;s Beatitudes: 8 Ways to True Joy
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--stj-text-muted)' }}>
              In the Sermon on the Mount (Matthew 5), Jesus taught us how to be truly happy and live like Him.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
            {BEATITUDES.map((b, idx) => (
              <div
                key={idx}
                className="stj-card"
                style={{
                  background: 'var(--stj-canvas)',
                  border: '1px solid var(--stj-border)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--stj-primary)', marginBottom: '4px' }}>
                    &ldquo;{b.text}&rdquo;
                  </div>
                  <div style={{ fontStyle: 'italic', fontWeight: 600, fontSize: '0.88rem', color: 'var(--stj-success)', marginBottom: '8px' }}>
                    &ldquo;{b.promise}&rdquo;
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', lineHeight: 1.5 }}>
                    {b.meaning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXAMINATION OF CONSCIENCE */}
      {activeSubTab === 'examination' && (
        <div className="stj-card" style={{ background: 'var(--stj-canvas)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800 }}>
                🪞 A Child&apos;s Loving Examination of Conscience
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--stj-text-muted)' }}>
                Preparing for the Sacrament of Reconciliation (Confession). Read each question gently to see where you can ask Jesus for His forgiving love and a fresh start.
              </p>
            </div>
            <span className="stj-badge stj-badge-primary">Confession Prep</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TEN_COMMANDMENTS.map((c) => {
              const isChecked = examChecklist[c.number] || false;
              return (
                <div
                  key={c.number}
                  onClick={() => toggleCheck(c.number)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--stj-radius-md)',
                    background: isChecked ? 'var(--stj-success-surface)' : 'var(--stj-surface)',
                    border: `1px solid ${isChecked ? 'var(--stj-success)' : 'var(--stj-border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--stj-text)', marginBottom: '2px' }}>
                      Commandment {c.number}: {c.childTitle}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', lineHeight: 1.4 }}>
                      💭 {c.childQuestion}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '10px 14px', background: 'var(--stj-primary-surface)', borderRadius: 'var(--stj-radius-md)', border: '1px solid var(--stj-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--stj-primary)', marginBottom: '2px' }}>
              🕊️ The Priest&apos;s Words of Absolution &amp; Mercy:
            </div>
            <div style={{ fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.5 }}>
              &ldquo;God, the Father of mercies, through the death and resurrection of his Son has reconciled the world to himself and sent the Holy Spirit among us for the forgiveness of sins; through the ministry of the Church may God give you pardon and peace, and I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit. Amen.&rdquo;
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
