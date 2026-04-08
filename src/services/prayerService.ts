import { useState, useEffect } from 'react';

export interface PrayerState {
  [date: string]: {
    [prayer: string]: boolean;
  };
}

export function usePrayerTracker() {
  const [history, setHistory] = useState<PrayerState>(() => {
    const saved = localStorage.getItem('sakinah_prayer_history');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('sakinah_prayer_history', JSON.stringify(history));
  }, [history]);

  const today = new Date().toISOString().split('T')[0];

  const togglePrayer = (prayerId: string) => {
    setHistory(prev => {
      const dayData = prev[today] || {};
      return {
        ...prev,
        [today]: {
          ...dayData,
          [prayerId]: !dayData[prayerId]
        }
      };
    });
  };

  const getTodayStats = () => {
    const dayData = history[today] || {};
    const completed = Object.values(dayData).filter(Boolean).length;
    return { completed, total: 5 };
  };

  const getWeeklyStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });

    let totalCompleted = 0;
    const dayStats = last7Days.map(date => {
      const dayData = history[date] || {};
      const count = Object.values(dayData).filter(Boolean).length;
      totalCompleted += count;
      return { date, count };
    }).reverse();

    const percentage = (totalCompleted / 35) * 100;
    return { dayStats, percentage, totalCompleted };
  };

  return { history, today, togglePrayer, getTodayStats, getWeeklyStats };
}
