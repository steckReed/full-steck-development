'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { animate, motion, MotionValue, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import AboutMeFace from './AboutMeFace/AboutMeFace';
import VersionFace from './VersionFace/VersionFace';
import PixelCurtain from '@/components/elements/PixelCurtain/PixelCurtain';
import useNavbarTint from '@/hooks/useNavbarTint';
import IdeasToWebApps, { processStepDurations } from '../IdeasToWebApps/IdeasToWebApps';
import VersionControlTitle from '../DevelopmentVersionControl/VersionControlTitle/VersionControlTitle';
import { versionDrawEnd } from '../DevelopmentVersionControl/DevelopmentVersionControl';
import ScaleToFit from '@/components/elements/ScaleToFit/ScaleToFit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';

// Scroll distance (in screen heights) given to each part of the cube, in order
const segments = {
  introHold       : 0.4,  // Face 1: About Me (its entrance is timed, so this is just a short pause before the turn)
  rotateToProcess : 0.35, // Turn zone: entering it flips to face 2 (the flip itself is timed, not scrubbed)
  processLead     : 0,    // Scroll between face 2 arriving & step 1 starting (0 = the slides start right away)
  processSteps    : processStepDurations.length * 0.8, // Face 2: one equal block of scroll per step
  rotateToVersion : 0.35, // Turn zone: entering it flips to face 3
  versionHold     : 0.6,  // Face 3: Version Control title & the main branch starts growing, then the page scrolls on
};

const processStepCount = processStepDurations.length;

// Seconds a full face-to-face flip takes once triggered
const flipDuration = 0.9;

// Auto-play: scrolls the page whenever the visitor stops scrolling, as one run from face 2 to the Dashboard Playground
//  - face 2: through the steps, each at its own pace
//  - then flips to face 3 & carries on through the Version Control graph below, hard stopping at the playground
const autoPlayIdleMs      = 1200;  // How long after the visitor's last scroll / touch / key before auto-play resumes
const autoPlayEndGap      = 0.002; // Where the steps end, just short of the turn zone (auto-play jumps the turn zone itself)
const versionAutoPlayRate = 0.3;   // Face 3 onward: screen heights per second
const graphAutoPlayRate   = .5;   // Faster while the Version Control graph is pinned & drawing, until the Release shows
const flipPauseMs         = 1500;   // Brief hold as the cube flips to face 3, before scrolling on
const navBarHeight        = 48;    // The playground stops just below the NavBar

// Cube size: as wide as the content needs (capped by the screen), leaving room for the NavBar above
const cubeWidth   = 'min(calc(100vw - 64px), 880px)'; // 32px each side keeps the face dots clear of the cube
const cubeHeight  = 'calc(100dvh - 128px)'; // NavBar & gap (60px) + gap & control bar (52px) + bottom (16px)
const cubeDepth   = 'calc(var(--cube-w) / 2)';
const stagePaddingTop     = 60;
const stagePaddingBottom  = 16;
const controlBarSpace     = 52; // Control bar (40px) & its gap (12px), below the cube

// Pixel-curtain background behind the cube
const curtainColor      = '#CFCEB7';
const curtainCoverFrom  = 'bottom' as 'top' | 'bottom'; 

// Share of the face 1 animation that plays while the cube is still scrolling into view
const introEntryShare = 0.45;

// Turn the segment lengths into 0 to 1 progress breakpoints
const totalScroll = Object.values(segments).reduce((sum, length) => sum + length, 0);
const breakpoints = (() => {
  let at = 0;
  const mark = (length: number) => { at += length; return at / totalScroll; };
  return {
    introEnd          : mark(segments.introHold),
    processFaceStart  : mark(segments.rotateToProcess),
    stepsStart        : mark(segments.processLead),
    stepsEnd          : mark(segments.processSteps),
    versionFaceStart  : mark(segments.rotateToVersion),
  };
})();

// Where each face is in scroll progress (used by the face dots)
const faceTargets = [0, breakpoints.processFaceStart, breakpoints.versionFaceStart];
const faceLabels  = ['About Me', 'Achievable Web Apps', 'Version Control'];

const ProcessCube = () => {
  const reduceMotion  = useReducedMotion();
  const containerRef  = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const [currentFace, setCurrentFace]         = useState(0);
  const currentFaceRef  = useRef(0);
  const lastProgress    = useRef(0);
  const [processStarted, setProcessStarted]   = useState(false);
  const stepsHovered    = useRef(false);
  const pausedUntil     = useRef(0);
  const autoPlayStopped = useRef(true); // Off on face 1 until the visitor comes down onto face 2 (or presses Auto-play); set again when they pick a step or scroll back up
  const [autoPlayOn, setAutoPlayOn] = useState(false); // Mirrors autoPlayStopped for the Auto-play button
  const [controlsShown, setControlsShown] = useState(false); // From the cube pinning to the playground: shows the control bar & the run is live

  const setAutoPlay = (on: boolean) => {
    if (autoPlayStopped.current === !on) return;
    autoPlayStopped.current = !on;
    setAutoPlayOn(on);
  };

  // Cube rotation (right to left): animated to the current face, not scrubbed by scroll
  const rotateY = useMotionValue(0);

  useEffect(() => {
    const controls = animate(rotateY, currentFace * -90, { duration: flipDuration, ease: 'easeInOut' });
    return () => controls.stop();
  }, [currentFace, rotateY]);

  // Shrink a little mid-turn so the corner swinging toward the viewer stays on screen
  const cubeScale = useTransform(rotateY, (deg) => {
    const turn = Math.abs(deg % 90) / 90;
    return 1 - 0.12 * Math.sin(Math.PI * turn);
  });

  // Per-face progress
  // Face 1 builds partly while the cube scrolls into view (so it never arrives blank), then finishes while pinned
  const { scrollYProgress: entryProgress } = useScroll({ target: containerRef, offset: ['start end', 'start start'] });
  const introHoldProgress = useTransform(scrollYProgress, [0, breakpoints.introEnd], [0, 1]);
  const introProgress = useTransform(() => entryProgress.get() * introEntryShare + introHoldProgress.get() * (1 - introEntryShare));
  const stepsProgress = useTransform(scrollYProgress, [breakpoints.stepsStart, breakpoints.stepsEnd], [0, 1]);
  const versionHoldProgress = useTransform(scrollYProgress, [breakpoints.versionFaceStart, 1], [0, 1]);
  const curtainCover        = useTransform(entryProgress, [0.1, 0.95], [0, 1]);
  const curtainClear        = useTransform(versionHoldProgress, [0, 0.9], [0, 1]);

  // Match the NavBar to whatever's behind it: cream normally, the curtain color while this cube's stage sits under it
  useNavbarTint({ targetRef: containerRef, cover: curtainCover, clear: curtainClear, color: curtainColor, coverFrom: curtainCoverFrom });
  const versionBorderColor  = useTransform(versionHoldProgress, [0, 1], ['rgba(36, 36, 36, 1)', 'rgba(36, 36, 36, 0)']); // Face 3's box fades out while still pinned

  // After the cube unpins: 0 to 1 as it scrolls up off the screen (face 3's bottom opens & the branch continues out)
  const { scrollYProgress: exitProgress } = useScroll({ target: containerRef, offset: ['end end', 'end start'] });
  const [unpinned, setUnpinned] = useState(false);
  useMotionValueEvent(exitProgress, 'change', (value) => setUnpinned(value > 0));

  // Line face 3's branch up with the Version Control main branch rendered right after the cube
  // (its main branch runs down the sections center from its top edge; measured off the section itself, not anything on its
  //  sticky stage, whose rect shifts with scroll & only catches up to a resize after the section re-renders)
  const [branchGeometry, setBranchGeometry] = useState({ offsetX: 0, connectorLength: 0 });
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const section   = container?.nextElementSibling; // DevelopmentVersionControl
      if (!container || !section) return;

      const containerRect = container.getBoundingClientRect();
      const sectionRect   = section.getBoundingClientRect();
      setBranchGeometry({
        offsetX         : (sectionRect.left + sectionRect.width / 2) - (containerRect.left + containerRect.width / 2),
        connectorLength : Math.max(0, sectionRect.top - containerRect.bottom + stagePaddingBottom + controlBarSpace),
      });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [currentFace]);

  // Pick the face from scroll: holds decide outright, turn zones flip toward the direction of travel
  //  - scrolling down: entering a turn zone flips forward
  //  - scrolling up: leaving a turn zone (back past its start) flips back
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const goingDown = value > lastProgress.current;
    lastProgress.current = value;
    let face = currentFaceRef.current;

    if (value <= breakpoints.introEnd) face = 0;
    else if (value >= breakpoints.processFaceStart && value <= breakpoints.stepsEnd) face = 1;
    else if (value >= breakpoints.versionFaceStart) face = 2;
    else if (value < breakpoints.processFaceStart) face = (goingDown) ?(Math.max(face, 1)) :(face);  // First turn zone
    else face = (goingDown) ?(2) :(face);                                                           // Second turn zone


    // Scrolling up out of a turn zone lands back in the previous hold, handled by the hold checks above
    if (face !== currentFaceRef.current) {
      if (face === 1 && currentFaceRef.current === 0) setAutoPlay(true); // Coming down onto face 2 starts the auto-play run (scrolling back up into it doesn't)
      currentFaceRef.current = face;
      setCurrentFace(face);
      if (face >= 1) setProcessStarted(true);
    }
  });

  // Where the auto-play run hard stops: the Dashboard Playground (after the Version Control section) sitting just below the NavBar
  const getRunEndY = (el: HTMLElement) => {
    const playground = el.nextElementSibling?.nextElementSibling; // DevelopmentVersionControl, then DashboardPlayground
    if (!playground) return el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight; // No playground: stop as the cube unpins

    return playground.getBoundingClientRect().top + window.scrollY - navBarHeight;
  };

  // Where the Version Control graph is pinned & drawing: from its section reaching the top until the Release shows
  const getGraphRange = (el: HTMLElement) => {
    const section = el.nextElementSibling as HTMLElement | null; // DevelopmentVersionControl
    if (!section) return { start: Infinity, end: Infinity };

    const start = section.getBoundingClientRect().top + window.scrollY;
    return { start, end: start + versionDrawEnd * (section.offsetHeight - window.innerHeight) };
  };

  // Auto-play: from face 2 to the playground, while the visitor is idle, scroll on through
  //  - face 2: through each step at its own pace
  //  - on face 1 (only once the visitor presses Auto-play): skip straight to face 2's first step
  //  - finished the steps: jump the turn zone & hold briefly as the cube flips to face 3
  //  - face 3 onward: at a steady pace to the playground, speeding up while the Version Control graph is pinned & drawing
  useEffect(() => {
    if (reduceMotion) return;

    let lastInput = 0;
    const markInput = () => { lastInput = performance.now(); };
    const inputEvents = ['wheel', 'touchstart', 'touchmove', 'keydown'];
    inputEvents.forEach((name) => window.addEventListener(name, markInput, { passive: true }));

    // Visitor scrolling back up anywhere in the run turns auto-play off (ignoring the site's own smooth scrolls)
    // (watched on the window, since the cube's scroll progress stops changing once it unpins)
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      if (currentFaceRef.current >= 1 && window.scrollY < lastScrollY && performance.now() > pausedUntil.current) setAutoPlay(false);
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let frame: number;
    let prevTime: number | null = null;
    let targetY: number | null = null;   // Kept as a float so slow scrolling doesn't stall on whole-pixel rounding
    let shownControls = false;

    const tick = (time: number) => {
      const dt        = (prevTime === null) ?(0) :((time - prevTime) / 1000);
      prevTime        = time;
      const el        = containerRef.current;
      const progress  = scrollYProgress.get();
      const runEndY   = (el) ?(getRunEndY(el)) :(0);
      const beforeEnd = window.scrollY < runEndY - 1;
      const pinned    = !!el && el.getBoundingClientRect().top <= 1;   // Stage has reached the top (it stays pinned / scrolled past from here)
      const inRun     = pinned && beforeEnd;
      const idle      = time - lastInput > autoPlayIdleMs && time > pausedUntil.current && !autoPlayStopped.current && document.visibilityState === 'visible'
                        && !(stepsHovered.current && currentFaceRef.current === 1)  // Hovering face 2's steps
                        && document.body.style.overflow !== 'hidden';               // A modal (e.g. the NavBar QR code) has locked scrolling

      if (inRun !== shownControls) { shownControls = inRun; setControlsShown(inRun); }

      if (el && inRun && idle && dt > 0 && dt < 0.1) {
        const range     = el.offsetHeight - window.innerHeight;
        const top       = el.getBoundingClientRect().top + window.scrollY;
        const stepsEndY = top + (breakpoints.stepsEnd - autoPlayEndGap) * range;
        const versionY  = top + breakpoints.versionFaceStart * range;

        if (targetY === null || Math.abs(targetY - window.scrollY) > 2) targetY = window.scrollY;

        if (targetY < stepsEndY) {
          const stepLen = (breakpoints.stepsEnd - breakpoints.stepsStart) / processStepCount;
          const rate    = stepLen / processStepDurations[Math.min(processStepCount - 1, Math.max(0, Math.floor((progress - breakpoints.stepsStart) / stepLen)))];

          // Still before step 1 (e.g. idle in the turn zone): skip straight to it, so the slides start without a delay
          targetY = Math.max(targetY, top + breakpoints.stepsStart * range);
          targetY = Math.min(stepsEndY, targetY + rate * range * dt);
        } else if (targetY < versionY - 2) {
          // Finished the last step: jump the turn zone straight on to face 3, holding briefly as the cube flips
          // (2px slack: the browser rounds the jump down a fraction, which would otherwise read as still short of face 3 & jump / hold again forever)
          targetY = versionY;
          pausedUntil.current = time + flipPauseMs;
        } else {
          const graph   = getGraphRange(el);
          const onGraph = targetY >= graph.start && targetY < graph.end;
          targetY = Math.min(runEndY, targetY + ((onGraph) ?(graphAutoPlayRate) :(versionAutoPlayRate)) * window.innerHeight * dt);

          // Reached the playground: hard stop & hand scrolling back to the visitor
          if (targetY >= runEndY) setAutoPlay(false);
        }
        window.scrollTo({ top: targetY, behavior: 'instant' });
      } else {
        targetY = null;
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      inputEvents.forEach((name) => window.removeEventListener(name, markInput));
      window.removeEventListener('scroll', onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // Scroll the page so the cube lands at a given progress
  const scrollToProgress = (progress: number) => {
    const el = containerRef.current;
    if (!el) return;

    pausedUntil.current = performance.now() + 1000; // Let the smooth scroll finish before auto-play picks back up

    const top   = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + progress * range, behavior: 'smooth' });
  };

  // Visitor picked a step: stop auto-play & land at the end of that step's scroll block,
  // so their next scroll moves straight on to the following step (or flips the cube after the last one)
  const scrollToStep = (step: number) => {
    setAutoPlay(false);
    const stepEnd = (step + 0.98) / processStepCount;
    scrollToProgress(breakpoints.stepsStart + (breakpoints.stepsEnd - breakpoints.stepsStart) * stepEnd);
  };

  // Auto-play button: pauses / resumes the run from wherever the visitor is
  const toggleAutoPlay = () => setAutoPlay(!autoPlayOn);


  // Reduced motion: no cube, sections stack normally
  if (reduceMotion) {
    return <ReducedMotionStack />;
  }

  return(<>
    <Box ref={containerRef} data-analytics-section='process_cube' sx={{ position: 'relative', height: `${(totalScroll + 1) * 100}vh` }}>

      {/* Control Bar: fixed to the bottom (lined up under the cube), so it stays reachable through the whole run, */}
      {/* from the cube pinning down past the Version Control graph to the playground (kept outside the stage, whose perspective would trap it) */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 2,
          bottom: `${stagePaddingBottom}px`,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: (controlsShown) ?(1) :(0),
          transition: 'opacity 0.3s'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: cubeWidth, minHeight: `${controlBarSpace - 12}px` }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: 'clamp(13px, 3.5vw, 16px)', letterSpacing: '2px', color: '#242424' }}>
            Continue scrolling
            <KeyboardArrowDownIcon fontSize='small' />
          </p>

          {/* Auto-play (shown alongside Continue scrolling) */}
          <button
            type          = 'button'
            onClick       = {toggleAutoPlay}
            aria-pressed  = {autoPlayOn}
            tabIndex      = {(controlsShown) ?(0) :(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 14px 6px 10px',
              border: '3px solid #242424',
              borderRadius: '25px',
              backgroundColor: autoPlayOn ?('var(--color-navy)') :('var(--color-cream)'),
              color: autoPlayOn ?('white') :('#242424'),
              fontFamily: 'inherit',
              fontSize: 'clamp(13px, 3.5vw, 15px)',
              fontWeight: 600,
              letterSpacing: '1px',
              cursor: 'pointer',
              pointerEvents: (controlsShown) ?('auto') :('none'),
              transition: 'background-color 0.3s, color 0.3s'
            }}
          >
            {autoPlayOn ?(<PauseRoundedIcon fontSize='small' />) :(<PlayArrowRoundedIcon fontSize='small' />)}
            Auto-play
          </button>
        </Box>
      </Box>

      {/* Pinned stage */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          height: '100dvh',
          paddingTop: `${stagePaddingTop}px`,
          paddingBottom: `${stagePaddingBottom}px`,
          overflow: unpinned ?('visible') :('hidden'), // Let face 3's branch reach past the stage once it scrolls off
          perspective: '2000px',
          backgroundColor: 'var(--color-cream)',
          '--cube-w': cubeWidth,
          '--cube-h': cubeHeight,
        }}
      >
        {/* Pixel curtain background (behind everything on the stage) */}
        <PixelCurtain cover={curtainCover} clear={curtainClear} color={curtainColor} coverFrom={curtainCoverFrom} />

        {/* Pushed back half a face so the resting face sits flat at z = 0 */}
        {/* (wrappers ignore the pointer, otherwise they swallow clicks meant for the face in front; the active face re-enables it) */}
        <div style={{ position: 'relative', width: 'var(--cube-w)', height: 'var(--cube-h)', transformStyle: 'preserve-3d', transform: `translateZ(calc(${cubeDepth} * -1))`, pointerEvents: 'none' }}>
          <motion.div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', rotateY, scale: cubeScale, willChange: 'transform', pointerEvents: 'none' }}>

            {/* Face 1: About Me */}
            <CubeFace transform={`translateZ(${cubeDepth})`} active={currentFace === 0}>
              <AboutMeFace progress={introProgress} />
            </CubeFace>

            {/* Face 2: Achievable Web Apps */}
            <CubeFace transform={`rotateY(90deg) translateZ(${cubeDepth})`} active={currentFace === 1}>
              <ScaleToFit minLayoutWidth={560} padTop={24} fillWidth>
                <IdeasToWebApps
                  progress      = {stepsProgress}
                  started       = {processStarted}
                  onStepSelect  = {scrollToStep}
                  onHoverChange = {(hovered) => { stepsHovered.current = hovered; }}
                />
              </ScaleToFit>
            </CubeFace>

            {/* Face 3: Version Control */}
            <CubeFace transform={`rotateY(180deg) translateZ(${cubeDepth})`} active={currentFace === 2} borderColor={versionBorderColor}>
              <VersionFace
                holdProgress    = {versionHoldProgress}
                exitProgress    = {exitProgress}
                branchOffsetX   = {branchGeometry.offsetX}
                connectorLength = {branchGeometry.connectorLength}
              />
            </CubeFace>
          </motion.div>
        </div>

        {/* Room for the Control Bar (fixed above, it lines up over this spot while the stage is pinned) */}
        <Box aria-hidden='true' sx={{ flexShrink: 0, height: `${controlBarSpace - 12}px` }} />

        {/* Face Indicator */}
        <Box
          role='tablist'
          aria-label='Cube sections'
          sx={{ position: 'absolute', zIndex: 2, right: 'clamp(8px, 2vw, 24px)', top: '50%', transform: 'translateY(-50%)', display: 'grid', gap: '10px' }}
        >
          {faceTargets.map((target, i) => (
            <button
              key           = {faceLabels[i]}
              type          = 'button'
              role          = 'tab'
              aria-selected = {i === currentFace}
              aria-label    = {faceLabels[i]}
              title         = {faceLabels[i]}
              onClick       = {() => scrollToProgress(target)}
              style={{
                width: '14px',
                height: '14px',
                padding: 0,
                borderRadius: '50%',
                border: '3px solid #242424',
                backgroundColor: (i === currentFace) ?('var(--color-navy)') :('var(--color-cream)'),
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  </>)
}

interface CubeFaceProps{
  transform   : string;
  active      : boolean;
  borderColor ?: MotionValue<string>; // Lets a face fade its box outline (face 3 as it scrolls away)
  children    : ReactNode;
}

const faceStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'var(--color-cream)',
  border: '4px solid #242424',
  borderRadius: '16px',
  // No overflow: hidden here, inside the 3D cube it drops the face out of hit-testing (nothing on it is clickable)
  containerType: 'size', // Face content sizes itself off the face (cqw / cqh / cqmin), not the window
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

const CubeFace = ({ transform, active, borderColor, children }: CubeFaceProps) => (
  <motion.div
    aria-hidden = {!active}
    style       = {{ ...faceStyle, transform, pointerEvents: active ?('auto') :('none'), ...(borderColor && { borderColor }) }}
  >
    {children}
  </motion.div>
);

// Reduced motion fallback: the three faces as plain stacked sections
const ReducedMotionStack = () => {
  const fullProgress = useMotionValue(1);

  return(<>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5.5vh' }}>
      <Box sx={{ position: 'relative', height: '100vh', containerType: 'size' }}>
        <AboutMeFace progress={fullProgress} />
      </Box>

      <IdeasToWebApps />

      <VersionControlTitle />
    </Box>
  </>)
};

export default ProcessCube;
