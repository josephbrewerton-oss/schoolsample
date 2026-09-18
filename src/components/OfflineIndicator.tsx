// src/components/OfflineIndicator.tsx
import React, { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  // Re-show indicator if connectivity drops
  useEffect(() => {
    if (!isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  if (isOnline || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#064e3b',
        color: '#ecfdf5',
        border: '1px solid #10b981',
        borderRadius: '10px',
        padding: '0.45rem 0.85rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#34d399',
          boxShadow: '0 0 8px #34d399',
          display: 'inline-block',
        }}
      />
      <span>Zero-Data Offline Mode: Running 100% from your device storage</span>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#a7f3d0',
          cursor: 'pointer',
          padding: '0 0.25rem',
          fontSize: '0.9rem',
        }}
        title="Dismiss notice"
      >
        ✕
      </button>
    </div>
  );
};
