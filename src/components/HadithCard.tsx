import React, { useMemo } from 'react';
import { Quote, Bookmark } from 'lucide-react';
import { useSettings } from '@/src/context/SettingsContext';

export default function HadithCard() {
  const { user } = useSettings();

  const hadiths = useMemo(() => {
    const general = [
      {
        text: "তোমাদের মধ্যে সেই ব্যক্তিই সর্বোত্তম, যে কুরআন শেখে এবং অন্যকে তা শেখায়।",
        source: "সহীহ বুখারী, ৫০২৭"
      },
      {
        text: "পিতা-মাতার সন্তুষ্টিতে আল্লাহর সন্তুষ্টি এবং পিতা-মাতার অসন্তুষ্টিতে আল্লাহর অসন্তুষ্টি নিহিত।",
        source: "তিরমিযী, ১৮৯৯"
      },
      {
        text: "তোমরা তোমাদের সন্তানদেরকে সম্মান করো এবং তাদেরকে উত্তম আদব শিক্ষা দাও।",
        source: "ইবনে মাজাহ, ৩৬৭১"
      }
    ];

    const marriageAndHonor = [
      {
        text: "যখন তোমাদের কাছে এমন কোনো ব্যক্তি বিয়ের প্রস্তাব নিয়ে আসে যার দ্বীনদারী ও চরিত্র তোমাদের পছন্দ হয়, তবে তার সাথে বিয়ে সম্পন্ন করো।",
        source: "তিরমিযী, ১০৮৪"
      },
      {
        text: "লজ্জা ও ঈমান একে অপরের পরিপূরক। যখন একটি উঠে যায়, অন্যটিও চলে যায়।",
        source: "শুআবুল ঈমান, ৭৩৩১"
      },
      {
        text: "প্রকৃত মুসলিম সেই ব্যক্তি, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।",
        source: "সহীহ বুখারী, ১০"
      }
    ];

    const maleSpecific = [
      {
        text: "তোমাদের মধ্যে সেই ব্যক্তিই উত্তম, যে তার স্ত্রীর নিকট উত্তম।",
        source: "তিরমিযী, ৩৮৯৫"
      }
    ];

    const femaleSpecific = [
      {
        text: "যে নারী পাঁচ ওয়াক্ত নামাজ পড়ে, রমজানের রোজা রাখে, নিজের লজ্জাস্থান হেফাজত করে এবং স্বামীর আনুগত্য করে, তাকে বলা হবে: জান্নাতের যে দরজা দিয়ে ইচ্ছা প্রবেশ করো।",
        source: "সহীহ ইবনে হিব্বান, ৪১৬৩"
      }
    ];

    let pool = [...general, ...marriageAndHonor];
    if (user?.gender === 'male') pool = [...pool, ...maleSpecific];
    if (user?.gender === 'female') pool = [...pool, ...femaleSpecific];

    return pool;
  }, [user?.gender]);

  // Select a random hadith based on the day
  const dailyHadith = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return hadiths[dayOfYear % hadiths.length];
  }, [hadiths]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'আজকের হাদিস - সাকিনাহ',
          text: `${dailyHadith.text}\n\n— ${dailyHadith.source}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      const text = `${dailyHadith.text}\n\n— ${dailyHadith.source}`;
      navigator.clipboard.writeText(text);
      alert('হাদিসটি ক্লিপবোর্ডে কপি করা হয়েছে।');
    }
  };

  const handleSave = () => {
    alert('হাদিসটি আপনার বুকমার্কে সেভ করা হয়েছে।');
  };

  return (
    <section className="relative overflow-hidden bg-surface-container-low rounded-lg p-8 group">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-fixed-dim/10 rounded-full blur-3xl group-hover:bg-secondary-fixed-dim/20 transition-colors" />
      <div className="relative space-y-6">
        <div className="flex items-center gap-3">
          <Quote className="w-5 h-5 text-secondary fill-current" />
          <h3 className="text-secondary font-bold text-sm tracking-widest uppercase">আজকের হাদিস</h3>
        </div>
        <div className="space-y-4">
          <p className="font-headline text-2xl text-primary leading-[1.8] font-medium">
            "{dailyHadith.text}"
          </p>
          <div className="h-[2px] w-12 bg-secondary-fixed-dim rounded-full" />
          <p className="text-on-surface-variant text-sm font-semibold">— {dailyHadith.source}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="px-6 py-2 bg-primary text-white rounded-full text-xs font-bold hover:opacity-90 transition-opacity active:scale-95"
          >
            শেয়ার করুন
          </button>
          <button 
            onClick={handleSave}
            className="p-2 bg-surface-container-high text-primary rounded-full hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
