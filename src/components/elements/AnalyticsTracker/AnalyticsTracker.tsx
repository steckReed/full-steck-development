'use client';

import { useEffect } from 'react';
import { initAnalytics, trackEvent, type EventParams } from '@/lib/analytics';

// Anything a visitor can click on; add data-analytics="Label" to track (or name) anything else
const CLICKABLE = [
  'a[href]', 'button', 'input[type="checkbox"]', 'input[type="radio"]',
  '[role="button"]', '[role="tab"]', '[role="option"]', '[role="menuitem"]', '[role="switch"]', '[role="checkbox"]',
  '[data-analytics]',
].join(', ');

// Readable name for an element: explicit data-analytics label first, then its accessible name, then its visible text
const getLabel = (el: HTMLElement) => (
  el.dataset.analytics || el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '(unlabeled)'
).replace(/\s+/g, ' ').trim().slice(0, 100);

// Which page section an element is in, and which pass of the infinite scroll (1 = first time through)
const getSection = (el: Element): EventParams => {
  const section = el.closest<HTMLElement>('[data-analytics-section]');
  if (!section) return {};

  const name = section.dataset.analyticsSection!;
  const loop = Array.from(document.querySelectorAll(`[data-analytics-section="${name}"]`)).indexOf(section) + 1;
  return { section: name, loop };
};

const AnalyticsTracker = () => {
  useEffect(() => {
    initAnalytics();

    // Clicks: one listener for the whole page (capture phase, so it runs even if a component stops propagation)
    const handleClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(CLICKABLE);
      if (!el) return;

      const params: EventParams = { label: getLabel(el), element_type: el.getAttribute('role') || el.tagName.toLowerCase(), ...getSection(el) };

      if (el instanceof HTMLAnchorElement) {
        const url = new URL(el.href, window.location.href);
        params.link_url = el.href;
        params.outbound = (url.origin !== window.location.origin);
      }

      trackEvent('ui_click', params);
    };
    document.addEventListener('click', handleClick, { capture: true });

    // Section views: logged once per section per pass, when it crosses the middle of the screen
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionObserver.unobserve(entry.target);
        trackEvent('section_view', getSection(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    // The infinite scroll keeps adding sections, so watch for new ones
    const observed = new WeakSet<Element>();
    const observeSections = () => {
      document.querySelectorAll('[data-analytics-section]').forEach((section) => {
        if (observed.has(section)) return;
        observed.add(section);
        sectionObserver.observe(section);
      });
    };
    observeSections();

    let scanTimeout: ReturnType<typeof setTimeout> | undefined;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(scanTimeout);
      scanTimeout = setTimeout(observeSections, 300);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      sectionObserver.disconnect();
      mutationObserver.disconnect();
      clearTimeout(scanTimeout);
    };
  }, []);

  return null;
}

export default AnalyticsTracker;
