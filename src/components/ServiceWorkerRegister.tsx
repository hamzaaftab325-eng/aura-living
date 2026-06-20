'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker for PWA offline support.
 * Only runs in production to avoid stale-cache issues during development.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    // Only register in production
    if (process.env.NODE_ENV !== 'production') return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      } catch (err) {
        // Silent fail — PWA is progressive enhancement
        console.warn('SW registration failed:', err);
      }
    };

    // Register after window load to not compete with initial resources
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}
