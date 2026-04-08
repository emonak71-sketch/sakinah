import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quranService, SurahDetail, Ayah } from '@/src/services/quranService';
import { ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function SurahDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (id) {
      quranService.getSurahDetail(parseInt(id)).then((data) => {
        setSurah(data);
        setLoading(false);
      });
    }
  }, [id]);

  const toggleAudio = (ayah: Ayah) => {
    if (playingId === ayah.number) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = ayah.audio;
        audioRef.current.play();
        setPlayingId(ayah.number);
      }
    }
  };

  const onAudioEnded = () => {
    setPlayingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!surah) return null;

  return (
    <div className="space-y-8 pb-20">
      <audio ref={audioRef} onEnded={onAudioEnded} />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/quran')}
          className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary">{surah.name}</h1>
          <p className="text-on-surface-variant text-sm">
            {surah.englishName} • {surah.numberOfAyahs} আয়াত • {surah.revelationType === 'Meccan' ? 'মক্কী' : 'মাদানী'}
          </p>
        </div>
      </div>

      {/* Bismillah */}
      {surah.number !== 1 && (
        <div className="text-center py-8">
          <p className="text-3xl font-headline text-primary">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-6">
        {surah.ayahs.map((ayah) => (
          <motion.div 
            key={ayah.number}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-4"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {ayah.numberInSurah}
                </div>
                <button 
                  onClick={() => toggleAudio(ayah)}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    playingId === ayah.number ? "bg-primary text-white" : "bg-surface-container-high text-primary hover:bg-primary/10"
                  )}
                >
                  {playingId === ayah.number ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
              </div>
              <p className="text-right text-3xl leading-[2.5] font-headline text-primary flex-1" dir="rtl">
                {ayah.text}
              </p>
            </div>
            <div className="pt-4 border-t border-surface-container-high">
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {ayah.translation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
