'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface Props{
  words       : string[];  // Last word is the one it settles on
  introSpeed  ?: number;   // ms per word during the intro cycle
  start       ?: boolean;  // Overrides the in-view trigger (e.g. when shown on a rotated 3D face)
}

const WordCycler = ({
  words,
  introSpeed = 850,
  start
}: Props) => {
  const ref           = useRef<HTMLButtonElement>(null);
  const inView        = useInView(ref, { once: true, amount: 1 });
  const shouldStart   = start ?? inView;
  const reduceMotion  = useReducedMotion();
  const [index, setIndex] = useState(0);
  const sizerRef      = useRef<HTMLSpanElement>(null);
  const [wordWidth, setWordWidth] = useState<number | null>(null);

  // Measure the current word with offsetWidth, which ignores parent transforms (3D cube, ScaleToFit).
  // Motion's `layout` measures with getBoundingClientRect, which includes them, and warped the chip.
  useLayoutEffect(() => {
    const measure = () => { if (sizerRef.current) setWordWidth(sizerRef.current.offsetWidth); };
    measure();
    document.fonts?.ready.then(measure); // Re-measure once the web font has loaded
  }, [index]);

  // Intro: cycle through every word once, then settle on the last one
  useEffect(() => {
    if (reduceMotion) { setIndex(words.length - 1); return; }
    if (!shouldStart) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, introSpeed);

    return () => clearInterval(interval);
  }, [shouldStart, reduceMotion, words.length, introSpeed]);

  return(
    <button
      ref         = {ref}
      type        = 'button'
      onClick     = {() => setIndex((prev) => (prev + 1) % words.length)}
      aria-label  = {`${words[index]} (click to change word)`}
      title       = 'Click me!'
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        overflow: 'hidden',
        verticalAlign: 'middle',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        backgroundColor: 'var(--color-navy)',
        padding: '.4rem 1rem',
        borderRadius: '25px',
        fontSize: 'clamp(17px, 4vw, 20px)',
        color: 'white',
        fontWeight: '600',
        letterSpacing: '2px'
      }}
    >
      {/* Word area: width animates to the measured word, words slide in/out inside it */}
      <motion.span
        initial     = {false}
        animate     = {{ width: wordWidth ?? 'auto' }}
        transition  = {{ type: 'spring', bounce: 0, duration: 0.4 }}
        style       = {{ position: 'relative', display: 'inline-block', height: '1.2em', lineHeight: '1.2em', overflow: 'hidden' }}
      >
        {/* Invisible copy of the current word, used only for measuring */}
        <span ref={sizerRef} aria-hidden='true' style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap' }}>
          {words[index]}
        </span>

        <AnimatePresence initial={false}>
          <motion.span
            key         = {words[index]}
            initial     = {{ y: '110%', opacity: 0 }}
            animate     = {{ y: 0, opacity: 1 }}
            exit        = {{ y: '-110%', opacity: 0 }}
            transition  = {{ type: 'spring', bounce: 0, duration: 0.4 }}
            style       = {{ position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap' }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </motion.span>

      <AutorenewIcon sx={{ fontSize: '0.85em', opacity: 0.8 }} />
    </button>
  )
};

export default WordCycler;
