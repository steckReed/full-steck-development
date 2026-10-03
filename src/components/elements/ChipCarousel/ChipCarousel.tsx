import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import ChipCarouselRow from './ChipCarouselRow/ChipCarouselRow';

interface ChipCarouselProps {
  rows        : Array<string[]>;
  directions  : Array<'left' | 'right'>;
  speeds      : Array<number>;
  colors      ?: Array<string>;
  itemGap     ?: Array<number>;
}

const ChipCarousel: React.FC<ChipCarouselProps> = ({ 
  rows, 
  directions, 
  speeds, 
  colors,
  itemGap
}) => {
  const [screenWidth, setScreenWidth]                     = useState(0);
  const [hovered, setHovered]                             = useState(false);
  const reduceMotion                                      = useReducedMotion();
  const getSpeedMultiplier = (width: number): number => {
    if (width < 640) return 0.25;
    if (width < 1024) return 0.28;
    return 0.31;
  };

  const screenWidthSpeedMultiplier = getSpeedMultiplier(screenWidth);

  // Set screenWidth
  useEffect(() => {
    setScreenWidth(window.innerWidth);

    // Function to update screen width on window resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div
      style={{ 
        display: 'flex',
        gap: '15px',
        flexDirection: 'column',
        overflow: 'hidden',
        maxWidth: '100%'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {rows.map((skills, rowIndex) => (
        <ChipCarouselRow
          screenWidth = {screenWidth}
          key         = {rowIndex}
          skills      = {skills}
          direction   = {directions[rowIndex]}
          baseSpeed   = {speeds[rowIndex] * screenWidthSpeedMultiplier}
          paused      = {hovered || !!reduceMotion}
          color       = {colors?.[rowIndex] || '#2d3e50'}
          itemGap     = {itemGap?.[rowIndex] || 10}
        />
      ))}
    </div>
  );
};


export default ChipCarousel;
