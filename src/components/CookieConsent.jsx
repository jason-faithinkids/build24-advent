'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie_consent_v1';
const GTAG_ID = 'G-HF5BTW2KP6';
const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;

function bootstrapAnalytics() {
  if (typeof window === 'undefined') return;
  if (document.querySelector('script[data-gtag="true"]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = GTAG_SRC;
  script.dataset.gtag = 'true';
  document.head.appendChild(script);

  const inline = document.createElement('script');
  inline.dataset.gtagInit = 'true';
  inline.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GTAG_ID}');
  `;
  document.head.appendChild(inline);
}

export default function CookieConsent() {
  const [status, setStatus] = useState('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    setStatus(stored === 'accepted' || stored === 'declined' ? stored : 'prompt');
  }, []);

  useEffect(() => {
    if (status === 'accepted') {
      bootstrapAnalytics();
    }
  }, [status]);

  const saveStatus = (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    }
    setStatus(value);
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

