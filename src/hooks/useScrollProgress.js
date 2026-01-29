/**
 * Scroll progress 0..1 between two section boundaries.
 * Used for SunScrollTracker (journey → skills).
 */

import { useEffect, useState } from 'react';

export function useScrollProgress(startElId, endElId) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const startEl = document.getElementById(startElId);
      const endEl = document.getElementById(endElId);
      if (!startEl || !endEl) return;

      const start = startEl.getBoundingClientRect().top + window.scrollY;
      const end = endEl.getBoundingClientRect().top + window.scrollY;
      const y = window.scrollY;
      const raw = (y - start) / Math.max(1, end - start);
      const clamped = Math.min(1, Math.max(0, raw));
      setP(clamped);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [startElId, endElId]);

  return p;
}

export default useScrollProgress;
