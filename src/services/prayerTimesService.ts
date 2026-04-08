export interface PrayerTime {
  name: string;
  startTime: string; // HH:mm AM/PM
  endTime: string;
  id: string;
}

export interface ForbiddenTime {
  name: string;
  time: string;
  id: string;
}

export function getPrayerTimes(): PrayerTime[] {
  // Mocking accurate times for Dhaka (approximate for April)
  return [
    { id: 'fajr', name: 'ফজর', startTime: '০৪:৩০ AM', endTime: '০৫:৫০ AM' },
    { id: 'dhuhr', name: 'জোহর', startTime: '১২:০৫ PM', endTime: '০৪:১৫ PM' },
    { id: 'asr', name: 'আসর', startTime: '০৪:৩০ PM', endTime: '০৬:১০ PM' },
    { id: 'maghrib', name: 'মাগরিব', startTime: '০৬:২০ PM', endTime: '০৭:৩০ PM' },
    { id: 'isha', name: 'এশা', startTime: '০৭:৪৫ PM', endTime: '০৪:২০ AM' },
  ];
}

export function getForbiddenTimes(): ForbiddenTime[] {
  return [
    { id: 'sunrise', name: 'সূর্যোদয় (নামাজ নিষেধ)', time: '০৫:৫০ AM' },
    { id: 'zawwal', name: 'জাওয়াল (নামাজ নিষেধ)', time: '১১:৫৫ AM' },
    { id: 'sunset', name: 'সূর্যাস্ত (নামাজ নিষেধ)', time: '০৬:১০ PM' },
  ];
}

function timeToMinutes(timeStr: string): number {
  const bnToEn: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const convert = (s: string) => s.split('').map(c => bnToEn[c] || c).join('');
  
  const [timePart, ampm] = timeStr.split(' ');
  const [hourStr, minuteStr] = timePart.split(':');
  
  let hour = Number(convert(hourStr));
  let minute = Number(convert(minuteStr));

  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  
  return hour * 60 + minute;
}

export function getCurrentAndNextPrayer() {
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  const times = getPrayerTimes();
  
  let current: PrayerTime | null = null;
  let next: PrayerTime | null = null;

  // Find current prayer
  for (let i = 0; i < times.length; i++) {
    const start = timeToMinutes(times[i].startTime);
    let end = timeToMinutes(times[i].endTime);
    
    // Handle Isha crossing midnight
    if (times[i].id === 'isha' && end < start) {
      if (currentTimeInMinutes >= start || currentTimeInMinutes < end) {
        current = times[i];
        next = times[0]; // Next is Fajr
        break;
      }
    } else {
      if (currentTimeInMinutes >= start && currentTimeInMinutes < end) {
        current = times[i];
        next = times[(i + 1) % times.length];
        break;
      }
    }
  }

  // If not in any prayer time, find the next one
  if (!current) {
    for (let i = 0; i < times.length; i++) {
      const start = timeToMinutes(times[i].startTime);
      if (start > currentTimeInMinutes) {
        next = times[i];
        break;
      }
    }
    // If it's late night after Isha end but before Fajr start
    if (!next) {
      next = times[0]; // Fajr
    }
  }

  return { current, next };
}

export function getTimeRemaining(targetTimeStr: string): string {
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  let targetMinutes = timeToMinutes(targetTimeStr);
  
  let diff = targetMinutes - currentTimeInMinutes;
  if (diff < 0) diff += 1440; // Add 24 hours
  
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  
  const toBn = (n: number) => n.toString().split('').map(c => '০১২৩৪৫৬৭৮৯'[parseInt(c)]).join('');
  
  if (hours === 0) return `${toBn(minutes)} মিনিট`;
  return `${toBn(hours)} ঘণ্টা ${toBn(minutes)} মিনিট`;
}
