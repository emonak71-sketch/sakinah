import React, { useState } from 'react';
import { UserCheck, Globe, Languages, Moon, Type, Bell, Volume2, HelpCircle, Info, LogOut, ChevronRight, ExternalLink, X, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useSettings } from '@/src/context/SettingsContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Settings() {
  const { language, fontSize, darkMode, azanNotifications, user, setLanguage, setFontSize, setDarkMode, setAzanNotifications, setUser } = useSettings();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-update to requested name if it's the first time or default
  React.useEffect(() => {
    if (user && (user.name === 'Emon' || user.name === 'emonak71' || !user.name)) {
      setUser({ ...user, name: 'Abu Hanif' });
    }
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUser({ ...user!, name: tempName.trim() });
      setIsEditingName(false);
      showToast('প্রোফাইল আপডেট করা হয়েছে।');
    }
  };

  const handleLanguageChange = () => {
    const lang = language === 'bn' ? 'en' : 'bn';
    setLanguage(lang);
    showToast(`ভাষা পরিবর্তন করা হয়েছে: ${lang === 'bn' ? 'বাংলা' : 'English'}`);
  };

  const handleFontSizeChange = () => {
    const sizes: ('ছোট' | 'মাঝারি' | 'বড়')[] = ['ছোট', 'মাঝারি', 'বড়'];
    const currentIdx = sizes.indexOf(fontSize);
    const nextIdx = (currentIdx + 1) % sizes.length;
    setFontSize(sizes[nextIdx]);
    showToast(`লেখার আকার পরিবর্তন করা হয়েছে: ${sizes[nextIdx]}`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsConfirmingLogout(false);
    // No alert here, the app will redirect to Onboarding automatically
  };

  const handleHelpCenter = () => {
    showToast('সাহায্য কেন্দ্র শীঘ্রই চালু হবে।');
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] bg-primary text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name Edit Modal */}
      <AnimatePresence>
        {isEditingName && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-surface-container p-8 rounded-[2rem] shadow-2xl border border-primary/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-xl font-bold text-primary">নাম পরিবর্তন করুন</h3>
                <button onClick={() => setIsEditingName(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 text-on-surface font-medium mb-6"
                autoFocus
              />
              <button 
                onClick={handleSaveName}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                <Check className="w-5 h-5" />
                সংরক্ষণ করুন
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isConfirmingLogout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-surface-container p-8 rounded-[2rem] shadow-2xl border border-primary/10"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8" />
                </div>
                <h3 className="font-headline text-xl font-bold text-primary">লগ আউট নিশ্চিত করুন</h3>
                <p className="text-on-surface-variant text-sm">আপনি কি নিশ্চিত যে আপনি লগ আউট করতে চান?</p>
                
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button 
                    onClick={() => setIsConfirmingLogout(false)}
                    className="py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold active:scale-95 transition-all"
                  >
                    না
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="py-4 bg-error text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                  >
                    হ্যাঁ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Highlight */}
      <section>
        <div onClick={() => { setTempName(user?.name || ''); setIsEditingName(true); }} className="bg-surface-container-low rounded-lg p-6 flex items-center justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors group">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-full group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold text-primary">{user?.name || 'আপনার অ্যাকাউন্ট'}</h2>
              <p className="text-sm text-on-surface-variant">ব্যক্তিগত তথ্য ও নিরাপত্তা পরিচালনা করুন</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-outline-variant" />
        </div>
      </section>

      {/* Setting Groups */}
      <div className="flex flex-col gap-6 pb-10">
        {/* Language */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary px-2">ভাষা ও স্থানীয়করণ</h3>
          <div className="bg-white dark:bg-surface-container rounded-lg shadow-sm overflow-hidden">
            <div 
              onClick={handleLanguageChange}
              className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block font-semibold">ভাষা পরিবর্তন</span>
                  <span className="text-xs text-on-surface-variant">{language === 'bn' ? 'বাংলা (Bengali)' : 'English'}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant" />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary px-2">প্রদর্শন ও দৃশ্যমানতা</h3>
          <div className="bg-white dark:bg-surface-container rounded-lg shadow-sm overflow-hidden">
            <div 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-primary" />
                <div>
                  <span className="block font-semibold">ডার্ক মোড</span>
                  <span className="text-xs text-on-surface-variant">ব্যাটারি সাশ্রয় ও আরামদায়ক ভিউ</span>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full relative p-1 flex items-center transition-all duration-300",
                darkMode ? "bg-primary justify-end" : "bg-surface-container-high justify-start"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full shadow-sm",
                  darkMode ? "bg-white" : "bg-on-surface-variant"
                )} />
              </div>
            </div>
            <div 
              onClick={handleFontSizeChange}
              className="flex items-center justify-between p-5 border-t border-surface-container-high hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Type className="w-5 h-5 text-primary" />
                <div>
                  <span className="block font-semibold">লেখার আকার</span>
                  <span className="text-xs text-on-surface-variant">{fontSize}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary px-2">নোটিফিকেশন ও আজান</h3>
          <div className="bg-white dark:bg-surface-container rounded-lg shadow-sm overflow-hidden">
            <div 
              onClick={() => setAzanNotifications(!azanNotifications)}
              className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <span className="block font-semibold">আজান নোটিফিকেশন</span>
                  <span className="text-xs text-on-surface-variant">প্রার্থনার সময়ের জন্য অ্যালার্ট</span>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full relative p-1 flex items-center transition-all duration-300",
                azanNotifications ? "bg-primary justify-end" : "bg-surface-container-high justify-start"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full shadow-sm",
                  azanNotifications ? "bg-white" : "bg-on-surface-variant"
                )} />
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-secondary px-2">সাপোর্ট</h3>
          <div className="bg-white dark:bg-surface-container rounded-lg shadow-sm overflow-hidden">
            <div 
              onClick={handleHelpCenter}
              className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span className="font-semibold">সাহায্য কেন্দ্র</span>
              </div>
              <ExternalLink className="w-5 h-5 text-outline-variant" />
            </div>
            <div className="flex items-center justify-between p-5 border-t border-surface-container-high hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <Info className="w-5 h-5 text-primary" />
                <span className="font-semibold">অ্যাপ সম্পর্কে</span>
              </div>
              <span className="text-sm text-on-surface-variant">v2.4.0</span>
            </div>
            <div className="flex items-center justify-between p-5 border-t border-surface-container-high bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-primary tracking-tight">Developer Credits</span>
                  <span className="text-xs text-on-surface-variant font-medium">Developed & Owned by: <span className="text-primary font-bold">{user?.name || 'Abu Hanif'}</span></span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-full tracking-[0.15em] mb-1">OFFICIAL OWNER</span>
                <span className="text-[8px] text-on-surface-variant/40 font-bold">VERIFIED PROJECT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={() => setIsConfirmingLogout(true)}
          className="mt-4 py-4 px-6 rounded-lg bg-error-container text-on-error-container font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <LogOut className="w-5 h-5" />
          লগ আউট করুন
        </button>
      </div>
    </div>
  );
}
