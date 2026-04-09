import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Landmark, BarChart3, Settings, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useSettings } from '@/src/context/SettingsContext';
import HadithNotification from './HadithNotification';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { language } = useSettings();

  const navItems = [
    { path: '/', icon: Home, label: language === 'bn' ? 'হোম' : 'Home' },
    { path: '/quran', icon: BookOpen, label: language === 'bn' ? 'কুরআন' : 'Quran' },
    { path: '/tasbih', icon: Fingerprint, label: language === 'bn' ? 'তসবিহ' : 'Tasbih' },
    { path: '/mosque', icon: Landmark, label: language === 'bn' ? 'মসজিদ' : 'Mosque' },
    { path: '/report', icon: BarChart3, label: language === 'bn' ? 'রিপোর্ট' : 'Report' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <HadithNotification />
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/85 backdrop-blur-md flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/10">
            <img 
              src="/logo.svg" 
              alt="Sakinah Logo" 
              className="w-full h-full object-cover p-1"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-headline text-xl font-bold text-primary">
            {language === 'bn' ? 'সাকিনাহ' : 'Sakinah'}
          </span>
        </div>
        <NavLink to="/settings" className="text-primary hover:opacity-80 transition-opacity">
          <Settings className="w-6 h-6" />
        </NavLink>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32 px-6 max-w-2xl mx-auto w-full">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 dark:bg-surface-container/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex justify-around items-center py-3 px-2 z-50 border border-white/20 dark:border-white/5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 tap-highlight-transparent active:scale-90",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                <span className={cn("text-[10px] font-bold mt-1 tracking-tight", isActive ? "opacity-100" : "opacity-70")}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
