export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  audio: string;
  audioSecondary: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranService = {
  async getSurahs(): Promise<Surah[]> {
    const response = await fetch(`${BASE_URL}/surah`);
    const data = await response.json();
    return data.data;
  },

  async getSurahDetail(number: number): Promise<SurahDetail> {
    // Fetch Arabic text with audio
    const arabicResponse = await fetch(`${BASE_URL}/surah/${number}/ar.alafasy`);
    const arabicData = await arabicResponse.json();

    // Fetch Bengali translation
    const translationResponse = await fetch(`${BASE_URL}/surah/${number}/bn.bengali`);
    const translationData = await translationResponse.json();

    const surah = arabicData.data;
    const translations = translationData.data.ayahs;

    // Merge translation into ayahs
    surah.ayahs = surah.ayahs.map((ayah: Ayah, index: number) => ({
      ...ayah,
      translation: translations[index].text,
    }));

    // Save as last read
    this.saveLastRead(surah.number, surah.englishName);

    return surah;
  },

  saveLastRead(number: number, name: string) {
    localStorage.setItem('lastReadSurah', JSON.stringify({ number, name, time: new Date().toISOString() }));
  },

  getLastRead(): { number: number; name: string } | null {
    const data = localStorage.getItem('lastReadSurah');
    return data ? JSON.parse(data) : null;
  }
};
