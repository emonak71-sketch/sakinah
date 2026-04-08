import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sakinah.app',
  appName: 'Sakinah',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
