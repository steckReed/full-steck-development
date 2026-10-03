'use client'

import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import { motion, MotionValue, useMotionValueEvent } from 'motion/react';
import ScaleToFit from '@/components/elements/ScaleToFit/ScaleToFit';
import { aboutMe } from '@/data/aboutMe';

interface Props{
  progress: MotionValue<number>; // 0 to 1 while this face scrolls in & is held on screen
}

const ink = '#242424';
const hobbyColors = ['var(--color-plum)', 'var(--color-navy)', 'var(--color-rust)', 'var(--color-mustard)', 'var(--color-olive)'];

// The entrance plays once (on a timer, not scrubbed by scroll) when the face is mostly on screen,
// and resets once the visitor scrolls back above the cube so it can play again
const playAt  = 0.2; // ~45% of the cube on screen
const resetAt = 0.02;

const AboutMeFace = ({ progress }: Props) => {
  const [shown, setShown] = useState(() => progress.get() >= playAt);

  useMotionValueEvent(progress, 'change', (value) => {
    if (value >= playAt) setShown(true);
    else if (value <= resetAt) setShown(false);
  });

  return(<>
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '12px' }}>

      {/* Content */}
      <ScaleToFit minLayoutWidth={560} padTop={24} padBottom={24} fillWidth>
        <Box sx={{ display: 'grid', gap: '28px', padding: '0 clamp(16px, 4%, 48px)' }}>

          {/* Title */}
          <Reveal show={shown} delay={0}>
            <h1 style={{ textAlign: 'center', letterSpacing: '-2px', fontWeight: 'bold', fontSize: 'clamp(40px, 8vw, 60px)', lineHeight: 1.05 }}>
              {aboutMe.title}
            </h1>
          </Reveal>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(170px, 0.8fr) 1.6fr', gap: '28px', alignItems: 'start' }}>

            {/* Quick Stats */}
            <Box sx={{ display: 'grid', gap: '16px' }}>
              {aboutMe.stats.map((stat, i) => (
                <Reveal key={stat.label} show={shown} delay={0.15 + i * 0.1} x={-30}>
                  <Box className='paper paper-navy' style={{ width: '100%' }}>
                    <Box sx={{ backgroundColor: 'var(--color-cream)', border: `3px solid ${ink}`, borderRadius: '12px', padding: '10px 14px' }}>
                      <p style={{ fontWeight: 800, fontSize: '30px', letterSpacing: '-1px', lineHeight: 1.1, color: 'var(--color-navy)' }}>{stat.value}</p>
                      <p style={{ fontSize: '14px', letterSpacing: '0.5px' }}>{stat.label}</p>
                    </Box>
                  </Box>
                </Reveal>
              ))}
            </Box>

            <Box sx={{ display: 'grid', gap: '20px' }}>
              {/* Summary */}
              <Reveal show={shown} delay={0.25}>
                <p style={{ fontSize: '17px', lineHeight: 1.55 }}>{aboutMe.summary}</p>
              </Reveal>

              {/* Hobbies */}
              <Box sx={{ display: 'grid', gap: '10px' }}>
                <Reveal show={shown} delay={0.4}>
                  <p style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>When I&apos;m not coding</p>
                </Reveal>

                <ul style={{ display: 'grid', gap: '10px', listStyle: 'none', padding: 0 }}>
                  {aboutMe.hobbies.map((hobby, i) => (
                    <Reveal key={hobby.name} show={shown} delay={0.5 + i * 0.08} x={30} as='li'>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <span style={{ flexShrink: 0, width: '12px', height: '12px', borderRadius: '50%', backgroundColor: hobbyColors[i % hobbyColors.length], border: `2px solid ${ink}`, transform: 'translateY(1px)' }} />
                        <span style={{ fontSize: '16px', lineHeight: 1.45 }}>
                          <strong>{hobby.name}</strong>: {hobby.detail}
                        </span>
                      </Box>
                    </Reveal>
                  ))}
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScaleToFit>
    </Box>
  </>)
}

interface RevealProps{
  show      : boolean;
  delay     : number;   // Seconds after the entrance starts
  x         ?: number;  // Slide in from the side (px) instead of from below
  as        ?: 'div' | 'li';
  children  : ReactNode;
}

// Timed entrance: fades & slides in after `delay` once `show` turns on (resets instantly when it turns off)
const Reveal = ({ show, delay, x, as = 'div', children }: RevealProps) => {
  const Tag     = (as === 'li') ?(motion.li) :(motion.div);
  const hidden  = (x !== undefined) ?({ opacity: 0, x }) :({ opacity: 0, y: 24 });
  const visible = (x !== undefined) ?({ opacity: 1, x: 0 }) :({ opacity: 1, y: 0 });

  return (
    <Tag
      initial     = {false}
      animate     = {show ?(visible) :(hidden)}
      transition  = {show ?({ delay, duration: 0.6, ease: 'backInOut', type: 'spring', bounce: 0 }) :({ duration: 0 })}
    >
      {children}
    </Tag>
  );
};

export default AboutMeFace;
