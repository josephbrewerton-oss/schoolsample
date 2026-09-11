import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersistentAppShell from './components/PersistentAppShell';

// Eager load Home Page for instant FCP / LCP
import HomePage from './pages/index';

// Code-split secondary heavy pages on-demand
const PracticeLabPage = lazy(() => import('./pages/practice-lab'));
const LearningZonePage = lazy(() => import('./pages/learning-zone'));
const ProfilePage = lazy(() => import('./pages/profile'));
const CurriculumStudioPage = lazy(() => import('./pages/curriculum-studio'));
const SettingsPage = lazy(() => import('./pages/settings'));
const BlogPage = lazy(() => import('./pages/blog'));
const PrivacyPage = lazy(() => import('./pages/privacy'));
const LicensingPage = lazy(() => import('./pages/licensing'));
const TeacherBeaconPage = lazy(() => import('./pages/teacher-beacon'));
const NotFoundPage = lazy(() => import('./pages/not-found'));

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
