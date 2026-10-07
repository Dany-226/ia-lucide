'use client';

import { useEffect, useState } from 'react';

const ID = 'G-MEPSECVMSM';
const KEY = 'ialucide-analytics-consent-v1';
const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000;
type Choice = 'accepted' | 'refused';
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  'ga-disable-G-MEPSECVMSM'?: boolean;
};

function readChoice(): Choice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    return saved && saved.expires > Date.now() && ['accepted', 'refused'].includes(saved.choice)
      ? saved.choice : null;
  } catch { return null; }
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (name !== '_ga' && !name.startsWith('_ga_')) continue;
    const parts = location.hostname.split('.');
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (let i = 0; i < parts.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${parts.slice(i).join('.')}`;
    }
  }
}

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Read browser-only storage after hydration; no Google request before consent.
    const timer = window.setTimeout(() => {
      const saved = readChoice();
      setChoice(saved);
      setOpen(saved === null);
      setReady(true);
      if (saved !== 'accepted') clearAnalyticsCookies();
    }, 0);
    const sync = (event: StorageEvent) => {
      if (event.key === KEY || event.key === null) location.reload();
    };
    window.addEventListener('storage', sync);
    return () => { clearTimeout(timer); window.removeEventListener('storage', sync); };
  }, []);

  useEffect(() => {
    if (choice !== 'accepted') return;
    const analytics = window as AnalyticsWindow;
    if (document.getElementById('ialucide-ga4')) return;
    analytics.dataLayer = analytics.dataLayer || [];
    // gtag's documented queue uses an Arguments object, not a nested array.
    // eslint-disable-next-line prefer-rest-params
    analytics.gtag = function () { analytics.dataLayer!.push(arguments); };
    analytics.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    analytics.gtag('js', new Date());
    // GA4 enhanced measurement handles history changes; do not add manual pageviews.
    analytics.gtag('config', ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 60 * 60 * 24 * 180,
      cookie_update: false,
    });
    const script = document.createElement('script');
    script.id = 'ialucide-ga4';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    document.head.appendChild(script);
    const expiry = window.setInterval(() => {
      if (readChoice() === 'accepted') return;
      analytics['ga-disable-G-MEPSECVMSM'] = true;
      clearAnalyticsCookies();
      location.reload();
    }, 60_000);
    return () => clearInterval(expiry);
  }, [choice]);

  function choose(next: Choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: next, expires: Date.now() + SIX_MONTHS })); }
    catch { /* Respect the choice for this page even if storage is unavailable. */ }
    if (next === 'refused') {
      const analytics = window as AnalyticsWindow;
      analytics['ga-disable-G-MEPSECVMSM'] = true;
      clearAnalyticsCookies();
      if (choice === 'accepted') { location.reload(); return; }
    } else {
      (window as AnalyticsWindow)['ga-disable-G-MEPSECVMSM'] = false;
    }
    setChoice(next);
    setOpen(false);
  }

  return (
    <>
      <div className="bg-[#fcf9f0] text-center py-3">
        <button type="button" onClick={() => setOpen(true)} className="text-sm underline text-[#1c1c17] px-4 py-2">
          Gérer mes cookies
        </button>
      </div>
      {ready && open && (
        <section role="region" aria-label="Choix des cookies de mesure d’audience" className="fixed bottom-0 inset-x-0 z-[100] bg-[#fcf9f0] text-[#1c1c17] border-t border-[#c9a84c] p-5 shadow-xl">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-5 md:items-center">
            <div className="flex-1">
              <h2 className="font-bold mb-2">Mesure d’audience</h2>
              <p className="text-sm">Avec votre accord, Google Analytics mesure les visites et les pages consultées. Refuser n’empêche pas de lire le site. Votre choix est conservé six mois et reste modifiable via « Gérer mes cookies ».</p>
              <a className="text-sm underline" href="/politique-confidentialite/">Politique de confidentialité</a>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => choose('refused')} className="border border-[#1c1c17] px-5 py-3 font-bold">Refuser</button>
              <button type="button" onClick={() => choose('accepted')} className="border border-[#1c1c17] px-5 py-3 font-bold">Accepter</button>
              {choice && <button type="button" onClick={() => setOpen(false)} className="underline px-3 py-3">Fermer</button>}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
