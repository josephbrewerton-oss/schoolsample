import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersistentAppShell from './components/PersistentAppShell';
import HomePage from './pages/index';
import ErrorBoundary from './components/ErrorBoundary';

// Helper: If a deployed chunk 404s after a new build, reload the window once to fetch the new manifest
function lazyRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      const component = await factory();
      // On success, clear any previous retry flags
      try {
        sessionStorage.removeItem('chunk_retry_attempt');
      } catch {}
      return component;
    } catch (error) {
      console.warn('Chunk load error, verifying retry attempt...', error);
      try {
        const hasRetried = sessionStorage.getItem('chunk_retry_attempt');
        if (!hasRetried) {
          sessionStorage.setItem('chunk_retry_attempt', 'true');
          window.location.reload();
        }
      } catch {}
      throw error;
    }
  });
}

const PracticeLabPage = lazyRetry(() => import('./pages/practice-lab'));
const LearningZonePage = lazyRetry(() => import('./pages/learning-zone'));
const ProfilePage = lazyRetry(() => import('./pages/profile'));
const CurriculumStudioPage = lazyRetry(() => import('./pages/curriculum-studio'));
const SettingsPage = lazyRetry(() => import('./pages/settings'));
const BlogPage = lazyRetry(() => import('./pages/blog'));
const PrivacyPage = lazyRetry(() => import('./pages/privacy'));
const ChildSafetyPage = lazyRetry(() => import('./pages/child-safety'));
const LicensingPage = lazyRetry(() => import('./pages/licensing'));
const TeacherBeaconPage = lazyRetry(() => import('./pages/teacher-beacon'));
const NotFoundPage = lazyRetry(() => import('./pages/not-found'));

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
        <Routes>
          <Route path="/" element={<PersistentAppShell />}>
            <Route index element={<HomePage />} />
            <Route path="practice-lab" element={<PracticeLabPage />} />
            <Route path="learning-zone" element={<LearningZonePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="curriculum-studio" element={<CurriculumStudioPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="licensing" element={<LicensingPage />} />
            <Route path="teacher-beacon" element={<TeacherBeaconPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="child-safety" element={<ChildSafetyPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/*" element={<BlogPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
