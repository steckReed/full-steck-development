import { RefObject, useEffect, useRef } from 'react';
import { MotionValue, useMotionValueEvent, useScroll } from 'motion/react';

interface Options {
  targetRef : RefObject<HTMLElement>;   // The section whose pixel-curtain stage sits under the NavBar
  cover     : MotionValue<number>;      // The curtain's cover progress (0 to 1)
  clear     : MotionValue<number>;      // The curtain's clear progress (0 to 1, clears bottom rows first)
  color     : string;                   // Curtain color as hex, e.g. '#CFCEB7'
  coverFrom : 'top' | 'bottom';         // Edge the curtain fills from
}

const navbarHeight  = 36;
const creamRgb      = [249, 247, 244];

const hexToRgb = (hex: string) => {
  const value = parseInt(hex.replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

/*
  Tints the NavBar (via the --navbar-bg CSS variable) to match a section's pixel curtain while it's behind the NavBar.
  Only the section actually under the NavBar sets it, so several sections (or repeated copies of the page) can each use this.
*/
const useNavbarTint = ({ targetRef, cover, clear, color, coverFrom }: Options) => {
  const { scrollY } = useScroll();
  const owns        = useRef(false);
  const lastTint    = useRef(-1);
  const colorRgb    = hexToRgb(color);

  const update = () => {
    const el = targetRef.current;
    if (!el) return;

    const rect      = el.getBoundingClientRect();
    const underNav  = rect.top < navbarHeight && rect.bottom > 0;   // This section's stage is under the NavBar
    if (!underNav && !owns.current) return;                         // Another section has it
    owns.current = underNav;

    // Fade in as the stage slides under the NavBar, fade out as the curtain's top rows clear (they clear last)
    const slidIn  = Math.min(1, Math.max(0, (navbarHeight - rect.top) / navbarHeight));
    // Top rows fill first when covering from the top, last when covering from the bottom
    const covered = (coverFrom === 'top')
      ?(Math.min(1, Math.max(0, cover.get() / 0.45)))
      :(Math.min(1, Math.max(0, (cover.get() - 0.55) / 0.4)));
    const cleared = Math.min(1, Math.max(0, (clear.get() - 0.55) / 0.4));
    const tint    = underNav ?(Math.round(slidIn * covered * (1 - cleared) * 100) / 100) :(0);
    if (tint === lastTint.current) return;
    lastTint.current = tint;

    const rgb = creamRgb.map((cream, i) => Math.round(cream + (colorRgb[i] - cream) * tint));
    document.documentElement.style.setProperty('--navbar-bg', `rgb(${rgb.join(', ')})`);
  };

  useMotionValueEvent(scrollY, 'change', update);
  useMotionValueEvent(cover, 'change', update);   // The curtain values can update after the scroll event in the same frame
  useMotionValueEvent(clear, 'change', update);
  useEffect(() => {
    update(); // In case the page loads already scrolled into the section
    return () => { if (owns.current) document.documentElement.style.removeProperty('--navbar-bg'); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useNavbarTint;
