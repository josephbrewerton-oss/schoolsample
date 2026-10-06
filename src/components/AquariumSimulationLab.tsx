// src/components/AquariumSimulationLab.tsx
/**
 * St Joseph's Aquarium Living Habitat & Hydrodynamics Lab
 * 
 * Interactive pedagogical marine simulation providing direct boid manipulation,
 * hydrodynamic current flow adjustments, fish feeding, lighting shifts,
 * and Catholic environmental stewardship reflections on marine life.
 */

import React, { useState, useEffect } from 'react';
import type { AstVectorMediaPlayerHandle } from './AstVectorMediaPlayer';

export interface AquariumSimulationLabProps {
  playerRef?: React.RefObject<AstVectorMediaPlayerHandle | null>;
  onCloseGameMode?: () => void;
}

interface FishSpeciesInfo {
  name: string;
  scientific: string;
  family: string;
  diet: string;
  habitat: string;
  color: string;
  icon: string;
  pedagogicalFact: string;
}

const REEF_SPECIES: FishSpeciesInfo[] = [
  {
    name: 'Ocellaris Clownfish',
    scientific: 'Amphiprion ocellaris',
    family: 'Pomacentridae',
    diet: 'Omnivore (plankton & algae)',
    habitat: 'Sea anemone tentacles',
    color: '#f97316',
    icon: '🐠',
    pedagogicalFact: 'Possesses a special mucus coating preventing anemone nematocysts (stinging cells) from firing, forming a mutualistic symbiosis.',
  },
  {
    name: 'Royal Blue Tang',
    scientific: 'Paracanthurus hepatus',
    family: 'Acanthuridae (Surgeonfish)',
    diet: 'Herbivore (macroalgae)',
    habitat: 'Coral reef crests & surge channels',
    color: '#0284c7',
    icon: '🐟',
    pedagogicalFact: 'Has sharp caudal spines resembling scalpels at the base of its tail for defense against predators.',
  },
  {
    name: 'Yellow Tang',
    scientific: 'Zebrasoma flavescens',
    family: 'Acanthuridae',
    diet: 'Herbivore (benthic turf algae)',
    habitat: 'Shallow lagoon reefs & reef flats',
    color: '#eab308',
    icon: '🐠',
    pedagogicalFact: 'Cleans algae off sea turtle carapaces in Hawaiian marine reserves, maintaining ecological reef equilibrium.',
  },
  {
    name: 'Neon Tetra',
    scientific: 'Paracheirodon innesi',
    family: 'Characidae',
    diet: 'Micro-carnivore (copepods & brine)',
    habitat: 'Blackwater tributaries & shallows',
    color: '#ec4899',
    icon: '🐟',
    pedagogicalFact: 'Reflective horizontal iridescent stripes are produced by structural photonic iridophores that scatter light in turbid waters.',
  },
  {
    name: 'Regal Angelfish',
    scientific: 'Pygoplites diacanthus',
    family: 'Pomacanthidae',
    diet: 'Spongivore (sea sponges & tunicates)',
    habitat: 'Caves & steep coral overhangs',
    color: '#10b981',
    icon: '🐠',
    pedagogicalFact: 'Distinctive alternating white, orange, and blue bars serve as disruptive camouflage, breaking its outline under flickering sun caustics.',
  },
  {
    name: 'Purple Fairy Basslet',
    scientific: 'Gramma loreto',
    family: 'Grammatidae (Royal Gramma)',
    diet: 'Planktivore & ectoparasite cleaner',
    habitat: 'Reef drop-offs & cavern ceilings',
    color: '#a855f7',
    icon: '💜',
    pedagogicalFact: 'Exhibits negative gravitropism: often swims upside down along cave ceilings, aligning its dorsal fin with nearby solid surfaces.',
  },
  {
    name: 'Turquoise Discus',
    scientific: 'Symphysodon aequifasciatus',
    family: 'Cichlidae',
    diet: 'Detritivore & insect larvae',
    habitat: 'Quiet forested floodplains',
    color: '#06b6d4',
    icon: '🐡',
    pedagogicalFact: 'Parents nourish their young fry with specialized epidermal mucus secreted across their skin, an adaptation known as parental dermal feeding.',
  },
  {
    name: 'Sunset Platy',
    scientific: 'Xiphophorus maculatus',
    family: 'Poeciliidae',
    diet: 'Omnivore (crustaceans & plant matter)',
    habitat: 'Freshwater canals & coastal springs',
    color: '#ea580c',
    icon: '🧡',
    pedagogicalFact: 'Livebearers that produce fully swimming fry rather than laying eggs, demonstrating ovoviviparous reproduction.',
  },
];

export default function AquariumSimulationLab({
  playerRef,
  onCloseGameMode,
}: AquariumSimulationLabProps): React.JSX.Element {
  const [schoolDensity, setSchoolDensity] = useState<number>(12);
  const [waterFlow, setWaterFlow] = useState<number>(1.0);
  const [waterTemp, setWaterTemp] = useState<number>(25.5);
  const [lightingMode, setLightingMode] = useState<'day' | 'twilight' | 'reef-dawn'>('day');
  const [fedCount, setFedCount] = useState<number>(0);
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpeciesInfo>(REEF_SPECIES[0]);
  const [lastActionToast, setLastActionToast] = useState<string>('Tank habitat stabilized at 60 FPS');

  // Trigger feeding action into player iframe
  const handleFeedFish = () => {
    setFedCount((c) => c + 1);
    setLastActionToast('🍞 Food Flakes Dropped: Fish converging to feed!');
    playerRef?.current?.postToPlayer({
      type: 'SIM_ACTION',
      action: 'FEED_FISH',
    });
    playerRef?.current?.postToPlayer({
      type: 'AUDIO_PLAY_CLICK',
      freq: 880,
    });
  };

  // Tap glass action
  const handleTapGlass = () => {
    setLastActionToast('👋 Tapped Tank Glass: Acoustic shockwave scattered boids!');
    playerRef?.current?.postToPlayer({
      type: 'SIM_ACTION',
      action: 'TAP_GLASS',
    });
    playerRef?.current?.postToPlayer({
      type: 'AUDIO_PLAY_SPRING',
      freq: 320,
    });
  };

  // Adjust school size
  const handleDensityChange = (val: number) => {
    setSchoolDensity(val);
    setLastActionToast(`🐟 School density set to ${val} fish (${val * 24 + 120} active vector points)`);
    playerRef?.current?.postToPlayer({
      type: 'SET_VAR',
      name: 'schoolSize',
      value: val,
    });
  };

  // Adjust water flow
  const handleFlowChange = (val: number) => {
    setWaterFlow(val);
    setLastActionToast(`🌊 Water hydrodynamic flow set to ${val.toFixed(1)}x velocity`);
    playerRef?.current?.postToPlayer({
      type: 'SET_VAR',
      name: 'kelpTurbulence',
      value: val,
    });
  };

  return (
    <div
      style={{
        padding: '1.25rem',
        background: '#090d16',
        color: '#f8fafc',
        borderTop: '1px solid #1e293b',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🐠</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
              Aquarium Living Habitat &amp; Hydrodynamics Lab
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Autonomous 60 FPS Boid Schooling &bull; CPA Biology &amp; Fluid Physics &bull; Environmental Care
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '6px',
              background: '#064e3b',
              color: '#34d399',
              border: '1px solid #059669',
            }}
          >
            ⚡ 60.0 FPS Reflow Budget
          </span>
          {onCloseGameMode && (
            <button
              type="button"
              onClick={onCloseGameMode}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#1e293b',
                color: '#cbd5e1',
                border: '1px solid #475569',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🎬 Switch to Lesson Video &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Controls & Field Guide */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {/* Panel 1: Live Interactive Tank Apparatus */}
        <div
          style={{
            background: '#0f172a',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #334155',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
              🎛️ HABITAT CONTROLS &amp; FEEDING
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Interactive Physics</span>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={handleFeedFish}
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.1s ease',
              }}
            >
              <span>🍞</span> Drop Food Flakes ({fedCount})
            </button>

            <button
              type="button"
              onClick={handleTapGlass}
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                color: '#0f172a',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(56, 189, 248, 0.3)',
                transition: 'all 0.1s ease',
              }}
            >
              <span>👋</span> Tap Tank Glass
            </button>
          </div>

          {/* Slider 1: School Size Density */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Active Fish Density (Boid Load):</span>
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>{schoolDensity} Fish</span>
            </div>
            <input
              type="range"
              min="4"
              max="30"
              step="1"
              value={schoolDensity}
              onChange={(e) => handleDensityChange(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
              <span>4 Fish (Calm Reef)</span>
              <span>12 Baseline</span>
              <span>30 Fish (Stress Test)</span>
            </div>
          </div>

          {/* Slider 2: Water Current Flow */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Hydrodynamic Current Flow:</span>
              <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800 }}>{waterFlow.toFixed(1)}x Speed</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.2"
              value={waterFlow}
              onChange={(e) => handleFlowChange(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#34d399', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#64748b', marginTop: '2px' }}>
              <span>0.2x Lagoon Still</span>
              <span>1.0x Tidal Drift</span>
              <span>3.0x Surge Rapids</span>
            </div>
          </div>

          {/* Lighting Mode Selector */}
          <div>
            <span style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
              Reef Lighting Spectrum:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'day', label: '☀️ Tropical Sun', color: '#facc15' },
                { id: 'twilight', label: '🌙 Twilight Glow', color: '#818cf8' },
                { id: 'reef-dawn', label: '🌅 Coral Dawn', color: '#fb923c' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setLightingMode(mode.id as any);
                    setLastActionToast(`💡 Lighting spectrum adjusted to ${mode.label}`);
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: lightingMode === mode.id ? 'rgba(56, 189, 248, 0.2)' : '#1e293b',
                    border: lightingMode === mode.id ? '1px solid #38bdf8' : '1px solid #334155',
                    color: lightingMode === mode.id ? '#ffffff' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Species Field Guide & Pedagogical Identification */}
        <div
          style={{
            background: '#0f172a',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #334155',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
              📖 REEF SPECIES FIELD GUIDE
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Select to Inspect</span>
          </div>

          {/* Quick Species Pill Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
            {REEF_SPECIES.map((sp) => {
              const isSelected = selectedSpecies.name === sp.name;
              return (
                <button
                  key={sp.name}
                  type="button"
                  onClick={() => setSelectedSpecies(sp)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: isSelected ? sp.color : '#1e293b',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    border: isSelected ? `1px solid ${sp.color}` : '1px solid #334155',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <span>{sp.icon}</span>
                  <span>{sp.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Species Detail Card */}
          <div
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: '#1e293b',
              border: `1px solid ${selectedSpecies.color}`,
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>{selectedSpecies.icon}</span>
                <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>{selectedSpecies.name}</strong>
              </div>
              <span style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.72rem' }}>
                {selectedSpecies.scientific}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '6px', color: '#cbd5e1', fontSize: '0.72rem' }}>
              <div><strong>Family:</strong> {selectedSpecies.family}</div>
              <div><strong>Diet:</strong> {selectedSpecies.diet}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Habitat:</strong> {selectedSpecies.habitat}</div>
            </div>

            <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '6px', color: '#e2e8f0', fontSize: '0.74rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>💡 Adaptative Feature: </span>
              {selectedSpecies.pedagogicalFact}
            </div>
          </div>
        </div>
      </div>

      {/* Catholic Reflection Banner on Marine Stewardship */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e1b4b 0%, #0f172a 100%)',
          borderRadius: '10px',
          border: '1px solid #4338ca',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.78rem',
          color: '#e0e7ff',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🕊️</span>
        <div>
          <strong style={{ color: '#ffffff' }}>Catholic Stewardship of Aquatic Creation &bull; Genesis 1:20-22</strong>
          <p style={{ margin: '2px 0 0', color: '#c7d2fe', lineHeight: 1.4 }}>
            <em>&ldquo;And God said: Let the waters bring forth abundantly the moving creature that hath life... And God saw that it was good.&rdquo;</em>{' '}
            As taught in Pope Francis&apos;s encyclical <em>Laudato Si&apos;</em>, preserving clean oceans and aquatic biodiversity is our sacred duty as stewards of God&apos;s living creation.
          </p>
        </div>
      </div>

      {/* Action Toast Readout */}
      <div
        style={{
          marginTop: '0.75rem',
          fontSize: '0.72rem',
          color: '#34d399',
          fontFamily: 'ui-monospace, monospace',
          textAlign: 'right',
        }}
      >
        &gt; {lastActionToast}
      </div>
    </div>
  );
}
