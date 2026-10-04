'use client'

import { ReactNode, useEffect, useRef, useState } from 'react';

interface Props{
  children        : ReactNode;
  minLayoutWidth  ?: number;  // Content is laid out at least this wide, then scaled down to fit narrower screens
  padTop          ?: number;  // Space kept clear at the top (fixed NavBar)
  padBottom       ?: number;
  padX            ?: number;
  fillWidth       ?: boolean; // When content is too tall, lay it out wider (text wraps less) so it fills more of the box once scaled
}

// Scales its content down (never up) so it fits entirely within the parent's box.
// Parent must be positioned and have a fixed size (e.g. a cube face).
const ScaleToFit = ({
  children,
  minLayoutWidth  = 0,
  padTop          = 56,
  padBottom       = 16,
  padX            = 16,
  fillWidth       = false,
}: Props) => {
  const outerRef  = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const [box, setBox]               = useState({ width: 0, height: 0 });
  const [contentHeight, setContentHeight] = useState(0);
  const [wideLayout, setWideLayout] = useState(0);  // fillWidth: widened layout width (0 = not widened)
  const fitPasses   = useRef(0);
  const bestFit     = useRef<{ width: number; scale: number } | null>(null);

  // Track the available box & the content's natural (unscaled) height
  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!outerRef.current || !innerRef.current) return;
      setBox({ width: outerRef.current.clientWidth, height: outerRef.current.clientHeight });
      setContentHeight(innerRef.current.offsetHeight);
    });

    observer.observe(outerRef.current);
    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  const availWidth    = Math.max(0, box.width - padX * 2);
  const availHeight   = Math.max(0, box.height - padTop - padBottom);
  const layoutWidth   = Math.max(availWidth, minLayoutWidth, wideLayout);
  const widthScale    = (layoutWidth > 0) ?(availWidth / layoutWidth) :(1);
  const heightScale   = (contentHeight > 0) ?(availHeight / contentHeight) :(1);
  const scale         = Math.min(1, widthScale, heightScale);
  const offsetY       = Math.max(0, (availHeight - contentHeight * scale) / 2);

  // New box size: start the fillWidth search over
  useEffect(() => {
    fitPasses.current = 0;
    bestFit.current   = null;
    setWideLayout(0);
  }, [box.width, box.height]);

  // fillWidth: content area stays roughly constant as it rewraps, so aim for the width that gives it the box's proportions.
  // A few passes refine it as the measured height updates.
  useEffect(() => {
    if (!fillWidth || !contentHeight || !availWidth || !availHeight || fitPasses.current >= 4) return;

    // Content with a max width stops getting shorter past it, so widening further only adds margin & shrinks it.
    // Keep the best fit found and go back to it once a wider layout stops helping.
    if (bestFit.current && scale < bestFit.current.scale - 0.005) {
      fitPasses.current = 4;
      setWideLayout((bestFit.current.width > Math.max(availWidth, minLayoutWidth)) ?(bestFit.current.width) :(0));
      return;
    }
    if (!bestFit.current || scale >= bestFit.current.scale) bestFit.current = { width: layoutWidth, scale };

    const ideal   = Math.sqrt(layoutWidth * contentHeight * (availWidth / availHeight));
    const target  = Math.min(Math.max(ideal, availWidth, minLayoutWidth), availWidth * 2);
    if (Math.abs(target - layoutWidth) / layoutWidth > 0.03) {
      fitPasses.current += 1;
      setWideLayout(target);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillWidth, contentHeight, availWidth, availHeight]);

  return(
    <div ref={outerRef} style={{ position: 'absolute', inset: 0 }}>
      <div
        ref={innerRef}
        style={{
          position: 'absolute',
          top: padTop + offsetY,
          left: '50%',
          width: layoutWidth || '100%',
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'top 0.45s ease, transform 0.45s ease', // Ease re-centering / re-scaling when the content's height changes
          visibility: (box.width > 0) ?('visible') :('hidden')
        }}
      >
        {children}
      </div>
    </div>
  )
};

export default ScaleToFit;
