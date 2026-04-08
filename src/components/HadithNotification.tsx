import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, X, Bell } from 'lucide-react';
import { hadithService, Hadith } from '@/src/services/hadithService';

export default function HadithNotification() {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem('lastHadithShown');
    const today = new Date().toDateString();

    if (lastShown !== today) {
      const dailyHadith = hadithService.getDailyHadith();
      setHadith(dailyHadith);
      
      // Show after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('lastHadithShown', today);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!hadith) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-6 pointer-events-none">
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="w-full max-w-md bg-white dark:bg-surface-container p-6 rounded-[2rem] shadow-2xl border border-primary/10 pointer-events-auto relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute -right-4 -top-4 opacity-5">
              <Quote className="w-24 h-24 rotate-180" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-primary">আজকের হাদিস</h3>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Daily Inspiration</p>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="ml-auto p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>

            <div className="relative">
              <Quote className="absolute -left-2 -top-2 w-8 h-8 text-primary/10" />
              <p className="text-on-surface font-medium leading-relaxed pl-6 mb-4 italic">
                "{hadith.text}"
              </p>
              <div className="flex justify-end">
                <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">
                  — {hadith.source}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
              জাযাকাল্লাহ খায়রান
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
