// src/pages/curriculum-studio.tsx
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  CustomCurriculumPack,
  CustomCurriculumLesson,
  getInstalledCurriculumPacks,
  saveCurriculumPack,
  removeCurriculumPack,
  generateSampleCsvTemplate,
  generateSampleJsonTemplate,
  parseCsvToCurriculumPack,
  PRESET_OVERSEAS_PACKS,
} from '../services/curriculumPackStore';

export default function CurriculumStudioPage() {
  const [activeTab, setActiveTab] = useState<'presets' | 'import' | 'installed'>('presets');
  const [installedPacks, setInstalledPacks] = useState<CustomCurriculumPack[]>([]);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Inspector / Preview state
  const [previewPack, setPreviewPack] = useState<CustomCurriculumPack | null>(null);
  const [selectedPreviewLesson, setSelectedPreviewLesson] = useState<CustomCurriculumLesson | null>(null);
  const [testQuestionIndex, setTestQuestionIndex] = useState<number>(0);
  const [testSelectedOption, setTestSelectedOption] = useState<string | null>(null);
  const [testAnswerFeedback, setTestAnswerFeedback] = useState<string | null>(null);

  // Import file form state
  const [uploadPackTitle, setUploadPackTitle] = useState<string>('');
  const [uploadCountry, setUploadCountry] = useState<string>('');
  const [uploadMinistry, setUploadMinistry] = useState<string>('');
  const [uploadDescription, setUploadDescription] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshInstalled = () => {
    setInstalledPacks(getInstalledCurriculumPacks());
  };

  useEffect(() => {
    refreshInstalled();
    const handleUpdate = () => refreshInstalled();
    window.addEventListener('curriculum_packs_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('curriculum_packs_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleInstallPack = (pack: CustomCurriculumPack) => {
    saveCurriculumPack(pack);
    refreshInstalled();
    showNotice(`✅ Installed "${pack.title}" (${pack.countryOrRegion}) to your offline engine!`, 'success');
  };

  const handleUninstallPack = (packId: string, title: string) => {
    if (window.confirm(`Are you sure you want to uninstall "${title}" from this device?`)) {
      removeCurriculumPack(packId);
      refreshInstalled();
      if (previewPack?.id === packId) {
        setPreviewPack(null);
      }
      showNotice(`🗑️ Removed "${title}" from device.`, 'info');
    }
  };

  const handleExportJson = (pack: CustomCurriculumPack) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pack, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${pack.id}-offline-curriculum-pack.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotice(`📥 Exported "${pack.title}" for SD cards / USB sticks!`, 'success');
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = generateSampleCsvTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'international-curriculum-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('📄 Downloaded starter Excel/CSV template!', 'info');
  };

  const handleDownloadSampleJson = () => {
    const jsonContent = generateSampleJsonTemplate();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample-curriculum-pack.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('📄 Downloaded starter JSON template!', 'info');
  };

  const processUploadedFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const isJson = file.name.endsWith('.json') || text.trim().startsWith('{');

      let pack: CustomCurriculumPack;

      if (isJson) {
        const parsed = JSON.parse(text);
        if (!parsed.id || !parsed.title || !parsed.stages) {
          throw new Error('Invalid JSON format: Curriculum pack requires "id", "title", and "stages".');
        }
        pack = {
          ...parsed,
          installedAt: Date.now(),
        };
      } else {
        // Assume CSV / TSV
        pack = parseCsvToCurriculumPack(text, {
          packTitle: uploadPackTitle || file.name.replace(/\.[^/.]+$/, ''),
          countryOrRegion: uploadCountry || 'Overseas / Regional',
          authorOrMinistry: uploadMinistry || 'Local Ministry / School',
          description: uploadDescription || `Imported from ${file.name}`,
        });
      }

      setPreviewPack(pack);
      if (pack.lessons && pack.lessons.length > 0) {
        setSelectedPreviewLesson(pack.lessons[0]);
        setTestQuestionIndex(0);
        setTestSelectedOption(null);
        setTestAnswerFeedback(null);
      }

      showNotice(`🎉 Successfully parsed "${pack.title}" (${pack.lessons.length} lessons found)! Review below and click "Install".`, 'success');
    } catch (err: any) {
      console.error('File parsing error:', err);
      showNotice(`❌ Failed to parse file: ${err?.message || 'Unknown error'}`, 'error');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const isPackInstalled = (packId: string) => {
    return installedPacks.some((p) => p.id === packId);
  };

  return (
    <Layout
      title="International Curriculum Studio"
      description="Import, customize, and deploy overseas and regional national curricula for offline learning."
    >
      <main style={{ maxWidth: '1120px', margin: '2rem auto', padding: '0 1.25rem', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Header Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '2.5rem 2rem',
          borderRadius: '18px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
          marginBottom: '2rem',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}>
            <span>🌍 Global Curriculum Agnostic</span>
            <span>&bull;</span>
            <span>Zero Code Ingestion</span>
            <span>&bull;</span>
            <span>100% Offline PWA</span>
          </div>

          <h1 style={{ fontSize: '2.35rem', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
            International Curriculum Studio
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '780px', margin: 0, lineHeight: 1.6 }}>
            Overseas schools, dioceses, and ministries of education can easily import their official national syllabi into this platform. 
            Upload a spreadsheet (CSV) or choose a ready-to-run national pack below.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadSampleCsv}
              style={{
                background: '#ffffff',
                color: '#1e3a8a',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              📥 Download Starter Spreadsheet (.CSV)
            </button>
            <button
              onClick={handleDownloadSampleJson}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              📄 Download Sample JSON Pack
            </button>
          </div>
        </section>

        {/* Global Notification Toast */}
        {notification && (
          <div style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            background: notification.type === 'success' ? '#f0fdf4' : notification.type === 'error' ? '#fef2f2' : '#eff6ff',
            border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : notification.type === 'error' ? '#fecaca' : '#bfdbfe'}`,
            color: notification.type === 'success' ? '#166534' : notification.type === 'error' ? '#991b1b' : '#1e40af',
            fontWeight: 600,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>{notification.text}</span>
            <button
              onClick={() => setNotification(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setActiveTab('presets')}
            style={{
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'presets' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'presets' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>🚀 Ready Overseas Packs</span>
            <span style={{
              background: activeTab === 'presets' ? '#dbeafe' : '#f1f5f9',
              color: activeTab === 'presets' ? '#1d4ed8' : '#475569',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
            }}>
              {PRESET_OVERSEAS_PACKS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            style={{
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'import' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'import' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📤 Upload Custom File</span>
          </button>

          <button
            onClick={() => setActiveTab('installed')}
            style={{
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'installed' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'installed' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>💾 Installed on this Device</span>
            <span style={{
              background: installedPacks.length > 0 ? '#dcfce7' : '#f1f5f9',
              color: installedPacks.length > 0 ? '#15803d' : '#475569',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
            }}>
              {installedPacks.length}
            </span>
          </button>
        </div>

        {/* TAB 1: PRESET OVERSEAS PACKS */}
        {activeTab === 'presets' && (
          <section>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Instant National Curriculum Packs
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
                Click <strong>"Install to Device"</strong> on any pack to immediately load it into your offline engine. Once installed, its subjects and topics will appear in the Practice Arena and Learning Zone.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}>
              {PRESET_OVERSEAS_PACKS.map((pack) => {
                const installed = isPackInstalled(pack.id);
                const totalStages = Object.keys(pack.stages).length;
                const totalLessons = pack.lessons.length;
                const totalQuestions = pack.lessons.reduce((sum, l) => sum + (l.questions?.length || 0), 0);

                return (
                  <div
                    key={pack.id}
                    style={{
                      background: '#ffffff',
                      border: installed ? '2px solid #22c55e' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.06)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span style={{
                          background: '#f1f5f9',
                          color: '#0f172a',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}>
                          📍 {pack.countryOrRegion}
                        </span>

                        {installed && (
                          <span style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}>
                            ✓ Active on Device
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                        {pack.title}
                      </h3>

                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>
                        🏛️ {pack.authorOrMinistry}
                      </div>

                      <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {pack.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        fontSize: '0.82rem',
                        color: '#475569',
                        marginBottom: '1.25rem',
                        fontWeight: 600,
                      }}>
                        <div>📚 {totalStages} Stages</div>
                        <div>📖 {totalLessons} Units</div>
                        <div>⚡ {totalQuestions} Verified Questions</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setPreviewPack(pack);
                          if (pack.lessons.length > 0) {
                            setSelectedPreviewLesson(pack.lessons[0]);
                            setTestQuestionIndex(0);
                            setTestSelectedOption(null);
                            setTestAnswerFeedback(null);
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                        }}
                      >
                        👁️ Inspect Pack
                      </button>

                      {installed ? (
                        <button
                          onClick={() => handleUninstallPack(pack.id, pack.title)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#b91c1c',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                          }}
                        >
                          Uninstall
                        </button>
                      ) : (
                        <button
                          onClick={() => handleInstallPack(pack)}
                          style={{
                            flex: 1,
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
                          }}
                        >
                          📥 Install to Device
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 2: IMPORT CUSTOM FILE */}
        {activeTab === 'import' && (
          <section style={{ maxWidth: '850px', margin: '0 auto 3rem auto' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              marginBottom: '2rem',
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Step 1: Download the Starter Template
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Open this template in <strong>Microsoft Excel, Google Sheets, or Apple Numbers</strong>. 
                Fill in your grade levels, subjects, questions, and answers, then export as a <code>.CSV</code> file.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                  onClick={handleDownloadSampleCsv}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📊 Download Excel / CSV Template
                </button>
                <button
                  onClick={handleDownloadSampleJson}
                  style={{
                    background: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  { } Download JSON Template
                </button>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                fontSize: '0.85rem',
                color: '#475569',
              }}>
                <strong>Required Spreadsheet Columns:</strong>
                <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                  <li><code>Grade or Stage</code> (e.g. "Primary 6", "Junior Secondary 1", "Grade 8")</li>
                  <li><code>Subject</code> (e.g. "Integrated Science", "Social Studies", "Mathematics")</li>
                  <li><code>Topic or Lesson Title</code> (e.g. "Soil Water Conservation")</li>
                  <li><code>Question</code> (e.g. "What is the primary benefit of organic mulching?")</li>
                  <li><code>Correct Answer</code> (e.g. "conserving soil moisture")</li>
                  <li><code>Distractors & Feedback</code> (Common student mistakes with explanation notes)</li>
                </ul>
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
                Step 2: Upload Your Completed File
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Curriculum / Pack Title
                  </label>
                  <input
                    type="text"
                    value={uploadPackTitle}
                    onChange={(e) => setUploadPackTitle(e.target.value)}
                    placeholder="e.g. Sierra Leone Basic Education Standard"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Country or Region
                  </label>
                  <input
                    type="text"
                    value={uploadCountry}
                    onChange={(e) => setUploadCountry(e.target.value)}
                    placeholder="e.g. Sierra Leone, Kenya, Ghana, India"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed #2563eb' : '2px dashed #cbd5e1',
                  background: isDragging ? '#eff6ff' : '#f8fafc',
                  borderRadius: '12px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.json,text/csv,application/json"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processUploadedFile(e.target.files[0]);
                    }
                  }}
                />

                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                  {isProcessing ? '⏳' : '📁'}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  {isProcessing ? 'Parsing Curriculum...' : 'Drag and drop your .CSV or .JSON file here'}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                  Or click to browse from your computer, tablet, or phone.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: INSTALLED PACKS */}
        {activeTab === 'installed' && (
          <section>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Curriculum Packs Installed on this Device
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
                These packs are stored in your device's browser database (IndexedDB/localStorage) and work completely offline without internet.
              </p>
            </div>

            {installedPacks.length === 0 ? (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  No Custom Packs Installed Yet
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                  Your device is currently using the default UK Oak National Academy & Catholic Faith Formation curricula.
                </p>
                <button
                  onClick={() => setActiveTab('presets')}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🚀 Browse Overseas Packs
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem',
              }}>
                {installedPacks.map((pack) => (
                  <div
                    key={pack.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}>
                          ✓ Offline Ready
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          📍 {pack.countryOrRegion}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                        {pack.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                        {pack.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        fontSize: '0.82rem',
                        color: '#475569',
                        marginBottom: '1.25rem',
                        fontWeight: 600,
                      }}>
                        <div>{pack.lessons.length} Lessons</div>
                        <div>•</div>
                        <div>Installed {new Date(pack.installedAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to="/practice-lab"
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            textDecoration: 'none',
                          }}
                        >
                          ⚡ Practice Lab
                        </Link>
                        <Link
                          to="/learning-zone"
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            textDecoration: 'none',
                          }}
                        >
                          📖 Lessons
                        </Link>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleExportJson(pack)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                          title="Export bundle for SD cards"
                        >
                          💾 Export for SD / USB
                        </button>
                        <button
                          onClick={() => handleUninstallPack(pack.id, pack.title)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fecaca',
                            background: '#fff1f2',
                            color: '#e11d48',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* LIVE PREVIEW & INSPECTOR DRAWER */}
        {previewPack && (
          <section style={{
            background: '#ffffff',
            border: '2px solid #3b82f6',
            borderRadius: '18px',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1)',
            marginBottom: '3rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  🔍 Curriculum Inspector & Live Preview
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.25rem 0' }}>
                  {previewPack.title}
                </h2>
                <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                  📍 {previewPack.countryOrRegion} &nbsp;|&nbsp; 🏛️ {previewPack.authorOrMinistry} &nbsp;|&nbsp; {previewPack.lessons.length} lessons ready
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleExportJson(previewPack)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  💾 Export JSON
                </button>

                {!isPackInstalled(previewPack.id) ? (
                  <button
                    onClick={() => handleInstallPack(previewPack)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#16a34a',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(22,163,74,0.2)',
                    }}
                  >
                    ✓ Install this Curriculum
                  </button>
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}>
                    ✓ Already Active on Device
                  </span>
                )}

                <button
                  onClick={() => setPreviewPack(null)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Lesson selector & question tester split layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem' }}>
              
              {/* Left Column: Lesson list */}
              <div style={{
                maxHeight: '480px',
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.75rem',
                background: '#f8fafc',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', padding: '0 4px' }}>
                  LESSONS ({previewPack.lessons.length})
                </div>

                {previewPack.lessons.map((lesson) => {
                  const isSelected = selectedPreviewLesson?.id === lesson.id;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        setSelectedPreviewLesson(lesson);
                        setTestQuestionIndex(0);
                        setTestSelectedOption(null);
                        setTestAnswerFeedback(null);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        marginBottom: '6px',
                        cursor: 'pointer',
                        background: isSelected ? '#ffffff' : 'transparent',
                        border: isSelected ? '1px solid #2563eb' : '1px solid transparent',
                        boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>
                        {lesson.stageTitle} &bull; {lesson.subjectTitle}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                        {lesson.topicTitle}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {lesson.questions?.length || 0} questions &bull; {lesson.axiom.slice(0, 45)}...
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Live Lesson & Question Interactive Preview */}
              {selectedPreviewLesson ? (
                <div style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  background: '#ffffff',
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>
                      {selectedPreviewLesson.stageTitle} &bull; {selectedPreviewLesson.subjectTitle}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 8px 0' }}>
                      {selectedPreviewLesson.topicTitle}
                    </h3>
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      fontSize: '0.85rem',
                      color: '#166534',
                      marginBottom: '1rem',
                    }}>
                      <strong>💡 Core Axiom:</strong> {selectedPreviewLesson.axiom}
                    </div>
                  </div>

                  {/* Interactive Question Player */}
                  {selectedPreviewLesson.questions && selectedPreviewLesson.questions.length > 0 ? (
                    <div>
                      {(() => {
                        const currentQ = selectedPreviewLesson.questions[testQuestionIndex] || selectedPreviewLesson.questions[0];
                        const correctVal = currentQ.correctAnswer[0];
                        const options = [correctVal, ...(currentQ.distractors || []).map((d) => d.answerText)];

                        return (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>
                                QUESTION {testQuestionIndex + 1} OF {selectedPreviewLesson.questions.length}
                              </span>
                              {selectedPreviewLesson.questions.length > 1 && (
                                <button
                                  onClick={() => {
                                    setTestQuestionIndex((prev) => (prev + 1) % selectedPreviewLesson.questions.length);
                                    setTestSelectedOption(null);
                                    setTestAnswerFeedback(null);
                                  }}
                                  style={{
                                    fontSize: '0.8rem',
                                    color: '#2563eb',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                  }}
                                >
                                  Next Question ➔
                                </button>
                              )}
                            </div>

                            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.4 }}>
                              {currentQ.questionText}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                              {options.map((opt, i) => {
                                const isCorrect = currentQ.correctAnswer.some((ans) => ans.toLowerCase() === opt.toLowerCase());
                                const isChosen = testSelectedOption === opt;

                                let btnBg = '#f8fafc';
                                let btnBorder = '#e2e8f0';
                                let btnColor = '#0f172a';

                                if (testSelectedOption) {
                                  if (isCorrect) {
                                    btnBg = '#dcfce7';
                                    btnBorder = '#22c55e';
                                    btnColor = '#15803d';
                                  } else if (isChosen) {
                                    btnBg = '#fee2e2';
                                    btnBorder = '#ef4444';
                                    btnColor = '#b91c1c';
                                  }
                                }

                                return (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      setTestSelectedOption(opt);
                                      if (isCorrect) {
                                        setTestAnswerFeedback(`🎉 Correct! ${currentQ.explanation}`);
                                      } else {
                                        const dist = currentQ.distractors?.find((d) => d.answerText === opt);
                                        setTestAnswerFeedback(`❌ Incorrect. ${dist?.feedback || currentQ.hint}`);
                                      }
                                    }}
                                    style={{
                                      padding: '10px 14px',
                                      borderRadius: '8px',
                                      background: btnBg,
                                      border: `1px solid ${btnBorder}`,
                                      color: btnColor,
                                      fontWeight: 600,
                                      fontSize: '0.9rem',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {testAnswerFeedback && (
                              <div style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                background: testAnswerFeedback.startsWith('🎉') ? '#f0fdf4' : '#fff1f2',
                                border: `1px solid ${testAnswerFeedback.startsWith('🎉') ? '#86efac' : '#fecaca'}`,
                                color: testAnswerFeedback.startsWith('🎉') ? '#166534' : '#991b1b',
                                fontSize: '0.88rem',
                                lineHeight: 1.4,
                              }}>
                                {testAnswerFeedback}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      No sample questions in this lesson.
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Select a lesson on the left to inspect its questions.
                </div>
              )}
            </div>
          </section>
        )}

      </main>
    </Layout>
  );
}
