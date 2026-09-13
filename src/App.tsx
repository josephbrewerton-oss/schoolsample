import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersistentAppShell from './components/PersistentAppShell';
import HomePage from './pages/index';

// Helper: If a deployed chunk 404s after a new build, reload the window to fetch the new manifest
function lazyRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      console.warn('Chunk load error, refreshing page...', error);
      // Force reload once to grab new asset hashes
      window.location.reload();
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
const LicensingPage = lazyRetry(() => import('./pages/licensing'));
const TeacherBeaconPage = lazyRetry(() => import('./pages/teacher-beacon'));
const NotFoundPage = lazyRetry(() => import('./pages/not-found'));

export default function App(): React.JSX.Element {
  return (
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
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/*" element={<BlogPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
