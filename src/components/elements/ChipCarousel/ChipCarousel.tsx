import { useEffect, useState } from 'react';
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
  const [scrollSpeedMultiplier, setScrollSpeedMultiplier] = useState(1);
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


  // On scroll speed 
  useEffect(() => {
    const handleScroll = () => { setScrollSpeedMultiplier(1.5); };

    const handleScrollEnd = () => {
      setTimeout(() => { setScrollSpeedMultiplier(1); }, 300);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollEnd);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollEnd);
    };
  }, []);

  return (
    <div
      style={{ 
        display: 'flex',
        gap: '15px',
        flexDirection: 'column',
        overflow: 'hidden',
        maxWidth: '100vw'
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
          hovered     = {hovered}
          color       = {colors?.[rowIndex] || '#2d3e50'}
          itemGap     = {itemGap?.[rowIndex] || 10}
          scrollSpeedMultiplier = {scrollSpeedMultiplier}
        />
      ))}
    </div>
  );
};


export default ChipCarousel;
