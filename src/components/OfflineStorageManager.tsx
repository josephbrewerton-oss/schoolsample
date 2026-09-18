// src/components/OfflineStorageManager.tsx
import React, { useState, useEffect } from 'react';
import {
  isOfflineSyncComplete,
  getOfflineSyncDate,
  syncEntireCurriculumOffline,
  checkDeviceStorageSupport,
  type SyncProgress,
} from '../services/offlineSync';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface OfflineStorageManagerProps {
  colorMode?: 'light' | 'dark';
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineStorageManager: React.FC<OfflineStorageManagerProps> = ({
  colorMode = 'light',
  isOpen,
  onClose,
}) => {
  const isDark = colorMode === 'dark';
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [isSynced, setIsSynced] = useState<boolean>(isOfflineSyncComplete);
  const [syncDate, setSyncDate] = useState<string | null>(getOfflineSyncDate);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const [storageInfo, setStorageInfo] = useState<{
    persisted: boolean;
    quotaMb?: number;
    usageMb?: number;
  }>({ persisted: false });

  useEffect(() => {
    if (isOpen) {
      setIsSynced(isOfflineSyncComplete());
      setSyncDate(getOfflineSyncDate());
      checkDeviceStorageSupport().then((info) => {
        setStorageInfo({
          persisted: info.persisted,
          quotaMb: info.quotaMb,
          usageMb: info.usageMb,
        });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartSync = async () => {
    setSyncing(true);
    setProgress({
      total: 100,
      completed: 0,
      percentage: 0,
      currentFile: 'Initializing offline storage...',
      isComplete: false,
    });

    const success = await syncEntireCurriculumOffline((p) => {
      setProgress(p);
    });

    setSyncing(false);
    if (success) {
      setIsSynced(true);
      setSyncDate(new Date().toLocaleDateString());
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderRadius: '16px',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
          color: isDark ? '#f8fafc' : '#0f172a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💾</span>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Store Portal on Device
              </h2>
              <span style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                Zero-Data Offline Engine for Developing Regions
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              color: isDark ? '#94a3b8' : '#64748b',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Status Card */}
        <div
          style={{
            backgroundColor: isSynced
              ? isDark ? '#064e3b' : '#ecfdf5'
              : isDark ? '#1e293b' : '#f8fafc',
            border: `1px solid ${isSynced ? '#10b981' : isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{isSynced ? '✅' : '📶'}</span>
            <strong style={{ fontSize: '0.9rem', color: isSynced ? '#059669' : undefined }}>
              {isSynced
                ? 'Curriculum 100% Stored on Device'
                : 'Not Yet Fully Downloaded for Offline Use'}
            </strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
            {isSynced
              ? `All curriculum seeds, questions, and audio run locally. You can put your device into Airplane Mode or turn off mobile data completely.`
              : 'Save all curriculum substrates into your browser storage so students can study with zero cellular data consumption.'}
          </p>
          {isSynced && syncDate && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
              Last synced: {syncDate}
            </div>
          )}
        </div>

        {/* Progress Bar (During Sync) */}
        {syncing && progress && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, color: isDark ? '#94a3b8' : '#475569' }}>
                {progress.currentFile}
              </span>
              <span style={{ fontWeight: 700, color: '#2563eb' }}>
                {progress.percentage}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress.percentage}%`,
                  height: '100%',
                  backgroundColor: '#2563eb',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={handleStartSync}
            disabled={syncing}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: syncing ? 'not-allowed' : 'pointer',
              opacity: syncing ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
            }}
          >
            <span>{syncing ? '⏳' : '📥'}</span>
            <span>
              {syncing
                ? 'Downloading & Storing on Device...'
                : isSynced
                ? 'Update / Re-verify Device Storage'
                : 'Save Entire Portal to Device (Zero Data)'}
            </span>
          </button>

          {/* Home Screen Install flow */}
          {!isInstalled && (
            <>
              {isInstallable && (
                <button
                  type="button"
                  onClick={install}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <span>📲</span>
                  <span>Install as App on Home Screen</span>
                </button>
              )}

              {isIOS && (
                <div
                  style={{
                    backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    fontSize: '0.78rem',
                    color: isDark ? '#cbd5e1' : '#475569',
                    lineHeight: 1.5,
                  }}
                >
                  <strong>📲 Install on iPhone/iPad:</strong> Tap Safari's <strong>Share</strong> button (box with up arrow), then select <strong>Add to Home Screen</strong>.
                </div>
              )}
            </>
          )}
        </div>

        {/* Device Storage Details */}
        <div
          style={{
            borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            paddingTop: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            color: isDark ? '#94a3b8' : '#64748b',
          }}
        >
          <span>
            Storage: {storageInfo.usageMb ? `${storageInfo.usageMb} MB used` : 'Browser Cache'}
          </span>
          <span>
            {storageInfo.persisted ? '🔒 Persistent storage locked' : '⚡ Local CacheStorage'}
          </span>
        </div>
      </div>
    </div>
  );
};
