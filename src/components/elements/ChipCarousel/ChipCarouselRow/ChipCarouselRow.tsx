import { useMotionValue, motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface ChipCarouselRowProps {
  screenWidth: number;
  skills: string[];
  direction: 'left' | 'right';
  baseSpeed: number;
  hovered: boolean;
  color: string;
  itemGap: number;
  scrollSpeedMultiplier: number;
}

const ChipCarouselRow: React.FC<ChipCarouselRowProps> = ({
  screenWidth,
  skills,
  direction,
  baseSpeed,
  hovered,
  color,
  itemGap,
  scrollSpeedMultiplier,
}) => {
  const [rowWidth, setRowWidth] = useState(screenWidth);
  const [numRepeats, setNumRepeats] = useState(1);
  const rowRef = useRef<HTMLDivElement>(null);
  const xTranslation = useMotionValue(-rowWidth);
  const positionFactor = (direction === 'left') ? (-1) : (1);
  const finalSpeed = hovered ? (baseSpeed / 2) : (baseSpeed * scrollSpeedMultiplier); // Based on hover/still/scroll

  // Get row width & determine how many times to repeat row len to fill screen
  useEffect(() => {
    const handleResize = () => {
      if (rowRef.current) {
        // const rowWidth = rowRef.current.getBoundingClientRect().width;
        const rowWidth = rowRef.current.offsetWidth;
        setRowWidth(rowWidth);

        const repeats = Math.ceil(screenWidth / rowWidth) + 1;
        setNumRepeats(repeats);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [screenWidth]);

  useEffect(() => {
    let animationFrameId: number;
    const finalPosition = rowWidth * positionFactor - itemGap;

    const updatePosition = () => {
      const current = xTranslation.get();
      const delta = positionFactor * finalSpeed * 0.1;
      let nextPosition = current + delta;

      // If at edge, loop back
      if (direction === 'left') {
        nextPosition = nextPosition <= finalPosition ?(nextPosition % finalPosition) : (nextPosition);
      } else {
        nextPosition = nextPosition >= 0 ?(((nextPosition % rowWidth) + rowWidth) % rowWidth - rowWidth) :(nextPosition);

      }

      xTranslation.set(nextPosition);
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updatePosition);

    // Cleanup function to cancel the animation frame when the component unmounts
    return () => cancelAnimationFrame(animationFrameId);
  }, [xTranslation, finalSpeed, rowWidth, direction, skills.length, positionFactor, itemGap]);

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div style={{ x: xTranslation, display: 'flex', gap: `${itemGap}px`, width: 'fit-content' }}>

        {/* Original ref */}
        <div ref={rowRef} style={{ display: 'flex', gap: `${itemGap}px` }}>
          {skills.map((skill, skillIndex) => (
            <div
              key={skillIndex}
              style={{
                backgroundColor: color,
                color: '#fff',
                whiteSpace: 'nowrap',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: 'bold',
                userSelect: 'none'
              }}
            >
              {skill}
            </div>
          ))}
        </div>

        {/* Additional loops if required */}
        {Array.from({ length: numRepeats }).map((_, repeatIndex) => (
          <div key={`r-${repeatIndex}`} style={{ display: 'flex', gap: `${itemGap}px` }}>
            {skills.map((skill, skillIndex) => (
              <div
                key={`r-${repeatIndex}-${skillIndex}`}
                style={{
                  backgroundColor: color,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  userSelect: 'none'
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        ))}

      </motion.div>
    </div>
  );
};


export default ChipCarouselRow;

