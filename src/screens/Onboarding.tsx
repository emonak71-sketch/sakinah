import React, { useState } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { User, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Onboarding() {
  const { setUser } = useSettings();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && gender) {
      setUser({ name, gender });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white dark:bg-surface-container p-8 rounded-[2.5rem] shadow-xl border border-primary/5"
      >
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-primary fill-current" />
          </div>
          <h1 className="font-headline text-3xl font-bold text-primary">স্বাগতম সাকিনাহ-তে</h1>
          <p className="text-on-surface-variant">আপনার প্রোফাইল সেট আপ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">আপনার নাম</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary px-1">লিঙ্গ নির্বাচন করুন</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-4 rounded-2xl font-bold transition-all ${
                  gender === 'male' 
                    ? 'bg-primary text-white shadow-lg scale-[1.02]' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                পুরুষ
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-4 rounded-2xl font-bold transition-all ${
                  gender === 'female' 
                    ? 'bg-primary text-white shadow-lg scale-[1.02]' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                মহিলা
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name || !gender}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            শুরু করুন <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
