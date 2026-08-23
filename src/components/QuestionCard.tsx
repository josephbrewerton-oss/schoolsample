import React from 'react';

interface Props {
  subject: string;
  unit: string;
  prompt: string;
  displayOptions: string[];
  selectedAnswer: number | null;
  correctIndex: number | null;
  score: number;
  streak: number;
  onSelectOption: (idx: number) => void;
  onNextQuestion: () => void;
}

export const QuestionCard: React.FC<Props> = ({
  subject,
  unit,
  prompt,
  displayOptions,
  selectedAnswer,
  correctIndex,
  score,
  streak,
  onSelectOption,
  onNextQuestion
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
          {subject}: {unit}
        </h2>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706' }}>
          ⭐ Stars: {score} &nbsp;&nbsp; 🔥 Streak: {streak}
        </div>
      </div>

      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.75rem', lineHeight: 1.5 }}>
        {prompt}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayOptions.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === correctIndex;

          let bg = '#f8fafc';
          let border = '#e2e8f0';
          let textColor = '#1e293b';

          if (isSelected) {
            if (isCorrect) {
              bg = '#ecfdf5';
              border = '#10b981';
              textColor = '#065f46';
            } else {
              bg = '#fff7ed';
              border = '#f97316';
              textColor = '#9a3412';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectOption(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '1rem 1.25rem',
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: '10px',
                cursor: selectedAnswer === correctIndex ? 'default' : 'pointer',
                textAlign: 'left',
                fontSize: '1.05rem',
                fontWeight: 500,
                color: textColor,
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: isSelected ? border : '#e2e8f0',
                color: isSelected ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: selectedAnswer === correctIndex ? '#059669' : '#ea580c' }}>
            {selectedAnswer === correctIndex ? '🎉 Correct! Well done.' : '💡 Try again or pick another option!'}
          </div>
          <button
            onClick={onNextQuestion}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Next Question ➔
          </button>
        </div>
      )}
    </div>
  );
};