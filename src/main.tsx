import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

// Register PWA service worker
registerSW({ immediate: true });

// Notify Capgo that the app is ready (prevents rollback)
CapacitorUpdater.notifyAppReady();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
