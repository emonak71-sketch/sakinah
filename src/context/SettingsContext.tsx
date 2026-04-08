import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'bn' | 'en';
type FontSize = 'ছোট' | 'মাঝারি' | 'বড়';
type Gender = 'male' | 'female' | null;

interface UserProfile {
  name: string;
  gender: Gender;
}

interface SettingsContextType {
  language: Language;
  fontSize: FontSize;
  darkMode: boolean;
  azanNotifications: boolean;
  user: UserProfile | null;
  setLanguage: (lang: Language) => void;
  setFontSize: (size: FontSize) => void;
  setDarkMode: (dark: boolean) => void;
  setAzanNotifications: (enabled: boolean) => void;
  setUser: (user: UserProfile | null) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sakinah_settings');
    return saved ? JSON.parse(saved) : {
      language: 'bn',
      fontSize: 'মাঝারি',
      darkMode: false,
      azanNotifications: true,
      user: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('sakinah_settings', JSON.stringify(settings));
    
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply font size
    const sizeMap = {
      'ছোট': '0.9rem',
      'মাঝারি': '1rem',
      'বড়': '1.1rem',
    };
    document.documentElement.style.fontSize = sizeMap[settings.fontSize as FontSize];
  }, [settings]);

  const setLanguage = (language: Language) => setSettings((s: any) => ({ ...s, language }));
  const setFontSize = (fontSize: FontSize) => setSettings((s: any) => ({ ...s, fontSize }));
  const setDarkMode = (darkMode: boolean) => setSettings((s: any) => ({ ...s, darkMode }));
  const setAzanNotifications = (azanNotifications: boolean) => setSettings((s: any) => ({ ...s, azanNotifications }));
  const setUser = (user: UserProfile | null) => setSettings((s: any) => ({ ...s, user }));

  return (
    <SettingsContext.Provider value={{ ...settings, setLanguage, setFontSize, setDarkMode, setAzanNotifications, setUser }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
