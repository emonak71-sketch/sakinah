export interface Hadith {
  text: string;
  source: string;
}

const hadiths: Hadith[] = [
  {
    text: "তোমাদের মধ্যে সেই ব্যক্তিই সর্বোত্তম যে কুরআন শেখে এবং অন্যকে শেখায়।",
    source: "সহীহ বুখারী"
  },
  {
    text: "নিশ্চয়ই সকল কাজ নিয়তের ওপর নির্ভরশীল।",
    source: "সহীহ বুখারী"
  },
  {
    text: "পবিত্রতা ঈমানের অর্ধেক।",
    source: "সহীহ মুসলিম"
  },
  {
    text: "যে ব্যক্তি মানুষের প্রতি দয়া করে না, আল্লাহ তার প্রতি দয়া করেন না।",
    source: "সহীহ মুসলিম"
  },
  {
    text: "তোমরা সহজ করো, কঠিন করো না; সুসংবাদ দাও, বিতৃষ্ণ করো না।",
    source: "সহীহ বুখারী"
  }
];

export const hadithService = {
  getDailyHadith(): Hadith {
    const today = new Date();
    const index = (today.getFullYear() + today.getMonth() + today.getDate()) % hadiths.length;
    return hadiths[index];
  }
};
