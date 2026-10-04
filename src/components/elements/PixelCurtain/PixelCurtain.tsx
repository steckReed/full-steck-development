'use client'

import { useEffect, useRef } from 'react';
import { MotionValue } from 'motion/react';

interface Props{
  cover     : MotionValue<number>;  // 0 to 1: pixels fill in
  clear     : MotionValue<number>;  // 0 to 1: pixels clear away, bottom rows first
  color     : string;
  coverFrom ?: 'top' | 'bottom';    // Which edge the fill starts from
}

const tileSize  = 44;   // px per pixel (before the screen's pixel ratio)
const spread    = 0.35; // How much randomness each pixel's timing gets (0 = a clean straight wipe)
const pop       = 0.06; // Share of the progress each pixel takes to grow from nothing to full size

// Stable "random" number per pixel so the pattern doesn't change between frames
const seeded = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Pixel-curtain background (in the style of a pixel page-transition), drawn on one canvas so hundreds of pixels stay cheap
const PixelCurtain = ({ cover, clear, color, coverFrom = 'top' }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let columns = 0;
    let rows    = 0;
    let frame   = 0;

    const draw = () => {
      frame = 0;
      const coverValue = cover.get();
      const clearValue = clear.get();
      const width      = canvas.width / devicePixelRatio;
      const height     = canvas.height / devicePixelRatio;

      context.clearRect(0, 0, width, height);
      if (coverValue <= 0 || clearValue >= 1) return;

      context.fillStyle = color;
      const tileW = width / columns;
      const tileH = height / rows;

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const i = row * columns + column;

          // When this pixel covers (from the coverFrom edge) & when it clears (bottom rows first)
          const coverRow = (coverFrom === 'top') ?(row) :(rows - 1 - row);
          const coverAt = (coverRow / rows) * (1 - spread - pop) + seeded(i, 1) * spread;
          const clearAt = ((rows - 1 - row) / rows) * (1 - spread - pop) + seeded(i, 2) * spread;

          const shown   = Math.min(1, Math.max(0, (coverValue - coverAt) / pop));
          const cleared = Math.min(1, Math.max(0, (clearValue - clearAt) / pop));
          const size    = shown * (1 - cleared);
          if (size <= 0) continue;

          // Full pixels snap to whole pixels with a 1px overlap, so neighbors join without hairline seams
          if (size >= 1) {
            const x = Math.floor(column * tileW);
            const y = Math.floor(row * tileH);
            context.fillRect(x, y, Math.ceil((column + 1) * tileW) - x + 1, Math.ceil((row + 1) * tileH) - y + 1);
            continue;
          }

          // Growing / shrinking pixels scale from the tile's center
          const w = tileW * size;
          const h = tileH * size;
          context.fillRect(column * tileW + (tileW - w) / 2, row * tileH + (tileH - h) / 2, w, h);
        }
      }
    };

    const requestDraw = () => { if (!frame) frame = requestAnimationFrame(draw); };

    // Match the canvas to its box (sharp on high-DPI screens) & recompute the grid
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width  = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      columns = Math.max(1, Math.round(width / tileSize));
      rows    = Math.max(1, Math.round(height / tileSize));
      requestDraw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const stopCover = cover.on('change', requestDraw);
    const stopClear = clear.on('change', requestDraw);

    return () => {
      observer.disconnect();
      stopCover();
      stopClear();
      cancelAnimationFrame(frame);
    };
  }, [cover, clear, color, coverFrom]);

  return (
    <canvas
      ref         = {canvasRef}
      aria-hidden = 'true'
      style       = {{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

export default PixelCurtain;
