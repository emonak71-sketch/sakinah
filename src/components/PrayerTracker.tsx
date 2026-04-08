import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { usePrayerTracker } from '@/src/services/prayerService';

const PRAYERS = [
  { id: 'fajr', name: 'ফজর' },
  { id: 'dhuhr', name: 'জোহর' },
  { id: 'asr', name: 'আসর' },
  { id: 'maghrib', name: 'মাগরিব' },
  { id: 'isha', name: 'এশা' },
];

export default function PrayerTracker() {
  const { history, today, togglePrayer, getTodayStats } = usePrayerTracker();
  const todayData = history[today] || {};
  const { completed, total } = getTodayStats();

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-headline text-2xl text-primary font-bold">নামাজ ট্র্যাকার</h2>
        <span className="text-xs font-semibold px-3 py-1 bg-surface-container-highest rounded-full text-primary">
          আজকের প্রগতি: {completed}/{total}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {PRAYERS.map((prayer) => {
          const isCompleted = !!todayData[prayer.id];
          return (
            <button
              key={prayer.id}
              onClick={() => togglePrayer(prayer.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-lg shadow-sm border transition-all active:scale-95 group",
                isCompleted 
                  ? "bg-secondary-fixed-dim border-secondary-fixed-dim/20" 
                  : "bg-surface-container-lowest border-transparent hover:bg-surface-container-low"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isCompleted 
                  ? "bg-primary text-white" 
                  : "bg-surface-container-high text-primary/30 group-hover:bg-primary-container group-hover:text-on-primary-container"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 fill-current" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              <span className={cn(
                "text-[11px] font-bold",
                isCompleted ? "text-primary" : "text-primary/60"
              )}>
                {prayer.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
