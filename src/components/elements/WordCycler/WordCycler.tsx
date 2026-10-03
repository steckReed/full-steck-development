'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface Props{
  words       : string[];  // Last word is the one it settles on
  introSpeed  ?: number;   // ms per word during the intro cycle
}

const WordCycler = ({
  words,
  introSpeed = 850
}: Props) => {
  const ref           = useRef<HTMLButtonElement>(null);
  const inView        = useInView(ref, { once: true, amount: 1 });
  const reduceMotion  = useReducedMotion();
  const [index, setIndex] = useState(0);

  // Intro: cycle through every word once, then settle on the last one
  useEffect(() => {
    if (reduceMotion) { setIndex(words.length - 1); return; }
    if (!inView) return;

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
  }, [inView, reduceMotion, words.length, introSpeed]);

  return(
    <motion.button
      ref         = {ref}
      layout
      type        = 'button'
      onClick     = {() => setIndex((prev) => (prev + 1) % words.length)}
      aria-label  = {`${words[index]} (click to change word)`}
      title       = 'Click me!'
      transition  = {{ type: 'spring', bounce: 0, duration: 0.4 }}
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
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.span
          key         = {words[index]}
          initial     = {{ y: '110%', opacity: 0 }}
          animate     = {{ y: 0, opacity: 1 }}
          exit        = {{ y: '-110%', opacity: 0 }}
          transition  = {{ type: 'spring', bounce: 0, duration: 0.4 }}
          style       = {{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>

      <AutorenewIcon sx={{ fontSize: '0.85em', opacity: 0.8 }} />
    </motion.button>
  )
};

export default WordCycler;
