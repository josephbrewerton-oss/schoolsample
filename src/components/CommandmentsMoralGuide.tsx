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
  positiveVirtue: string;
  sinAvoided: string;
  table: 'Love of God (First Tablet: 1-3)' | 'Love of Neighbor (Second Tablet: 4-10)';
  catechismRef: string;
  rciaApplication: string;
}

const TEN_COMMANDMENTS: Commandment[] = [
  {
    number: 1,
    traditionalText: 'I am the Lord your God: you shall not have strange Gods before me.',
    positiveVirtue: 'The Theological Virtues: Faith, Hope, and Charity; adoration of the one true God.',
    sinAvoided: 'Idolatry, superstition, occult practices, atheism, putting money or power above God.',
    table: 'Love of God (First Tablet: 1-3)',
    catechismRef: 'CCC 2084-2141',
    rciaApplication: 'Demands absolute priority for God in daily decisions. We examine what idols (career, vanity, digital addictions, wealth) compete for our heart.'
  },
  {
    number: 2,
    traditionalText: 'You shall not take the name of the Lord your God in vain.',
    positiveVirtue: 'Reverence, holy praise, respect for the Sacred Name of Jesus and holy things.',
    sinAvoided: 'Blasphemy, cursing, perjury, breaking solemn vows or baptismal promises.',
    table: 'Love of God (First Tablet: 1-3)',
    catechismRef: 'CCC 2142-2167',
    rciaApplication: 'Names have holy significance in Scripture. Speaking God\'s Name with awe reflects our inner recognition of His majesty and holiness.'
  },
  {
    number: 3,
    traditionalText: 'Remember to keep holy the Lord\'s Day.',
    positiveVirtue: 'Eucharistic assembly, Sunday Mass attendance, sacred rest, family communion.',
    sinAvoided: 'Missing Sunday Mass without serious cause, servile work that hinders worship and rest.',
    table: 'Love of God (First Tablet: 1-3)',
    catechismRef: 'CCC 2168-2195',
    rciaApplication: 'Sunday is the Eighth Day—the Day of Christ\'s Resurrection. The Eucharist is the source and summit of our week, ordering time toward eternal rest.'
  },
  {
    number: 4,
    traditionalText: 'Honor your father and your mother.',
    positiveVirtue: 'Filial piety, gratitude, care for elderly parents, obedience to lawful authority.',
    sinAvoided: 'Disrespect, neglect of aging parents, rebellion against just civic laws.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2196-2257',
    rciaApplication: 'The Christian family is the "domestic church." Honoring parents reflects God\'s fatherhood and forms the foundation of a healthy, just society.'
  },
  {
    number: 5,
    traditionalText: 'You shall not kill.',
    positiveVirtue: 'Defending human life from conception to natural death; peacemaking, forgiveness.',
    sinAvoided: 'Murder, abortion, euthanasia, anger, hatred, scandal, substance abuse that harms the body.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2258-2330',
    rciaApplication: 'Every human person is created in the image and likeness of God (Imago Dei). Jesus extends this commandment to unbridled anger and insults (Matt 5:21-22).'
  },
  {
    number: 6,
    traditionalText: 'You shall not commit adultery.',
    positiveVirtue: 'Chastity, marital fidelity, purity of heart, respect for God\'s design of sexuality.',
    sinAvoided: 'Adultery, fornication, pornography, lust, masturbation, objectifying others.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2331-2400',
    rciaApplication: 'Chastity integrates human sexuality into authentic self-giving love. In marriage, conjugal love is unitive and procreative, imaging Christ\'s love for the Church.'
  },
  {
    number: 7,
    traditionalText: 'You shall not steal.',
    positiveVirtue: 'Justice, stewardship of creation, honesty in business, fair wages, charity to the poor.',
    sinAvoided: 'Theft, fraud, extortion, paying unjust wages, wasteful consumerism, corruption.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2401-2463',
    rciaApplication: 'Respect for goods includes solidarity with the poor. Catholic Social Teaching emphasizes the universal destination of goods and fair treatment of workers.'
  },
  {
    number: 8,
    traditionalText: 'You shall not bear false witness against your neighbor.',
    positiveVirtue: 'Truthfulness, integrity, defending the good reputation of others, bearing witness to Christ.',
    sinAvoided: 'Lying, slander, gossip (detraction), rash judgment, perjury, hypocrisy.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2464-2513',
    rciaApplication: 'God is Truth. Words have the power to heal or destroy. Christians are called to walk in the light and guard the dignity and good name of their neighbors.'
  },
  {
    number: 9,
    traditionalText: 'You shall not covet your neighbor\'s wife.',
    positiveVirtue: 'Purity of intention, modesty in dress and speech, custody of the eyes and mind.',
    sinAvoided: 'Lustful interior fantasies, viewing people as disposable objects, breaking down marriages.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2514-2533',
    rciaApplication: 'Jesus taught: "Blessed are the pure of heart, for they shall see God." The 9th Commandment heals our internal desires, training our vision to see souls.'
  },
  {
    number: 10,
    traditionalText: 'You shall not covet your neighbor\'s goods.',
    positiveVirtue: 'Poverty of spirit, contentment, gratitude, detached generosity toward the needy.',
    sinAvoided: 'Envy, greed (avarice), jealousy over another\'s success or possessions.',
    table: 'Love of Neighbor (Second Tablet: 4-10)',
    catechismRef: 'CCC 2534-2557',
    rciaApplication: 'Envy is sorrow at another\'s good fortune. True peace comes from desiring God above all earthly treasure and thanking Him for our daily bread.'
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
    meaning: 'Those who recognize their radical spiritual dependence on God rather than self-sufficiency.'
  },
  {
    text: 'Blessed are those who mourn,',
    promise: 'for they shall be comforted.',
    meaning: 'Those who grieve over sin and the suffering of the world; God wipes away every tear.'
  },
  {
    text: 'Blessed are the meek,',
    promise: 'for they shall inherit the earth.',
    meaning: 'Gentle strength under control, avoiding vengeance, mirroring Christ who was gentle and lowly in heart.'
  },
  {
    text: 'Blessed are those who hunger and thirst for righteousness,',
    promise: 'for they shall be satisfied.',
    meaning: 'An ardent longing for God\'s will and justice to prevail in one\'s soul and society.'
  },
  {
    text: 'Blessed are the merciful,',
    promise: 'for they shall obtain mercy.',
    meaning: 'Forgiving offenses, practicing corporal and spiritual works of mercy toward the broken.'
  },
  {
    text: 'Blessed are the pure in heart,',
    promise: 'for they shall see God.',
    meaning: 'Single-minded devotion to God with an undivided, transparent conscience.'
  },
  {
    text: 'Blessed are the peacemakers,',
    promise: 'for they shall be called sons of God.',
    meaning: 'Reconciling conflicts, building communion grounded in truth and love.'
  },
  {
    text: 'Blessed are those who are persecuted for righteousness\' sake,',
    promise: 'for theirs is the kingdom of heaven.',
    meaning: 'Courage to stand faithful to Christ even when mocked or opposed by worldly culture.'
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
              Pillar 3: Life in Christ — The Ten Commandments & Beatitudes
            </h2>
            <span className="stj-badge stj-badge-primary">Moral Theology</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--stj-text-muted)', maxWidth: '750px', lineHeight: 1.5 }}>
            Catholic morality is not a cold list of prohibitions, but a blueprint for authentic human flourishing, freedom, and love as taught by Moses on Sinai and Christ on the Mount of Beatitudes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleListen(`Commandment ${activeCmd.number}: ${activeCmd.traditionalText}. ${activeCmd.rciaApplication}`)}
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
          🪞 RCIA Examination of Conscience
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
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{cmd.traditionalText}</span>
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
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{cmd.traditionalText}</span>
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

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 12px 0', lineHeight: 1.4 }}>
              &ldquo;{activeCmd.traditionalText}&rdquo;
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{ padding: '10px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-md)', borderLeft: '4px solid var(--stj-success)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--stj-success)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  ✓ Positive Virtue Fostered:
                </div>
                <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                  {activeCmd.positiveVirtue}
                </div>
              </div>

              <div style={{ padding: '10px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-md)', borderLeft: '4px solid var(--stj-danger)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--stj-danger)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  ✕ Sin or Distortion Avoided:
                </div>
                <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                  {activeCmd.sinAvoided}
                </div>
              </div>

              <div style={{ padding: '10px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-md)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--stj-primary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  💡 RCIA Adult Formation Context:
                </div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--stj-text)' }}>
                  {activeCmd.rciaApplication}
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
              The New Law of the Gospel: Christ&apos;s Beatitudes
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--stj-text-muted)' }}>
              In the Sermon on the Mount (Matthew 5), Jesus fulfills the Law of Moses. The Beatitudes reveal the heart of Christ and depict the face of true discipleship.
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
                🪞 RCIA Examination of Conscience
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--stj-text-muted)' }}>
                Preparation for the Sacrament of Reconciliation (Penance). Check each commandment to reflect on areas needing God&apos;s healing mercy.
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
                      Commandment {c.number}: {c.traditionalText}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--stj-text-muted)', lineHeight: 1.4 }}>
                      Reflect: Have I struggled with {c.sinAvoided.toLowerCase()}? Am I cultivating {c.positiveVirtue.toLowerCase()}?
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '10px 14px', background: 'var(--stj-primary-surface)', borderRadius: 'var(--stj-radius-md)', border: '1px solid var(--stj-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--stj-primary)', marginBottom: '2px' }}>
              🕊️ Priest Absolution Formula:
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
