import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Fingerprint } from 'lucide-react';

export default function Tasbih() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleReset = () => {
    setCount(0);
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 30, 30]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-headline text-3xl font-bold text-primary">ডিজিটাল তসবিহ</h1>
        <p className="text-on-surface-variant">আল্লাহর জিকিরে মন শান্ত রাখুন</p>
      </div>

      <div className="relative">
        <motion.div 
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-64 h-64 rounded-full bg-primary flex items-center justify-center shadow-2xl border-8 border-secondary-fixed-dim/20"
        >
          <span className="text-6xl font-bold text-white font-mono">{count}</span>
        </motion.div>
        
        <button 
          onClick={handleReset}
          className="absolute -top-4 -right-4 p-4 bg-white rounded-full shadow-lg text-primary hover:bg-surface-container-low transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <button
        onClick={handleIncrement}
        className="w-full max-w-xs py-8 bg-secondary-fixed-dim text-primary rounded-3xl font-bold text-xl flex flex-col items-center gap-4 shadow-xl active:scale-95 transition-all"
      >
        <Fingerprint className="w-12 h-12" />
        জিকির করুন
      </button>
    </div>
  );
}
