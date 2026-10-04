'use client'

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface Props{
  burst   : number;     // Increment to fire a new burst (0 = nothing yet)
  x       : number;     // px: burst origin, relative to the positioned parent
  y       : number;
  count   ?: number;
  colors  ?: string[];
}

interface Piece {
  id        : string;
  color     : string;
  shape     : 'strip' | 'square' | 'dot';
  dx        : number;   // Horizontal travel
  rise      : number;   // How high it flies before falling
  fall      : number;   // How far below the peak it falls
  spin      : number;   // Degrees of tumble
  delay     : number;
  duration  : number;
}

// Site palette (+ ink)
const paletteColors = ['#BF912E', '#00304B', '#7D4156', '#A5501A', '#525415', '#4C4066', '#262215'];

const random = (min: number, max: number) => min + Math.random() * (max - min);

// A burst of confetti: pieces fly up & out, tumble, then fall with a gravity-like ease & fade
const Confetti = ({ burst, x, y, count = 40, colors = paletteColors }: Props) => {
  const reduceMotion = useReducedMotion();

  // New random pieces for each burst
  const pieces = useMemo<Piece[]>(() => {
    if (!burst) return [];
    return Array.from({ length: count }, (_, i) => {
      const angle = random(-165, -15) * (Math.PI / 180);  // Mostly upward
      const power = random(110, 300);
      return {
        id        : `${burst}-${i}`,
        color     : colors[i % colors.length],
        shape     : (['strip', 'square', 'dot'] as const)[i % 3],
        dx        : Math.cos(angle) * power,
        rise      : Math.sin(angle) * power,               // Negative = up
        fall      : random(160, 320),
        spin      : random(360, 900) * (Math.random() < 0.5 ? -1 : 1),
        delay     : random(0, 0.12),
        duration  : random(1.6, 2.4),
      };
    });
  }, [burst, count, colors]);

  if (reduceMotion || !pieces.length) return null;

  return (
    <div key={burst} aria-hidden='true' style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none', zIndex: 2 }}>
      {pieces.map((piece) => (
        <motion.span
          key         = {piece.id}
          initial     = {{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.6 }}
          animate     = {{
            x       : [0, piece.dx * 0.8, piece.dx],
            y       : [0, piece.rise, piece.rise + piece.fall],   // Up to the peak, then gravity takes over
            rotate  : [0, piece.spin * 0.5, piece.spin],
            opacity : [1, 1, 0],
            scale   : [0.6, 1, 1],
          }}
          transition  = {{
            duration  : piece.duration,
            delay     : piece.delay,
            times     : [0, 0.32, 1],
            ease      : ['easeOut', 'easeIn'],
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: (piece.shape === 'strip') ?(6) :(9),
            height: (piece.shape === 'strip') ?(14) :(9),
            marginLeft: -4,
            marginTop: -6,
            borderRadius: (piece.shape === 'dot') ?('50%') :('2px'),
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
