'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { AnimationPlaybackControls, motion, MotionValue, useAnimate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LegendContainer from '../LegendContainer/LegendContainer';
import WireframeStep from './WireframeStep/WireframeStep';
import AgileTimelineStep from './AgileTimelineStep/AgileTimelineStep';
import FeatureShippingStep from './FeatureShippingStep/FeatureShippingStep';
import WordCycler from '@/components/elements/WordCycler/WordCycler';

interface Props{
  // Controlled mode (used by ProcessCube): scroll progress 0 to 1 across all steps drives the active step & bars
  progress      ?: MotionValue<number>;
  started       ?: boolean;                  // Controlled mode: show the card stack / start the word cycler
  onStepSelect  ?: (step: number) => void;   // Controlled mode: clicks ask the parent to scroll to a step
  onHoverChange ?: (hovered: boolean) => void; // Controlled mode: lets the parent pause its auto-play while the steps are hovered
}

interface ProcessStep {
  title     : string;
  caption   : string;
  duration  : number; // seconds the step stays up while auto-playing
  width     ?: string;
  content   : (active: boolean) => ReactNode;
}

// Words the title chip flips through before settling on the last one
const titleWords = ['Sketches', 'Spreadsheets', 'Problems', 'Workflows', 'Ideas'];

// How far up the screen the card stack must scroll before the slides start (share of screen height)
const startScreenOffset = '40%';

// Seconds to hold on the first step before auto-play begins, giving the title word cycler time to settle
const autoPlayStartDelay = 1;

// Wide cards size to the card stack (a CSS container), not the window, so they lay out correctly when the cube face scales them down
const wideCardWidth = 'min(815px, 100cqw)';

const processSteps: ProcessStep[] = [
  { title: 'Idea',
    caption: 'Every project/feature starts with a need and desire to fill it: who it\'s for and what problem it solves.',
    duration: 5,
    content: () => (
      <p style={{ textAlign: 'center', fontSize:'clamp(18px, 4.5vw, 24px)', padding:'0 1rem' }}>
        Develop and implement an interactive dashboard to fetch internal data for analysis
      </p>
    ),
  },
  { title: 'Wireframe',
    caption: 'Wireframe is sketched as proof of concept to ensure needs can be met before implementation.',
    duration: 5,
    content: (active) => <WireframeStep active={active} />,
  },
  { title: 'Agile Timeline',
    caption: 'To keep on-schedule, work is broken into tickets and shipped in short sprints, so progress is visible early.',
    duration: 7,
    width: wideCardWidth,
    content: (active) => <AgileTimelineStep active={active} />,
  },
  { title: 'Feature Shipping',
    caption: 'The finished Feature ships: a working dashboard built on real data. Try filtering it!',
    duration: 9,
    width: wideCardWidth,
    content: (active) => <FeatureShippingStep active={active} />,
  },
];

// Seconds each step stays up while auto-playing (also used by ProcessCube's scroll auto-play)
export const processStepDurations = processSteps.map((step) => step.duration);

// Card stack positions: upcoming cards wait below, past cards peek out behind the active one (darkened while hovered)
const getCardAnim = (index: number, active: number, hovered: boolean) => {
  if (index > active) return { opacity: 0, y: 225, scale: 0.75, filter: 'brightness(1)' };

  const depth = active - index;
  return { opacity: 1, y: depth * -22, scale: 1 - depth * 0.05, filter: (depth > 0 && hovered) ?('brightness(0.9)') :('brightness(1)') };
};

const IdeasToWebApps = ({
  progress,
  started: controlledStarted = false,
  onStepSelect,
  onHoverChange
}: Props) => {
  const isControlled                  = !!progress;
  const fallbackProgress              = useMotionValue(0);
  const stepsProgress                 = progress ?? fallbackProgress;
  const sectionRef                    = useRef<HTMLDivElement>(null);
  const inView                        = useInView(sectionRef, { amount: 0.4 });
  const stackRef                      = useRef<HTMLDivElement>(null);
  const stackReached                  = useInView(stackRef, { once: true, margin: `0px 0px -${startScreenOffset} 0px` });
  const reduceMotion                  = useReducedMotion();
  const [barScope, animateBar]        = useAnimate();
  const barControls                   = useRef<AnimationPlaybackControls | null>(null);
  const [active, setActive]           = useState(0);
  const [autoPlay, setAutoPlay]       = useState(true);
  const [started, setStarted]         = useState(false);
  const [hovered, setHovered]         = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const isAutoPlaying                 = autoPlay && !reduceMotion && !isControlled;
  const hasStarted                    = isControlled ?(controlledStarted) :(started);

  // Controlled: active step follows scroll progress
  const getStepFromProgress = (value: number) => Math.min(processSteps.length - 1, Math.max(0, Math.floor(value * processSteps.length)));
  useMotionValueEvent(stepsProgress, 'change', (value) => {
    if (isControlled) setActive(getStepFromProgress(value));
  });
  useEffect(() => {
    if (isControlled) setActive(getStepFromProgress(stepsProgress.get()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled]);

  // Start once the card stack has scrolled into the upper part of the screen
  useEffect(() => {
    if (stackReached) setStarted(true);
  }, [stackReached]);

  // Auto-play: fill the active step's bar, then move to the next step
  useEffect(() => {
    if (!started || !isAutoPlaying) return;

    let cancelled = false;
    const controls = animateBar(
      `[data-step-bar="${active}"]`,
      { scaleX: [0, 1] },
      { duration: processSteps[active].duration, ease: 'linear', delay: (active === 0) ?(autoPlayStartDelay) :(0) }
    );
    barControls.current = controls;

    controls.then(() => {
      if (cancelled) return;
      if (active < processSteps.length - 1) setActive(active + 1);
      else setAutoPlay(false);
    });

    return () => { cancelled = true; controls.stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, started, isAutoPlaying]);

  // Pause while hovered or scrolled away
  useEffect(() => {
    if (hovered || !inView) barControls.current?.pause();
    else barControls.current?.play();
  }, [hovered, inView]);

  // Any manual navigation hands control over to the user (controlled: parent scrolls to the step instead)
  const goToStep = (step: number) => {
    const target = Math.max(0, Math.min(processSteps.length - 1, step));
    if (isControlled) { onStepSelect?.(target); return; }

    setAutoPlay(false);
    setActive(target);
  };

  const getBarScale = (index: number) => {
    if (index < active) return 1;
    if (index > active) return 0;
    return isAutoPlaying ?(0) :(1);
  };

  return(<>
    <Box
      ref={sectionRef}
      sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '0 auto', gap: '25px', padding: '0 16px calc(4.5vh + 1rem)', width: '100%' }}
    >

      {/* Section Title */}
      <Box>
        <h4
          style={{
            textAlign:'center',
            letterSpacing: '2px',
            fontWeight: 'normal',
            fontSize:'clamp(22px, 5vw, 26px)'
          }}
        >
          I Turn <WordCycler words={titleWords} start={isControlled ?(controlledStarted) :(undefined)} /> into
        </h4>

        <h1
          style={{
            position:'relative',
            top:'-2px',
            textAlign: 'center',
            letterSpacing: '-2px',
            fontWeight: 'bold',
            fontSize: 'clamp(40px, 8vw, 60px)',
          }}
        >
          Achievable Web Apps
        </h1>
      </Box>

      <Box
        onMouseEnter={() => { setHovered(true); onHoverChange?.(true); }}
        onMouseLeave={() => { setHovered(false); onHoverChange?.(false); }}
        sx={{ display: 'grid', gap: '20px', width: '100%', maxWidth: '815px' }}
      >
        {/* Step Indicator */}
        <Box
          ref={barScope}
          role='tablist'
          aria-label='Process steps'
          sx={{ display: 'grid', gridTemplateColumns: `repeat(${processSteps.length}, 1fr)`, gap: 'clamp(8px, 2vw, 16px)' }}
        >
          {processSteps.map((step, i) => (
            <button
              key           = {step.title}
              type          = 'button'
              role          = 'tab'
              aria-selected = {i === active}
              onClick       = {() => goToStep(i)}
              style={{
                display: 'grid',
                gap: '8px',
                padding: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                color: '#242424',
                opacity: (i <= active) ?(1) :(0.55),
                transition: 'opacity 0.3s'
              }}
            >
              {/* Progress bar */}
              <span style={{ display: 'block', height: '6px', borderRadius: '25px', backgroundColor: 'var(--color-stone)', overflow: 'hidden' }}>
                {isControlled ?(
                  <ScrollStepBar progress={stepsProgress} index={i} />
                ) :(
                  <span
                    data-step-bar = {i}
                    style={{ ...barFillStyle, transform: `scaleX(${getBarScale(i)})` }}
                  />
                )}
              </span>

              <span style={{ fontSize: 'clamp(13px, 3.5vw, 18px)', fontWeight: (i === active) ?(700) :(400) }}>
                <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{String(i + 1).padStart(2, '0')}</span> {step.title}
              </span>
            </button>
          ))}
        </Box>

        {/* Caption & Controls */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '12px' }}>
          <button
            type        = 'button'
            aria-label  = 'Previous step'
            onClick     = {() => goToStep(active - 1)}
            disabled    = {active === 0}
            style       = {navButtonStyle(active === 0)}
          >
            <ArrowBackIcon fontSize='small' />
          </button>

          <motion.p
            key         = {active}
            aria-live   = 'polite'
            initial     = {{ opacity: 0, y: 6 }}
            animate     = {{ opacity: 1, y: 0 }}
            transition  = {{ duration: 0.4, ease: 'easeOut' }}
            style       = {{ textAlign: 'center', fontSize: 'clamp(15px, 3.8vw, 18px)' }}
          >
            {processSteps[active].caption}
          </motion.p>

          <button
            type        = 'button'
            aria-label  = 'Next step'
            onClick     = {() => goToStep(active + 1)}
            disabled    = {active === processSteps.length - 1}
            style       = {navButtonStyle(active === processSteps.length - 1)}
          >
            <ArrowForwardIcon fontSize='small' />
          </button>
        </Box>
      </Box>

      {/* Card Stack */}
      <Box
        ref={stackRef}
        sx={{
          display: 'grid',
          alignItems: 'start',
          justifyItems: 'center',
          width: '100%',
          containerType: 'inline-size', // Lets cards size with cqw units
          paddingTop: `${(processSteps.length - 1) * 22 + 10}px`
        }}
      >
        {processSteps.map((step, i) => (
          <motion.div
            key         = {step.title}
            initial     = {false}
            animate     = {getCardAnim(i, hasStarted ?(active) :(-1), hoveredCard === i)}
            transition  = {{ duration: 0.85, ease: 'easeInOut', type: 'spring', bounce: 0, filter: { duration: 0.2 } }}
            aria-hidden = {i !== active}

            // Past cards peeking out behind the active one darken on hover & go back to their step on click
            // (hover tracked in state rather than whileHover, which can stick when it's toggled off mid-hover)
            onMouseEnter = {() => setHoveredCard(i)}
            onMouseLeave = {() => setHoveredCard(null)}
            onClick     = {(i < active) ?(() => goToStep(i)) :(undefined)}
            title       = {(i < active) ?(`Back to ${step.title}`) :(undefined)}
            style={{
              gridColumn: 1,
              gridRow: 1,
              zIndex: i,
              transformOrigin: 'top center',
              pointerEvents: (i > active) ?('none') :('auto'),
              cursor: (i < active) ?('pointer') :('auto'),
              maxWidth: '100%'
            }}
          >
            <LegendContainer title={step.title} width={step.width} hideTitle={i < active}>
              {step.content(i === active)}
            </LegendContainer>
          </motion.div>
        ))}
      </Box>
    </Box>
  </>)
}

const barFillStyle = {
  display: 'block',
  height: '100%',
  backgroundColor: 'var(--color-navy)',
  borderRadius: '25px',
  transformOrigin: 'left',
};

// Controlled step bar: fills as its share of the scroll progress is covered
const ScrollStepBar = ({ progress, index }: { progress: MotionValue<number>, index: number }) => {
  const scaleX = useTransform(progress, (value) => Math.min(1, Math.max(0, value * processSteps.length - index)));

  return <motion.span style={{ ...barFillStyle, scaleX }} />;
};

const navButtonStyle = (disabled: boolean) => ({
  display: 'grid',
  placeItems: 'center',
  height: '40px',
  width: '40px',
  border: '3px solid #242424',
  borderRadius: '50%',
  backgroundColor: 'var(--color-cream)',
  color: '#242424',
  cursor: disabled ?('default') :('pointer'),
  opacity: disabled ?(0.3) :(1),
  transition: 'opacity 0.3s'
});

export default IdeasToWebApps;
