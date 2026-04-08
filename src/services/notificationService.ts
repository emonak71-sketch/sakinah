import { getPrayerTimes, PrayerTime } from './prayerTimesService';

export function setupAzanNotifications() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Check every minute
  setInterval(() => {
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const times = getPrayerTimes();
    const currentPrayer = times.find(p => p.startTime === currentTimeStr);

    // Check if notifications are enabled in settings
    const savedSettings = localStorage.getItem('sakinah_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : { azanNotifications: true };

    if (currentPrayer && Notification.permission === "granted" && settings.azanNotifications) {
      new Notification(`আজানের সময় হয়েছে: ${currentPrayer.name}`, {
        body: `এখন ${currentPrayer.name} নামাজের সময়। দয়া করে নামাজের প্রস্তুতি নিন।`,
        icon: '/favicon.ico' // Or a custom icon
      });
      
      // Play a subtle sound if possible
      const audio = new Audio('https://www.soundjay.com/buttons/sounds/beep-07.mp3');
      audio.play().catch(e => console.log('Audio play blocked'));
    }
  }, 60000);
}
