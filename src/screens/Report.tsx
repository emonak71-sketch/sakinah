import React, { useEffect, useState } from 'react';
import { Shield, Timer, Award, Quote, ArrowRight, X, CheckCircle2, Target, Calendar } from 'lucide-react';
import { usePrayerTracker } from '@/src/services/prayerService';
import confetti from 'canvas-confetti';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Report() {
  const { getWeeklyStats } = usePrayerTracker();
  const { dayStats, percentage } = getWeeklyStats();
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    if (percentage >= 80) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#064E3B', '#D4AF37', '#fed65b']
      });
    }
  }, [percentage]);

  const getMessage = () => {
    if (percentage >= 80) return "অভিনন্দন! আপনি এই সপ্তাহে চমৎকার ধারাবাহিকতা বজায় রেখেছেন।";
    if (percentage >= 50) return "ভালো প্রচেষ্টা! আরও একটু চেষ্টা করলে আপনি লক্ষ্যে পৌঁছাতে পারবেন।";
    return "মনোবল হারাবেন না। আগামী সপ্তাহে ফজর ও এশা জামাতে পড়ার চেষ্টা করুন, এটি আপনার ধারাবাহিকতা বাড়াতে সাহায্য করবে।";
  };

  const daysLabels = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'];

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {showPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-surface-container p-8 rounded-[2.5rem] shadow-2xl border border-primary/10 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-2xl font-bold text-primary">উন্নতি পরিকল্পনা</h3>
                <button onClick={() => setShowPlan(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-primary">আগামী সপ্তাহের লক্ষ্য</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'প্রতিদিন অন্তত ৪ ওয়াক্ত নামাজ জামাতে পড়া',
                      'ফজর সালাতের পর ১০ মিনিট কুরআন তিলাওয়াত',
                      'প্রতিটি নামাজের পর তাসবিহ পাঠ সম্পন্ন করা'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-secondary-fixed-dim/10 p-5 rounded-2xl border border-secondary-fixed-dim/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <h4 className="font-bold text-primary">রুটিন টিপস</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    আপনার ডাটা অনুযায়ী, আপনি রাতে দেরিতে ঘুমানোর কারণে ফজর মিস করছেন। আজ থেকে রাত ১১টার মধ্যে ঘুমানোর চেষ্টা করুন এবং এলার্ম ঘড়ি ব্যবহার করুন।
                  </p>
                </div>

                <button 
                  onClick={() => setShowPlan(false)}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                >
                  আমি রাজি, ইনশাআল্লাহ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Badge */}
      <section>
        <div className="bg-primary text-white rounded-lg p-6 shadow-none flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <span className="text-secondary-fixed-dim font-semibold text-sm tracking-wider uppercase mb-1 block">সাফল্য অর্জন</span>
            <h2 className="font-headline text-3xl font-bold mb-2">সালাহ যোদ্ধা</h2>
            <p className="text-primary-fixed opacity-90 text-sm leading-relaxed max-w-[200px]">
              {getMessage()}
            </p>
          </div>
          <div className="z-10 bg-secondary-fixed-dim/20 p-4 rounded-full border border-secondary-fixed-dim/30">
            <Shield className="w-12 h-12 text-secondary-fixed-dim fill-current" />
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Award className="w-48 h-48" />
          </div>
        </div>
      </section>

      {/* Weekly Report Chart */}
      <section className="bg-surface-container-low rounded-lg p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-headline text-xl font-bold text-primary mb-1">সাপ্তাহিক রিপোর্ট</h3>
            <p className="text-on-surface-variant text-xs font-medium">গত ৭ দিনের প্রগতি</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded-full text-xs font-bold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {Math.round(percentage)}% পূর্ণ
          </div>
        </div>

        <div className="flex items-end justify-between h-48 gap-2">
          {dayStats.map((day) => {
            const height = (day.count / 5) * 100;
            const dateObj = new Date(day.date);
            const dayIndex = dateObj.getDay();
            // Map JS getDay (0=Sun) to our labels (0=Sat)
            const labelIndex = (dayIndex + 1) % 7; 
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center group">
                <div 
                  className={cn(
                    "w-full rounded-t-full relative transition-all duration-300 hover:opacity-80",
                    height < 50 ? 'bg-secondary-fixed-dim' : 'bg-primary'
                  )}
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                    {day.count}/৫
                  </div>
                </div>
                <span className="mt-3 text-[10px] font-semibold text-on-surface-variant">
                  {daysLabels[labelIndex]}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tips & Stats */}
      <section className="space-y-6 pb-12">
        <div className="bg-surface-container-high rounded-lg p-6 relative overflow-hidden">
          <Quote className="absolute right-6 top-6 text-primary/10 w-12 h-12" />
          <h4 className="font-headline text-lg font-bold text-primary mb-3">উন্নতির জন্য পরামর্শ</h4>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            "আপনার গত সোমবারের পারফরম্যান্স কিছুটা কমেছিল। চেষ্টা করুন ফজর সালাত জামাতের সাথে আদায় করতে, এটি আপনার পুরো দিনের কাজে বরকত নিয়ে আসবে ইনশাআল্লাহ।"
          </p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPlan(true);
            }}
            className="w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            <span>বিস্তারিত পরিকল্পনা দেখুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Timer className="w-5 h-5 text-primary fill-current" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant block mb-1">গড় সময়</span>
            <span className="text-xl font-bold text-primary">১২ মিনিট</span>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed-dim/20 flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-secondary fill-current" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant block mb-1">টানা ধারাবাহিকতা</span>
            <span className="text-xl font-bold text-primary">০৮ দিন</span>
          </div>
        </div>
      </section>
    </div>
  );
}
