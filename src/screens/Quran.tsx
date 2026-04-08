import React, { useEffect, useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { quranService, Surah } from '@/src/services/quranService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [lastRead, setLastRead] = useState<{ number: number; name: string } | null>(null);

  useEffect(() => {
    quranService.getSurahs().then((data) => {
      setSurahs(data);
      setLoading(false);
    });
    setLastRead(quranService.getLastRead());
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.includes(searchQuery) ||
    s.number.toString().includes(searchQuery)
  );

  const handleLastRead = () => {
    const lastRead = quranService.getLastRead();
    if (lastRead) {
      navigate(`/quran/${lastRead.number}`);
    } else {
      alert('আপনি এখনও কোনো সূরা পড়েননি।');
    }
  };

  return (
    <div className="space-y-8">
      {/* Search area */}
      <div>
        <h1 className="font-headline text-3xl font-bold text-primary mb-2">আল কুরআন</h1>
        <p className="text-on-surface-variant text-sm mb-6">পবিত্র কোরআনের নূর আপনার হৃদয়কে আলোকিত করুক।</p>
        <div className="relative">
          <input 
            type="text"
            placeholder="সূরা খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-12 pr-4 bg-surface-container-highest border-none rounded-2xl focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all text-on-surface placeholder:text-on-surface-variant/60"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
        </div>
      </div>

      {/* Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary p-6 rounded-lg text-white flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <BookOpen className="w-32 h-32 fill-current" />
          </div>
          <div>
            <span className="bg-white/20 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Today's Ayah</span>
            <p className="mt-4 font-headline text-lg leading-relaxed">"নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।"</p>
          </div>
          <p className="text-xs opacity-70">সূরা আলাম নাশরাহ: ৫</p>
        </div>

        <div 
          onClick={handleLastRead}
          className="bg-secondary-fixed-dim p-6 rounded-lg text-primary flex flex-col justify-between h-48 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div>
            <span className="bg-black/10 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Reading Progress</span>
            <h3 className="mt-4 font-bold text-xl">{lastRead ? lastRead.name : 'সূরা আল-কাহফ'}</h3>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[65%]" />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>{lastRead ? 'অব্যাহত রাখুন' : 'আয়াত ৪৫/১১০'}</span>
              <span className="font-bold">{lastRead ? '' : '৬৫%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Surah List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl font-bold text-primary">সূরার তালিকা</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSurahs.map((surah) => (
              <motion.div 
                key={surah.number}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/quran/${surah.number}`)}
                className="bg-surface-container-low hover:bg-surface-container-high transition-all p-5 rounded-lg flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold border border-outline-variant/10 group-hover:bg-primary group-hover:text-white transition-colors rotate-45">
                    <span className="-rotate-45">{surah.number}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">{surah.englishName}</h3>
                    <p className="text-xs text-on-surface-variant">{surah.englishNameTranslation} | {surah.numberOfAyahs} আয়াত</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold mb-1 text-xl font-headline">{surah.name}</div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    surah.revelationType === 'Meccan' ? 'bg-secondary/10 text-secondary' : 'bg-primary-container/10 text-primary'
                  }`}>
                    {surah.revelationType === 'Meccan' ? 'মক্কী' : 'মাদানী'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <button 
        onClick={handleLastRead}
        className="fixed bottom-32 right-6 bg-primary text-white flex items-center gap-3 px-6 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all z-40 border border-white/10"
      >
        <BookOpen className="w-5 h-5 fill-current" />
        <span className="font-bold">শেষ পড়া</span>
      </button>
    </div>
  );
}
