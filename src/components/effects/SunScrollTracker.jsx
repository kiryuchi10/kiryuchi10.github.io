/**
 * Glowing sun that follows scroll progress (e.g. between About and Tech).
 * Fixed overlay; position updates as user scrolls up/down.
 */

import React from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export default function SunScrollTracker() {
  // Sun follows scroll between About and Tech (use about/tech for this layout; journey/skills for 3D landing)
const p = useScrollProgress('about', 'tech');

  const minY = typeof window !== 'undefined' ? window.innerHeight * 0.15 : 80;
  const maxY = typeof window !== 'undefined' ? window.innerHeight * 0.75 : 400;
  const y = minY + (maxY - minY) * p;

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[2]"
      style={{
        top: 0,
        transform: `translate(-50%, ${y}px)`,
      }}
      aria-hidden
    >
      <div
        className="h-11 w-11 rounded-full bg-yellow-300/90 shadow-[0_0_30px_rgba(255,212,0,0.8)]"
        style={{ width: 44, height: 44 }}
      />
    </div>
  );
}
