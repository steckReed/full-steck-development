'use client'

import { Fragment } from 'react';
import { motion, Variants } from 'motion/react';

interface Props{
  active: boolean;
}

// Same layout & colors as the original wireframe image (viewBox matches its 810 x 549 size)
const colors = {
  bar     : 'var(--color-mustard)',
  line    : 'var(--color-navy)',
  pie     : 'var(--color-rust)',
  scatter : 'var(--color-olive)',
};

const dotted = { strokeWidth: 5, strokeDasharray: '5 4', fill: 'none' };

const bars          = [{ x: 46, top: 70 }, { x: 100, top: 115 }, { x: 154, top: 46 }, { x: 208, top: 17 }];
const linePoints    = [[308, 325], [387, 216], [448, 250], [527, 183], [616, 213], [685, 103], [800, 16]];
const pieSlices     = [-90, 40, 160];   // Divider angles (degrees)
const scatterDots   = [[384, 481], [415, 409], [446, 471], [513, 389], [517, 513], [626, 467], [709, 435], [765, 379]];

// Pencil pass: a thin solid line traces the shape, then fades as the dotted version takes over
const sketch: Variants = {
  hidden  : { pathLength: 0, opacity: 1, transition: { duration: 0 } },
  shown   : (delay: number) => ({
    pathLength  : 1,
    opacity     : 0,
    transition  : { pathLength: { delay, duration: 0.6, ease: 'easeInOut' }, opacity: { delay: delay + 0.75, duration: 0.4 } },
  }),
};

const settle: Variants = {
  hidden  : { opacity: 0, transition: { duration: 0 } },
  shown   : (delay: number) => ({ opacity: 1, transition: { delay: delay + 0.5, duration: 0.4 } }),
};

const grow: Variants = {
  hidden  : { scaleY: 0, transition: { duration: 0 } },
  shown   : (delay: number) => ({ scaleY: 1, transition: { delay, type: 'spring', bounce: 0.35, duration: 0.7 } }),
};

const pop: Variants = {
  hidden  : { scale: 0, transition: { duration: 0 } },
  shown   : (delay: number) => ({ scale: 1, transition: { delay, type: 'spring', bounce: 0.5, duration: 0.5 } }),
};

// A panel outline: pencil trace + dotted outline
const Panel = ({ x, y, width, height, color, delay }: { x: number, y: number, width: number, height: number, color: string, delay: number }) => (<>
  <motion.rect x={x} y={y} width={width} height={height} rx={14} stroke={color} strokeWidth={2} fill='none' variants={sketch} custom={delay} />
  <motion.rect x={x} y={y} width={width} height={height} rx={14} stroke={color} {...dotted} variants={settle} custom={delay} />
</>);

const WireframeStep = ({ active }: Props) => {
  const linePath = `M${linePoints.map(([x, y]) => `${x} ${y}`).join(' L')}`;

  return(
    <motion.svg
      viewBox     = '0 0 810 549'
      role        = 'img'
      aria-label  = 'Wireframe of a dashboard with bar, line, pie, and scatter charts'
      initial     = 'hidden'
      animate     = {active ?('shown') :('hidden')}
      style       = {{ display: 'block', width: '100%', maxWidth: '415px', height: 'auto', margin: '2vh auto 1.25vh', overflow: 'visible' }}
    >
      {/* Bar chart */}
      <Panel x={3} y={3} width={283} height={193} color={colors.bar} delay={0} />
      {bars.map((bar, i) => (
        <motion.rect
          key         = {bar.x}
          x={bar.x} y={bar.top} width={32} height={186 - bar.top} rx={10}
          stroke={colors.bar} {...dotted}
          variants    = {grow}
          custom      = {0.6 + i * 0.12}
          style       = {{ transformBox: 'fill-box', originY: 1 }}
        />
      ))}

      {/* Line chart */}
      <Panel x={303} y={3} width={505} height={333} color={colors.line} delay={0.25} />
      <motion.path d={linePath} stroke={colors.line} strokeWidth={2} fill='none' strokeLinejoin='round' variants={sketch} custom={0.9} />
      <motion.path d={linePath} stroke={colors.line} {...dotted} strokeLinejoin='round' variants={settle} custom={0.9} />
      {linePoints.map(([x, y], i) => (
        <motion.circle
          key       = {x}
          cx={x} cy={y} r={9}
          fill='var(--color-cream)' stroke={colors.line} strokeWidth={4}
          variants  = {pop}
          custom    = {1 + i * 0.09}
          style     = {{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }}
        />
      ))}

      {/* Pie chart */}
      <Panel x={3} y={214} width={283} height={333} color={colors.pie} delay={0.45} />
      <motion.circle cx={145} cy={380} r={112} stroke={colors.pie} strokeWidth={2} fill='none' variants={sketch} custom={1.1} style={{ rotate: -90, transformBox: 'fill-box', originX: 0.5, originY: 0.5 }} />
      <motion.circle cx={145} cy={380} r={112} stroke={colors.pie} {...dotted} variants={settle} custom={1.1} />
      {pieSlices.map((angle, i) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <Fragment key={angle}>
            <motion.line
              x1={145} y1={380} x2={145 + 112 * Math.cos(radians)} y2={380 + 112 * Math.sin(radians)}
              stroke={colors.pie} strokeWidth={2}
              variants  = {sketch}
              custom    = {1.7 + i * 0.12}
            />
            <motion.line
              x1={145} y1={380} x2={145 + 112 * Math.cos(radians)} y2={380 + 112 * Math.sin(radians)}
              stroke={colors.pie} {...dotted}
              variants  = {settle}
              custom    = {1.7 + i * 0.12}
            />
          </Fragment>
        );
      })}

      {/* Scatter chart */}
      <Panel x={303} y={352} width={505} height={195} color={colors.scatter} delay={0.65} />
      {scatterDots.map(([x, y], i) => (
        <motion.circle
          key       = {`${x}-${y}`}
          cx={x} cy={y} r={9}
          stroke={colors.scatter} strokeWidth={4} strokeDasharray='3 3' fill='none'
          variants  = {pop}
          custom    = {1.3 + i * 0.1}
          style     = {{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }}
        />
      ))}
    </motion.svg>
  )
}

export default WireframeStep;
