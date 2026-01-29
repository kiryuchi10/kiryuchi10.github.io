/**
 * Orb position that follows scroll: scroll down → orb moves down, scroll up → orb moves up.
 * Returns top (px) for a fixed-position orb so it tracks scroll direction.
 */

import { useEffect, useState } from 'react';

const DEFAULT_BASE_Y = 120;
const DEFAULT_SPEED = 0.35;
const MIN_Y = 80;
const MAX_Y_OFFSET = 0.85;

export function useScrollSunPosition(options = {}) {
  const {
    baseY = DEFAULT_BASE_Y,
    speed = DEFAULT_SPEED,
    minY = MIN_Y,
    maxYRatio = MAX_Y_OFFSET,
  } = options;

  const [top, setTop] = useState(baseY);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxY = typeof window !== 'undefined' ? window.innerHeight * maxYRatio : 600;
      const raw = baseY + scrollY * speed;
      const clamped = Math.max(minY, Math.min(maxY, raw));
      setTop(clamped);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [baseY, speed, minY, maxYRatio]);

  return { top };
}

export default useScrollSunPosition;
