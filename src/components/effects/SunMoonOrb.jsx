/**
 * Scroll-following sun/moon: moves down when scrolling down, up when scrolling up.
 * Toggle to switch between sun (glowing yellow) and moon (soft gray/blue).
 */

import React, { useState } from 'react';
import { useScrollSunPosition } from '../../hooks/useScrollSunPosition';
import './SunMoonOrb.css';

export default function SunMoonOrb() {
  const { top } = useScrollSunPosition({ baseY: 100, speed: 0.4, minY: 60, maxYRatio: 0.88 });
  const [isMoon, setIsMoon] = useState(false);

  return (
    <div
      className="sun-moon-orb-wrap pointer-events-none fixed left-1/2 z-[5]"
      style={{
        top: 0,
        transform: `translate(-50%, ${top}px)`,
      }}
      aria-hidden
    >
      <div
        className={`sun-moon-orb ${isMoon ? 'sun-moon-orb--moon' : 'sun-moon-orb--sun'}`}
        style={{ width: 72, height: 72 }}
      />
      <button
        type="button"
        className="sun-moon-toggle pointer-events-auto"
        onClick={() => setIsMoon((m) => !m)}
        title={isMoon ? 'Switch to sun' : 'Switch to moon'}
        aria-label={isMoon ? 'Switch to sun' : 'Switch to moon'}
      >
        {isMoon ? (
          <span className="sun-moon-icon" aria-hidden>☀️</span>
        ) : (
          <span className="sun-moon-icon" aria-hidden>🌙</span>
        )}
      </button>
    </div>
  );
}
