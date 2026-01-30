import { useEffect, useState } from 'react';

const DEFAULT_BASE_Y = 120;
const DEFAULT_SPEED = 0.35;
const MIN_Y = 80;
const MAX_Y_OFFSET = 0.85;

type Options = {
  baseY?: number;
  speed?: number;
  minY?: number;
  maxYRatio?: number;
};

export function useScrollSunPosition(options: Options = {}): { top: number; atBottom: boolean } {
  const {
    baseY = DEFAULT_BASE_Y,
    speed = DEFAULT_SPEED,
    minY = MIN_Y,
    maxYRatio = MAX_Y_OFFSET,
  } = options;

  const [top, setTop] = useState(baseY);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      const maxY = typeof window !== 'undefined' ? window.innerHeight * maxYRatio : 600;
      const raw = baseY + window.scrollY * speed;
      const clamped = Math.max(minY, Math.min(maxY, raw));
      setTop(clamped);
      setAtBottom(clamped >= maxY - 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [baseY, speed, minY, maxYRatio]);

  return { top, atBottom };
}
