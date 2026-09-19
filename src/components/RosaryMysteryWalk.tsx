import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';
import {
  playSuccessChime,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticClick,
} from '../services/soundHaptics';

export interface Mystery {
  number: number;
  title: string;
  scripture: string;
  spiritualFruit: string;
  meditation: string;
}

export type MysteryCycle = 'Joyful' | 'Luminous' | 'Sorrowful' | 'Glorious';

const ROSARY_DATA: Record<MysteryCycle, { days: string; mysteries: Mystery[] }> = {
  Joyful: {
    days: 'Mondays & Saturdays',
    mysteries: [
      {
        number: 1,
        title: 'The Annunciation',
        scripture: 'Luke 1:26-38',
        spiritualFruit: 'Humility & Submission to God\'s Will',
        meditation: 'The Archangel Gabriel greets Mary in Nazareth. She responds with total trust: "Behold the handmaid of the Lord; be it done unto me according to thy word."'
      },
      {
        number: 2,
        title: 'The Visitation',
        scripture: 'Luke 1:39-56',
        spiritualFruit: 'Charity & Love of Neighbor',
        meditation: 'Mary journeys in haste to the hill country of Judea to assist her elderly cousin Elizabeth, who proclaims: "Blessed art thou among women, and blessed is the fruit of thy womb!"'
      },
      {
        number: 3,
        title: 'The Nativity',
        scripture: 'Luke 2:1-20',
        spiritualFruit: 'Poverty of Spirit & Detachment from Earthly Riches',
        meditation: 'The Word is made flesh in a humble manger in Bethlehem. Angels sing Gloria in Excelsis Deo, and shepherds come to adore the infant King.'
      },
      {
        number: 4,
        title: 'The Presentation in the Temple',
        scripture: 'Luke 2:22-38',
        spiritualFruit: 'Purity of Heart & Obedience',
        meditation: 'Mary and Joseph present Jesus in the Temple according to the Law. Simeon takes the Child in his arms and prophesies that a sword will pierce Mary\'s soul.'
      },
      {
        number: 5,
        title: 'The Finding of Jesus in the Temple',
        scripture: 'Luke 2:41-52',
        spiritualFruit: 'Zeal for God\'s Glory & True Wisdom',
        meditation: 'After three anxious days searching in Jerusalem, Mary and Joseph find the twelve-year-old Jesus in the Temple, listening to the teachers and asking them questions.'
      }
    ]
  },
  Luminous: {
    days: 'Thursdays',
    mysteries: [
      {
        number: 1,
        title: 'The Baptism of Jesus in the Jordan',
        scripture: 'Matthew 3:13-17',
        spiritualFruit: 'Openness to the Holy Spirit',
        meditation: 'John baptizes Jesus in the Jordan River. The heavens open, the Holy Spirit descends as a dove, and the Father\'s voice proclaims: "This is my beloved Son, with whom I am well pleased."'
      },
      {
        number: 2,
        title: 'The Wedding at Cana',
        scripture: 'John 2:1-12',
        spiritualFruit: 'To Jesus through Mary & Marital Fidelity',
        meditation: 'At the request of His Mother ("Do whatever He tells you"), Jesus performs His first public sign, changing water into wine and manifesting His glory.'
      },
      {
        number: 3,
        title: 'The Proclamation of the Kingdom & Call to Conversion',
        scripture: 'Mark 1:14-15',
        spiritualFruit: 'Repentance & Trust in God\'s Mercy',
        meditation: 'Jesus preaches: "The time is fulfilled, and the kingdom of God is at hand; repent, and believe in the Gospel." He forgives sins and heals the brokenhearted.'
      },
      {
        number: 4,
        title: 'The Transfiguration',
        scripture: 'Matthew 17:1-8',
        spiritualFruit: 'Desire for Holiness & Contemplation',
        meditation: 'On Mount Tabor, Jesus is transfigured before Peter, James, and John. His face shines like the sun and His garments become dazzling white, revealing His divine glory.'
      },
      {
        number: 5,
        title: 'The Institution of the Holy Eucharist',
        scripture: 'Matthew 26:26-29',
        spiritualFruit: 'Eucharistic Adoration & Thanksgiving',
        meditation: 'At the Last Supper, Jesus offers His Body and Blood under the signs of Bread and Wine, establishing the New Covenant and commanding His Apostles: "Do this in memory of me."'
      }
    ]
  },
  Sorrowful: {
    days: 'Tuesdays & Fridays (and Lent)',
    mysteries: [
      {
        number: 1,
        title: 'The Agony in the Garden of Gethsemane',
        scripture: 'Luke 22:39-46',
        spiritualFruit: 'Sorrow for Sin & Conformity to God\'s Will',
        meditation: 'In the Garden of Olives, Jesus contemplates the sins of all humanity and sweats drops of blood, praying: "Father, if you are willing, remove this cup from me; nevertheless, not my will, but yours be done."'
      },
      {
        number: 2,
        title: 'The Scourging at the Pillar',
        scripture: 'John 19:1',
        spiritualFruit: 'Mortification of the Senses & Purity',
        meditation: 'Pilate commands that Jesus be scourged. The Savior endures brutal lashes with patience, bearing our afflictions in His sacred body.'
      },
      {
        number: 3,
        title: 'The Crowning with Thorns',
        scripture: 'Matthew 27:27-31',
        spiritualFruit: 'Moral Courage & Reign of Christ in our Minds',
        meditation: 'Roman soldiers weave a crown of sharp thorns and press it onto His sacred head, clothing Him in a purple cloak and mocking Him: "Hail, King of the Jews!"'
      },
      {
        number: 4,
        title: 'The Carrying of the Cross',
        scripture: 'John 19:17',
        spiritualFruit: 'Patience under the Cross & Perseverance',
        meditation: 'Jesus carries the heavy wooden beam through the streets of Jerusalem to Calvary, meeting His sorrowful Mother and Simon of Cyrene along the Way of the Cross.'
      },
      {
        number: 5,
        title: 'The Crucifixion and Death of Our Lord',
        scripture: 'Luke 23:33-46',
        spiritualFruit: 'Pardoning of Injuries & Self-Sacrificing Love',
        meditation: 'Nailed to the Cross between two thieves, Jesus forgives His executioners, gives Mary to John as Mother, and cries out: "Father, into your hands I commit my spirit."'
      }
    ]
  },
  Glorious: {
    days: 'Wednesdays & Sundays',
    mysteries: [
      {
        number: 1,
        title: 'The Resurrection of Jesus',
        scripture: 'Matthew 28:1-10',
        spiritualFruit: 'Faith & Victorious Hope',
        meditation: 'On the third day, the tomb is empty! Christ is risen from the dead, conquering sin and death forever, and appears in glory to Mary Magdalene and the Apostles.'
      },
      {
        number: 2,
        title: 'The Ascension into Heaven',
        scripture: 'Acts 1:6-11',
        spiritualFruit: 'Christian Hope & Longing for Heaven',
        meditation: 'Forty days after Easter, Jesus blesses His disciples on the Mount of Olives and ascends into Heaven, taking His seat at the right hand of the Father.'
      },
      {
        number: 3,
        title: 'The Descent of the Holy Spirit at Pentecost',
        scripture: 'Acts 2:1-13',
        spiritualFruit: 'Love of God & Apostolate Courage',
        meditation: 'Gathered in the Upper Room with Mary, tongues of fire rest upon the Apostles. Filled with the Holy Spirit, they courageously proclaim the Gospel in all languages.'
      },
      {
        number: 4,
        title: 'The Assumption of the Blessed Virgin Mary',
        scripture: 'Revelation 12:1',
        spiritualFruit: 'Grace of a Happy Death & Devotion to Mary',
        meditation: 'Having completed the course of her earthly life, Mary is assumed body and soul into heavenly glory, where she shines as the first-fruits of the redeemed.'
      },
      {
        number: 5,
        title: 'The Coronation of Mary as Queen of Heaven and Earth',
        scripture: 'Luke 1:48-49',
        spiritualFruit: 'Final Perseverance & Trust in Mary\'s Intercession',
        meditation: 'Christ crowns His Mother as Queen of Heaven, surrounded by all the angels and saints, where she ceaselessly intercedes for her pilgrim children on earth.'
      }
    ]
  }
};

export default function RosaryMysteryWalk() {
  const [activeCycle, setActiveCycle] = useState<MysteryCycle>('Joyful');
  const [activeDecade, setActiveDecade] = useState<number>(0); // 0 to 4
  const [currentBead, setCurrentBead] = useState<number>(0); // 0 to 10 (0: Our Father, 1-10: Hail Marys)

  const currentMystery = ROSARY_DATA[activeCycle].mysteries[activeDecade];

  const handleSelectCycle = (cycle: MysteryCycle) => {
    playClickTone();
    triggerHapticClick();
    setActiveCycle(cycle);
    setActiveDecade(0);
    setCurrentBead(0);
  };

  const handleSelectDecade = (idx: number) => {
    playClickTone();
    triggerHapticClick();
    setActiveDecade(idx);
    setCurrentBead(0);
  };

  const handleAdvanceBead = () => {
    playClickTone();
    triggerHapticClick();
    if (currentBead < 10) {
      setCurrentBead(b => b + 1);
      if (currentBead + 1 === 10) {
        playSuccessChime();
        triggerHapticSuccess();
      }
    } else {
      // Completed decade, advance to next if available
      if (activeDecade < 4) {
        setActiveDecade(d => d + 1);
        setCurrentBead(0);
        playSuccessChime();
        triggerHapticSuccess();
      }
    }
  };

  const handleListen = (text: string) => {
    speakInLanguage(text, 'en');
  };

  return (
    <div style={{ padding: '1.25rem', background: 'var(--stj-surface)', color: 'var(--stj-text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem' }}>📿</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--stj-primary)' }}>
              Pillar 4: The Holy Rosary & Marian Mysteries
            </h2>
            <span className="stj-badge stj-badge-primary">Contemplative Prayer</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--stj-text-muted)', maxWidth: '750px', lineHeight: 1.5 }}>
            St John Paul II described the Rosary as &ldquo;contemplating the face of Christ with Mary.&rdquo; Walk through the 20 mysteries of salvation history and step through the beads interactively.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleListen(`Mystery ${currentMystery.number} of the ${activeCycle} Mysteries: ${currentMystery.title}. Spiritual Fruit: ${currentMystery.spiritualFruit}. ${currentMystery.meditation}`)}
          className="stj-btn stj-btn-secondary"
          style={{ minHeight: '38px', padding: '4px 14px', fontSize: '0.82rem' }}
        >
          <span>🔊</span>
          <span>Listen Meditation</span>
        </button>
      </div>

      {/* Cycle Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {(['Joyful', 'Luminous', 'Sorrowful', 'Glorious'] as const).map((cycle) => (
          <button
            key={cycle}
            type="button"
            onClick={() => handleSelectCycle(cycle)}
            className={`stj-btn ${activeCycle === cycle ? 'stj-btn-primary' : 'stj-btn-secondary'}`}
            style={{ fontSize: '0.84rem', padding: '6px 14px' }}
          >
            {cycle === 'Joyful' && '🌸'}
            {cycle === 'Luminous' && '✨'}
            {cycle === 'Sorrowful' && '✝️'}
            {cycle === 'Glorious' && '👑'}{' '}
            {cycle} Mysteries
          </button>
        ))}
        <span style={{ alignSelf: 'center', fontSize: '0.8rem', color: 'var(--stj-text-muted)', marginLeft: '6px' }}>
          Prayed especially on: <strong>{ROSARY_DATA[activeCycle].days}</strong>
        </span>
      </div>

      {/* Decade Selector (1-5) */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {ROSARY_DATA[activeCycle].mysteries.map((m, idx) => (
          <button
            key={m.number}
            type="button"
            onClick={() => handleSelectDecade(idx)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--stj-radius-sm)',
              border: `2px solid ${idx === activeDecade ? 'var(--stj-primary)' : 'var(--stj-border)'}`,
              background: idx === activeDecade ? 'var(--stj-primary-surface)' : 'var(--stj-canvas)',
              color: 'var(--stj-text)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{m.number}.</span>
            <span>{m.title}</span>
          </button>
        ))}
      </div>

      {/* Main Decade Contemplation Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Left: Scriptural Meditation */}
        <div className="stj-card" style={{ border: '2px solid var(--stj-primary)', background: 'var(--stj-canvas)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="stj-badge stj-badge-primary">Decade {currentMystery.number} of 5</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--stj-primary)' }}>
              📖 {currentMystery.scripture}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 10px 0', color: 'var(--stj-text)' }}>
            {currentMystery.title}
          </h3>

          <div style={{ padding: '8px 12px', background: 'var(--stj-primary-surface)', borderRadius: 'var(--stj-radius-sm)', marginBottom: '1rem', borderLeft: '4px solid var(--stj-primary)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--stj-primary)' }}>
              Spiritual Fruit to Pray For:
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--stj-text)' }}>
              {currentMystery.spiritualFruit}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--stj-text-muted)', marginBottom: '4px' }}>
              Scriptural Meditation:
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--stj-text)' }}>
              {currentMystery.meditation}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              disabled={activeDecade === 0}
              onClick={() => handleSelectDecade(activeDecade - 1)}
              className="stj-btn stj-btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              ← Previous Decade
            </button>
            <button
              type="button"
              disabled={activeDecade === 4}
              onClick={() => handleSelectDecade(activeDecade + 1)}
              className="stj-btn stj-btn-primary"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              Next Decade →
            </button>
          </div>
        </div>

        {/* Right: Interactive Decade Bead Stepper */}
        <div className="stj-card" style={{ background: 'var(--stj-canvas)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                Interactive Decade Stepper
              </h3>
              <span className="stj-badge stj-badge-success">
                {currentBead === 0 ? 'Our Father' : `Hail Mary ${currentBead} / 10`}
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '0 0 1rem 0' }}>
              Tap the beads or click &ldquo;Next Prayer Bead&rdquo; to pray through the decade with rhythmic contemplation.
            </p>

            {/* Visual Beads Track */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', padding: '1rem 0' }}>
              {/* Large Bead: Pater Noster */}
              <button
                type="button"
                onClick={() => {
                  playClickTone();
                  triggerHapticClick();
                  setCurrentBead(0);
                }}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: currentBead === 0 ? 'var(--stj-primary)' : 'var(--stj-surface)',
                  border: '2px solid var(--stj-primary)',
                  color: currentBead === 0 ? '#ffffff' : 'var(--stj-primary)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentBead === 0 ? '0 0 8px var(--stj-primary)' : 'none',
                }}
                title="Our Father (Pater Noster)"
              >
                P
              </button>

              <span style={{ color: 'var(--stj-border)', fontWeight: 800 }}>—</span>

              {/* 10 Small Beads: Ave Maria */}
              {Array.from({ length: 10 }).map((_, i) => {
                const bNum = i + 1;
                const isCurrent = currentBead === bNum;
                const isPassed = currentBead > bNum;
                return (
                  <button
                    key={bNum}
                    type="button"
                    onClick={() => {
                      playClickTone();
                      triggerHapticClick();
                      setCurrentBead(bNum);
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isCurrent
                        ? 'var(--stj-success)'
                        : isPassed
                        ? 'var(--stj-primary-surface)'
                        : 'var(--stj-surface)',
                      border: `2px solid ${isCurrent ? 'var(--stj-success)' : isPassed ? 'var(--stj-primary)' : 'var(--stj-border)'}`,
                      color: isCurrent ? '#ffffff' : isPassed ? 'var(--stj-primary)' : 'var(--stj-text-muted)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCurrent ? '0 0 8px var(--stj-success)' : 'none',
                    }}
                    title={`Hail Mary #${bNum}`}
                  >
                    {bNum}
                  </button>
                );
              })}
            </div>

            {/* Current Active Prayer Box */}
            <div style={{ padding: '10px 14px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-md)', border: '1px solid var(--stj-border)', minHeight: '90px' }}>
              {currentBead === 0 ? (
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--stj-primary)', marginBottom: '2px' }}>
                    1. The Lord&apos;s Prayer (Our Father)
                  </div>
                  <div style={{ fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    &ldquo;Our Father, who art in heaven, hallowed be thy name. Thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread...&rdquo;
                  </div>
                </div>
              ) : currentBead < 10 ? (
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--stj-success)', marginBottom: '2px' }}>
                    Hail Mary (Bead {currentBead} of 10)
                  </div>
                  <div style={{ fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    &ldquo;Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners now and at the hour of our death. Amen.&rdquo;
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--stj-primary)', marginBottom: '2px' }}>
                    10th Hail Mary &amp; Glory Be + Fatima Prayer
                  </div>
                  <div style={{ fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    &ldquo;Glory be to the Father, and to the Son, and to the Holy Spirit... O My Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy.&rdquo;
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={handleAdvanceBead}
              className="stj-btn stj-btn-primary"
              style={{ width: '100%', minHeight: '44px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              {currentBead === 0
                ? '▶ Pray First Hail Mary'
                : currentBead < 10
                ? `▶ Step to Bead ${currentBead + 1}`
                : activeDecade < 4
                ? '🎉 Complete Decade & Begin Next Mystery'
                : '👑 Complete 5-Decade Rosary'}
            </button>
          </div>
        </div>
      </div>

      {/* Anatomy of the Rosary Guide */}
      <div className="stj-card" style={{ background: 'var(--stj-canvas)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 8px 0' }}>
          🌿 How to Pray the Catholic Rosary (Step-by-Step for RCIA)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.82rem', color: 'var(--stj-text-muted)' }}>
          <div style={{ padding: '8px', background: 'var(--stj-surface)', borderRadius: '6px' }}>
            <strong>1. Sign of the Cross &amp; Creed:</strong> Hold the Crucifix, make the Sign of the Cross, and recite the Apostles&apos; Creed.
          </div>
          <div style={{ padding: '8px', background: 'var(--stj-surface)', borderRadius: '6px' }}>
            <strong>2. Initial Beads:</strong> Pray 1 Our Father, 3 Hail Marys (for Faith, Hope, Charity), and 1 Glory Be.
          </div>
          <div style={{ padding: '8px', background: 'var(--stj-surface)', borderRadius: '6px' }}>
            <strong>3. Five Decades:</strong> For each decade, announce the Mystery, pray 1 Our Father, 10 Hail Marys, 1 Glory Be, and the Fatima Prayer.
          </div>
          <div style={{ padding: '8px', background: 'var(--stj-surface)', borderRadius: '6px' }}>
            <strong>4. Concluding Prayers:</strong> Pray the Hail, Holy Queen (Salve Regina) and the Concluding Rosary Prayer.
          </div>
        </div>
      </div>
    </div>
  );
}
