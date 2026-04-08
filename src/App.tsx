import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/src/components/Layout';
import Home from '@/src/screens/Home';
import Report from '@/src/screens/Report';
import Quran from '@/src/screens/Quran';
import SurahDetail from '@/src/screens/SurahDetail';
import Mosque from '@/src/screens/Mosque';
import Settings from '@/src/screens/Settings';
import Tasbih from '@/src/screens/Tasbih';
import Onboarding from '@/src/screens/Onboarding';
import { SettingsProvider, useSettings } from '@/src/context/SettingsContext';
import { setupAzanNotifications } from '@/src/services/notificationService';

function AppContent() {
  const { user } = useSettings();

  useEffect(() => {
    if (user) {
      setupAzanNotifications();
    }
  }, [user]);

  if (!user) {
    return <Onboarding />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/quran/:id" element={<SurahDetail />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/mosque" element={<Mosque />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
