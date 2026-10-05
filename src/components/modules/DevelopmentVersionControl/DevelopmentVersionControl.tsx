'use client';

import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { TicketTypes } from '@/types/types';
import TicketContainer from '@/components/elements/TicketContainer/TicketContainer';
import Confetti from '@/components/elements/Confetti/Confetti';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import VersionControlTitle from './VersionControlTitle/VersionControlTitle';


interface Props{
  showTitle?: boolean; // ProcessCube shows the title on its last face, then this section continues below it
}

interface GraphTicket {
  num   : number;
  text  : string;
}

interface MainCommit {
  at      : number;
  side    : 'left' | 'right';
  ticket  : GraphTicket;
}

interface FeatureBranch {
  name      : string;
  color     : string;
  side      : 'left' | 'right';
  forkAt    : number;
  mergeAt   : number;
  commits   : number[];
  ticket    : GraphTicket;
}

// Packages picked up first, committed straight to main
const mainCommits: MainCommit[] = [
  { at: 0.04, side: 'left',  ticket: { num: 1, text: 'Drag & Drop Package' } },
  { at: 0.12, side: 'right', ticket: { num: 2, text: 'Charting Package' } },
];

// Feature branches: fork off main, collect commits, merge back (their ticket flips to completed on merge)
const featureBranches: FeatureBranch[] = [
  { 
    name: 'feature/fetch-data', 
    color: '#BF912E', 
    side: 'right', 
    forkAt: 0.18, 
    mergeAt: 0.48, 
    commits: [0.30, 0.39],       
    ticket: { num: 3, text: 'Fetch Data From Source' } },
  { 
    name: 'feature/dnd-layout', 
    color: '#00304B', 
    side: 'left', 
    forkAt: 0.27, 
    mergeAt: 0.72, 
    commits: [0.40, 0.52, 0.62], 
    ticket: { num: 4, text: 'Build Drag & Drop Layout' } },
  { 
    name: 'feature/charts',     
    color: '#525415', 
    side: 'right', 
    forkAt: 0.55, 
    mergeAt: 0.88, 
    commits: [0.67, 0.78],      
    ticket: { num: 5, text: 'Implement Charts in Layout' } 
  },
];

const ink           = '#242424';
const scrollLength  = 3;     // Section height in screen heights (pinned for scrollLength - 1 of them)
const drawEnd       = 0.9;   // Share of the section's scroll it takes to draw the whole graph (the rest holds on the Release)
const graphTop      = 72;    // px: where graph events start (below the NavBar). The main line itself starts at 0 to meet the cube.
const releaseSpace  = 175;   // px kept at the bottom for the Release card
const penLine       = 0.45;  // Share of the screen height where the head holds while the section scrolls in (it keeps drawing, no blank gap)

const DevelopmentVersionControl = ({ showTitle = true }: Props) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const stageRef      = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const clipId        = `vc-reveal-${useId().replace(/:/g, '')}`; // Unique per copy (the page repeats as you scroll)

  // 0 to 1 across the pinned section
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // 0 to 1 as the section scrolls in from the bottom of the screen (before it pins)
  const { scrollYProgress: entryProgress } = useScroll({ target: containerRef, offset: ['start end', 'start start'] });

  // Measure the stage so the graph's geometry fits the screen
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => setSize({ width: stage.clientWidth, height: stage.clientHeight }));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // ---- Geometry ----
  const mainX     = size.width / 2;
  const graphEnd  = Math.max(graphTop + 200, size.height - releaseSpace);
  const mainEnd   = graphEnd + 40;                                                  // Where main meets the Release badge
  const yAt       = (at: number) => graphTop + at * (graphEnd - graphTop);           // Fraction -> px
  const lane      = Math.min(150, Math.max(64, size.width * 0.12));                  // Distance from main to a feature lane
  const laneX     = (side: 'left' | 'right') => mainX + (side === 'right' ? lane : -lane);

  // The head: how far down the graph is revealed (everything reveals in sync with it)
  //  - scrolling in: the head holds at the pen line on screen, drawing the graph as it slides up past it
  //  - pinned: picks up from the pen line & draws the rest down to the Release
  const penStart  = Math.min(mainEnd, penLine * size.height);
  const headY     = useTransform(() => {
    const pinned  = scrollYProgress.get();
    const entry   = entryProgress.get();   // Both read every time so each stays subscribed

    if (pinned > 0) return penStart + Math.min(1, pinned / drawEnd) * (mainEnd - penStart);
    const stageTop = (1 - entry) * size.height;  // Where the stage's top sits on screen
    return Math.min(penStart, Math.max(0, penStart - stageTop));
  });
  const backdropOpacity = useTransform(entryProgress, [0.2, 0.8], [0, 1]);

  // Re-render only when the head passes a graph event (not on every scroll frame)
  const fractionOf = (y: number) => (y - graphTop) / (graphEnd - graphTop);
  const [reached, setReached] = useState(-1);
  const updateReached = (y: number) => {
    const fraction = Math.round(fractionOf(y) * 100) / 100;   // 1% steps
    setReached((prev) => (prev === fraction ?(prev) :(fraction)));
  };
  useMotionValueEvent(headY, 'change', updateReached);
  useEffect(() => { if (size.height) updateReached(headY.get()); }, [size.height]); // eslint-disable-line react-hooks/exhaustive-deps

  const isReached     = (at: number) => reached >= at;
  const releaseShown  = reached >= fractionOf(mainEnd) - 0.005;

  // Confetti each time the Release card springs in
  const [confettiBurst, setConfettiBurst] = useState(0);
  useEffect(() => { if (releaseShown) setConfettiBurst((burst) => burst + 1); }, [releaseShown]);

  return(<>
    {(showTitle) && (
      <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: 'clamp(45px, 8vh, 125px)' }}>
        <VersionControlTitle />
      </Box>
    )}

    <Box ref={containerRef} data-analytics-section='version_control' sx={{ position: 'relative', height: `${scrollLength * 100}vh` }}>
      <Box ref={stageRef} sx={{ position: 'sticky', top: 0, height: '100dvh', overflowX: 'clip', overflowY: 'visible' }}>{/* Clip sideways only, so the head isn't cut off at the top edge */}

        {/* Where the cube's branch connector lands (ProcessCube measures this element) */}
        <div id='center-branch-1' style={{ position: 'absolute', left: mainX - 3, top: 0, width: 6, height: 1 }} />

        {(size.width > 0) && (<>
          {/* Supergraphic backdrop: oversized type bleeding off the left edge (wide screens only) */}
          {(size.width >= 640) && (
            <motion.p
              aria-hidden = 'true'
              style       = {{
                position: 'absolute', left: 'clamp(-28px, -1.5vw, -8px)', bottom: releaseSpace - 40,
                writingMode: 'vertical-rl', rotate: 180,
                fontSize: 'clamp(90px, 15vh, 170px)', fontWeight: 800, letterSpacing: '-4px', lineHeight: 0.85, whiteSpace: 'nowrap',
                color: 'var(--color-stone)', opacity: backdropOpacity, pointerEvents: 'none', userSelect: 'none'
              }}
            >
              git log --graph
            </motion.p>
          )}

          <svg width={size.width} height={size.height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <defs>
              {/* Everything above the head is revealed; one clip keeps every line perfectly in sync */}
              <clipPath id={clipId}>
                <motion.rect x={0} y={0} width={size.width} height={headY} />
              </clipPath>
            </defs>

            {/* Lane rails: dashed "graph paper" guides for main & each feature lane, there before anything draws */}
            <motion.g stroke='var(--color-stone)' strokeWidth={3} strokeDasharray='2 12' strokeLinecap='round' style={{ opacity: backdropOpacity }}>
              <line x1={mainX} y1={0} x2={mainX} y2={mainEnd} />
              {(['left', 'right'] as const).map((side) => (
                <line key={`rail-${side}`} x1={laneX(side)} y1={graphTop} x2={laneX(side)} y2={graphEnd} />
              ))}
            </motion.g>

            <g clipPath={`url(#${clipId})`}>
              {/* Feature branches (behind main) */}
              {featureBranches.map((branch) => (
                <path
                  key             = {branch.name}
                  d               = {branchPath(mainX, laneX(branch.side), yAt(branch.forkAt), yAt(branch.mergeAt))}
                  stroke          = {branch.color}
                  strokeWidth     = {4}
                  strokeLinecap   = 'round'
                  fill            = 'none'
                />
              ))}

              {/* Main */}
              <line x1={mainX} y1={0} x2={mainX} y2={mainEnd} stroke='black' strokeWidth={5} strokeLinecap='round' />
            </g>

            {/* Commits on feature branches */}
            {featureBranches.flatMap((branch) => branch.commits.map((at) => (
              <CommitDot key={`${branch.name}-${at}`} x={laneX(branch.side)} y={yAt(at)} color={branch.color} shown={isReached(at)} />
            )))}

            {/* Commits on main: the package commits & each merge */}
            {mainCommits.map((commit) => (
              <CommitDot key={`main-${commit.at}`} x={mainX} y={yAt(commit.at)} color='black' shown={isReached(commit.at)} />
            ))}
            {featureBranches.map((branch) => (
              <CommitDot key={`merge-${branch.name}`} x={mainX} y={yAt(branch.mergeAt)} color={branch.color} shown={isReached(branch.mergeAt)} merge />
            ))}

            {/* Head */}
            <motion.circle cx={mainX} cy={headY} r={10.5} stroke='black' strokeWidth={7} fill='#F9F7F4' />
          </svg>

          {/* Branch names (skipped on narrow screens, where they'd run off the edge / into the tickets) */}
          {(size.width >= 640) && featureBranches.map((branch) => (
            <Tag stageWidth={size.width} key={`name-${branch.name}`} x={laneX(branch.side)} y={yAt(branch.forkAt) + 46} side={branch.side} shown={isReached(branch.forkAt + 0.03)}>
              <span style={{ display: 'inline-block', padding: '2px 8px', backgroundColor: 'var(--color-cream)', border: `2px solid ${ink}`, borderRadius: '6px', boxShadow: `3px 3px 0 ${branch.color}`, fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: '13px', fontWeight: 700, color: branch.color, whiteSpace: 'nowrap' }}>
                {branch.name}
              </span>
            </Tag>
          ))}

          {/* Tickets: package tickets beside main, feature tickets beside their branch */}
          {mainCommits.map((commit) => (
            <Tag stageWidth={size.width} key={`ticket-${commit.ticket.num}`} x={mainX} y={yAt(commit.at)} side={commit.side} shown={isReached(commit.at)}>
              <TicketContainer ticketNum={commit.ticket.num} text={commit.ticket.text} status='completed' size='sm' />
            </Tag>
          ))}
          {featureBranches.map((branch) => {
            const midY    = yAt(branch.forkAt + (branch.mergeAt - branch.forkAt) * 0.42);
            const status  : TicketTypes = isReached(branch.mergeAt) ?('completed') :('working on it');
            return (
              <Tag stageWidth={size.width} key={`ticket-${branch.ticket.num}`} x={laneX(branch.side)} y={midY} side={branch.side} shown={isReached(branch.forkAt + 0.06)}>
                <TicketContainer ticketNum={branch.ticket.num} text={branch.ticket.text} status={status} size='sm' accent={branch.color} />
              </Tag>
            );
          })}

          {/* Release confetti (bursts from the card's center) */}
          <Confetti burst={confettiBurst} x={mainX} y={mainEnd + 70} />

          {/* Release */}
          <motion.div
            initial     = {false}
            animate     = {releaseShown ?({ opacity: 1, y: 0, scale: 1 }) :({ opacity: 0, y: -40, scale: 0.75 })}
            transition  = {{ duration: 0.6, ease: 'backInOut', type: 'spring', bounce: 0.3 }}
            style       = {{ position: 'absolute', left: mainX, top: mainEnd + 6, x: '-50%' }}
          >
            {/* Styled like the site's cards: cream, ink border, paper backdrop. Reads like a git release tag */}
            <Box className='paper paper-plum' style={{ width: 'max-content', marginTop: '20px' }}>
              <Box sx={{ display: 'grid', justifyItems: 'center', gap: '6px', backgroundColor: 'var(--color-cream)', border: `4px solid ${ink}`, borderRadius: '12px', padding: '12px clamp(20px, 4vw, 36px) 14px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 style={{ margin: 0, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1, whiteSpace: 'nowrap', fontSize: 'clamp(30px, 5vw, 42px)', color: ink }}>
                    Release
                  </h2>

                  {/* Version tag */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px 4px 8px', borderRadius: '20px', backgroundColor: 'var(--color-navy)', color: 'white', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                    <LocalOfferRoundedIcon sx={{ fontSize: '15px' }} />
                    v1.0.0
                  </span>
                </Box>

                <p style={{ fontSize: '14px', letterSpacing: '1px', whiteSpace: 'nowrap', color: ink }}>
                  Shipped to production 🎉
                </p>
              </Box>
            </Box>
          </motion.div>
        </>)}
      </Box>
    </Box>
  </>)
};


// Fork off main with a smooth curve, run down the lane, curve back into main
const branchPath = (mainX: number, laneX: number, forkY: number, mergeY: number) => {
  const bend = Math.min(70, (mergeY - forkY) * 0.3);
  return [
    `M ${mainX} ${forkY}`,
    `C ${mainX} ${forkY + bend * 0.6}, ${laneX} ${forkY + bend * 0.4}, ${laneX} ${forkY + bend}`,
    `L ${laneX} ${mergeY - bend}`,
    `C ${laneX} ${mergeY - bend * 0.4}, ${mainX} ${mergeY - bend * 0.6}, ${mainX} ${mergeY}`,
  ].join(' ');
};

interface CommitDotProps{
  x       : number;
  y       : number;
  color   : string;
  shown   : boolean;
  merge   ?: boolean;  // Merge commits on main are a little bigger
}

const CommitDot = ({ x, y, color, shown, merge }: CommitDotProps) => (
  <motion.circle
    cx={x} cy={y} r={merge ?(9) :(7)}
    fill='#F9F7F4' stroke={color} strokeWidth={merge ?(5) :(4)}
    initial     = {false}
    animate     = {{ scale: shown ?(1) :(0) }}
    transition  = {{ type: 'spring', bounce: 0.5, duration: 0.45 }}
    style       = {{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }}
  />
);

interface TagProps{
  stageWidth: number;
  x         : number;
  y         : number;
  side      : 'left' | 'right';  // Which side of the point it sits on
  shown     : boolean;
  children  : ReactNode;
}

// HTML label pinned beside a point on the graph, sliding in from the graph's side
const Tag = ({ stageWidth, x, y, side, shown, children }: TagProps) => (
  <div
    style={{
      position: 'absolute', left: x, top: y,
      maxWidth: Math.max(60, (side === 'right') ?(stageWidth - x - 34) :(x - 34)), // Room on its side (text wraps instead of running off screen)
      transform: (side === 'right') ?('translate(22px, -50%)') :('translate(calc(-100% - 22px), -50%)')
    }}
  >
    <motion.div
      initial     = {false}
      animate     = {shown ?({ opacity: 1, x: 0 }) :({ opacity: 0, x: (side === 'right') ?(-16) :(16) })}
      transition  = {{ duration: 0.45, ease: 'easeOut' }}
      style       = {{ pointerEvents: shown ?('auto') :('none') }}
    >
      {children}
    </motion.div>
  </div>
);

export default DevelopmentVersionControl;
