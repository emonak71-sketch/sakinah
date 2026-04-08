import React, { useState, useEffect } from 'react';
import PrayerTracker from '@/src/components/PrayerTracker';
import HadithCard from '@/src/components/HadithCard';
import { BookOpen, Landmark, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPrayerTimes, getCurrentAndNextPrayer, getTimeRemaining, getForbiddenTimes, PrayerTime, ForbiddenTime } from '@/src/services/prayerTimesService';

export default function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [forbiddenTimes, setForbiddenTimes] = useState<ForbiddenTime[]>([]);
  const [status, setStatus] = useState<{ current: PrayerTime | null; next: PrayerTime | null }>({ current: null, next: null });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setStatus(getCurrentAndNextPrayer());
    }, 1000);

    setPrayerTimes(getPrayerTimes());
    setForbiddenTimes(getForbiddenTimes());
    setStatus(getCurrentAndNextPrayer());

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-8">
      {/* Real-time Clock & Next Prayer Hero */}
      <section className="relative group">
        <div className="absolute inset-0 bg-primary rounded-lg overflow-hidden shadow-2xl">
          <img 
            src="https://picsum.photos/seed/mosque/800/400" 
            alt="Mosque" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative p-8 rounded-lg bg-primary-container/85 backdrop-blur-xl border border-white/10 flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-secondary-fixed-dim text-sm font-semibold tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                বর্তমান সময়
              </span>
              <h2 className="text-white text-3xl font-bold font-mono tracking-wider">
                {formatTime(currentTime)}
              </h2>
            </div>
            <div className="text-right space-y-1">
              <span className="text-secondary-fixed-dim text-sm font-semibold tracking-wider flex items-center gap-2 justify-end">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse" />
                পরবর্তী নামাজ
              </span>
              <h1 className="font-headline text-4xl text-white font-bold">
                {status.next?.name || '...'}
              </h1>
              <p className="text-secondary-fixed-dim text-xs font-bold">
                শুরু হতে বাকি: {status.next ? getTimeRemaining(status.next.startTime) : '...'}
              </p>
            </div>
          </div>

          {/* Current Prayer Status */}
          {status.current ? (
            <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-on-primary-container text-[10px] font-bold uppercase tracking-widest">বর্তমান ওয়াক্ত</p>
                  <p className="text-white text-xl font-bold">{status.current.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-on-primary-container text-[10px] font-bold uppercase tracking-widest">শেষ হতে বাকি</p>
                  <p className="text-secondary-fixed-dim text-lg font-bold">{getTimeRemaining(status.current.endTime)}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-white/60 font-bold">
                <span>শুরু: {status.current.startTime}</span>
                <span>শেষ: {status.current.endTime}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-error-container/20 rounded-2xl border border-error/20 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-secondary-fixed-dim" />
              <p className="text-white text-sm font-bold">এখন কোনো নামাজের ওয়াক্ত নেই</p>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 mt-4">
            {prayerTimes.map((p) => (
              <div key={p.id} className={`flex flex-col items-center p-2 rounded-xl border ${
                status.current?.id === p.id 
                  ? 'bg-secondary-fixed-dim/30 border-secondary-fixed-dim scale-105 shadow-lg' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <span className="text-[10px] text-on-primary-container font-bold">{p.name}</span>
                <span className="text-[10px] text-white font-bold whitespace-nowrap">{p.startTime.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forbidden Times */}
      <section className="bg-surface-container-low rounded-lg p-6 border border-primary/5">
        <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-secondary" />
          নামাজ পড়ার নিষিদ্ধ সময়
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {forbiddenTimes.map((f) => (
            <div key={f.id} className="bg-white dark:bg-surface-container p-3 rounded-xl shadow-sm border border-primary/5">
              <p className="text-[10px] text-on-surface-variant font-bold mb-1">{f.name}</p>
              <p className="text-sm text-primary font-bold">{f.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prayer Tracker */}
      <PrayerTracker />

      {/* Daily Hadith */}
      <HadithCard />

      {/* Quick Links Bento */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/quran')}
          className="bg-surface-container-highest rounded-lg p-6 flex flex-col gap-4 justify-between h-40 text-left hover:scale-[1.02] transition-transform"
        >
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="font-headline text-lg font-bold text-primary">কুরআন তিলাওয়াত</span>
        </button>
        <button 
          onClick={() => navigate('/mosque')}
          className="bg-[#e9c349]/20 rounded-lg p-6 flex flex-col gap-4 justify-between h-40 text-left hover:scale-[1.02] transition-transform"
        >
          <Landmark className="w-8 h-8 text-secondary" />
          <span className="font-headline text-lg font-bold text-primary">নিকটস্থ মসজিদ</span>
        </button>
      </section>
    </div>
  );
}
