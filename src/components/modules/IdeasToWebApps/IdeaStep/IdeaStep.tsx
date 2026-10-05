'use client'

import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

interface Props{
  active: boolean;
}

const idea = 'Develop and implement an interactive dashboard to fetch internal data for analysis';

// Seconds to wait after the card lands before typing starts
const startDelay = 0.4;

// The slip: "interac" is typed right, then "itv" sneaks in, gets noticed & backspaced, and "tive" is retyped
const typoAt  = idea.indexOf('interactive') + 'interac'.length;
const typo    = 'itv';

// Uneven, human gaps before each keystroke: varies per character, with longer pauses between words
// (repeatable rather than Math.random so the server & client agree)
const getTypingDelay = (char: string, i: number) => {
  const jitter = ((i * 37) % 11) / 11;
  return (char === ' ') ?(0.08 + jitter * 0.07) :(0.025 + jitter * 0.045);
};

// Every keystroke as the text it leaves on screen, plus the seconds since the previous keystroke
const buildKeystrokes = () => {
  const keystrokes = [{ text: '', delay: 0 }];
  const press = (text: string, delay: number) => keystrokes.push({ text, delay });
  const typed = () => keystrokes[keystrokes.length - 1].text;

  for (let i = 0; i < typoAt; i++) press(typed() + idea[i], getTypingDelay(idea[i], i));
  typo.split('').forEach((char, i) => press(typed() + char, getTypingDelay(char, typoAt + i)));
  typo.split('').forEach((_, i) => press(typed().slice(0, -1), (i === 0) ?(0.45) :(0.09))); // Notices the slip, then backspaces
  for (let i = typoAt; i < idea.length; i++) press(typed() + idea[i], getTypingDelay(idea[i], i) + ((i === typoAt) ?(0.2) :(0)));

  return keystrokes;
};

const keystrokes  = buildKeystrokes();
const keyTimes    = keystrokes.reduce<number[]>((times, { delay }, i) => [...times, (i === 0) ?(0) :(times[i - 1] + delay)], []);
const typingTime  = keyTimes[keyTimes.length - 2];

// Seconds from the step becoming active until the sentence is finished (lets the parent size the step's duration)
export const ideaTypingDuration = startDelay + typingTime;

const IdeaStep = ({ active }: Props) => {
  const reduceMotion  = useReducedMotion();
  const keystroke     = useMotionValue(0);
  const text          = useTransform(keystroke, (value) => keystrokes[Math.floor(value)].text);

  // Type the idea out each time the step becomes active, and clear it when it isn't
  useEffect(() => {
    if (reduceMotion) { keystroke.set(keystrokes.length - 1); return; }
    if (!active) { keystroke.set(0); return; }

    // Each keyframe is a keystroke index, hit at its own time (floored, so each keystroke holds until the next)
    const controls = animate(
      keystroke,
      keystrokes.map((_, i) => i),
      { duration: typingTime, times: keyTimes.map((time) => time / typingTime), ease: 'linear', delay: startDelay }
    );

    return () => controls.stop();
  }, [active, reduceMotion, keystroke]);

  return(
    <p
      aria-label  = {idea}
      style       = {{ display: 'grid', textAlign: 'center', fontSize:'clamp(18px, 4.5vw, 24px)', padding:'0 1rem' }}
    >
      {/* Invisible full sentence reserves the final height, so the card doesn't grow line by line while typing */}
      <span aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden' }}>{idea}</span>

      <span aria-hidden style={{ gridArea: '1 / 1' }}>
        <motion.span>{text}</motion.span>

        {/* Blinking cursor */}
        {!reduceMotion && (
          <motion.span
            animate     = {{ opacity: [1, 1, 0, 0] }}
            transition  = {{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            style       = {{ display: 'inline-block', width: '2px', height: '1em', marginLeft: '2px', verticalAlign: 'text-bottom', backgroundColor: 'currentColor' }}
          />
        )}
      </span>
    </p>
  );
};

export default IdeaStep;
