export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  async showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      // Check if service worker is available for better mobile support
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
          icon: '/logo.svg',
          badge: '/logo.svg',
          ...options
        });
      } else {
        new Notification(title, {
          icon: '/logo.svg',
          ...options
        });
      }
    }
  }
};

export const setupAzanNotifications = () => {
  console.log('Setting up Azan notifications...');
  notificationService.requestPermission();
};
