'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie_consent_v1';

function updateConsent(status) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const analytics = status === 'accepted' ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    analytics_storage: analytics,
  });
}

export default function CookieConsent() {
  const [status, setStatus] = useState('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const effective = stored === 'accepted' || stored === 'declined' ? stored : 'prompt';
    setStatus(effective);
    if (effective === 'accepted' || effective === 'declined') {
      updateConsent(effective);
    }
  }, []);

  const saveStatus = (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    }
    setStatus(value);
    updateConsent(value);
  };

  if (status !== 'prompt') {
    return null;
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite">
      <div className="cookie-consent__message">
        <strong>Cookies & analytics</strong>
        <p>
          We use cookies to understand how the site is used and to improve the experience. Accept analytics cookies
          to enable measurements via Google Tag Manager.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-btn cookie-btn--primary" onClick={() => saveStatus('accepted')}>
          Accept analytics
        </button>
        <button type="button" className="cookie-btn" onClick={() => saveStatus('declined')}>
          Decline
        </button>
      </div>
    </div>
  );
}

