import { useEffect, useMemo, useState } from 'react';

type Options = {
  selector: string;
  paddingTop?: number;
  paddingBottom?: number;
};

export function useTimelineOrbPosition(options: Options): { top: number } {
  const { selector, paddingTop = 0, paddingBottom = 0 } = options;
  const [top, setTop] = useState(0);

  const compute = useMemo(() => {
    return (): void => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const travelled = vh - rect.top;
      const progress = Math.min(1, Math.max(0, travelled / total));
      const usableHeight = Math.max(0, rect.height - paddingTop - paddingBottom);
      const localTop = paddingTop + progress * usableHeight;
      setTop(localTop);
    };
  }, [selector, paddingTop, paddingBottom]);

  useEffect(() => {
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [compute]);

  return { top };
}
