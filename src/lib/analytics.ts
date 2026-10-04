import { initializeAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { getFirebaseApp, isFirebaseConfigured } from '@/lib/firebase';

export type EventParams = Record<string, string | number | boolean | undefined>;

const OPT_OUT_KEY = 'analytics-disabled';
const debugMode   = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true';

// Only collect in production builds, unless debug mode is on (events then show in GA's DebugView)
const enabled = isFirebaseConfigured && (process.env.NODE_ENV === 'production' || debugMode);

let analyticsPromise: Promise<Analytics | null> | null = null;

// Visiting with ?analytics=off (or =on) remembers the choice in this browser, so your own visits don't skew the numbers
const isOptedOut = () => {
  try {
    const param = new URLSearchParams(window.location.search).get('analytics');
    if (param === 'off') localStorage.setItem(OPT_OUT_KEY, 'true');
    if (param === 'on')  localStorage.removeItem(OPT_OUT_KEY);
    return localStorage.getItem(OPT_OUT_KEY) === 'true';
  } catch {
    return false;
  }
};

// Lazily start analytics once, in the browser only (also logs the initial page_view)
export const initAnalytics = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);

  analyticsPromise ??= (async () => {
    if (!enabled || isOptedOut() || !(await isSupported())) return null;
    return initializeAnalytics(getFirebaseApp(), { config: debugMode ?({ debug_mode: true }) :({}) });
  })().catch(() => null); // Blocked by an ad blocker etc. shouldn't break the site

  return analyticsPromise;
};

export const trackEvent = (name: string, params?: EventParams) => {
  initAnalytics().then((analytics) => {
    if (analytics) logEvent(analytics, name, params);
  });
};
