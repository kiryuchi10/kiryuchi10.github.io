import React, { useState } from 'react';
import { useScrollSunPosition } from '../../hooks/useScrollSunPosition';
import './SunMoonOrb.css';

/** Default orb GIF; when orb reaches bottom, switch to XDZT.gif */
const ORB_GIF = '/assets/DongHyeunLee/Project/GIF/7bk3%20(2).gif';
const ORB_GIF_BOTTOM = '/assets/DongHyeunLee/Project/GIF/XDZT.gif';

/**
 * Scroll-following sun/moon orb; moves down when scrolling down, up when scrolling up.
 * When orb reaches the bottom, image switches to XDZT.gif.
 */
export function SunMoonOrb(): React.ReactElement {
  const { top, atBottom } = useScrollSunPosition({ baseY: 100, speed: 0.4, minY: 60, maxYRatio: 0.88 });
  const [isMoon, setIsMoon] = useState(false);
  const orbGif = atBottom ? ORB_GIF_BOTTOM : ORB_GIF;

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
        style={{
          width: 72,
          height: 72,
          backgroundImage: `url(${orbGif})`,
        }}
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
