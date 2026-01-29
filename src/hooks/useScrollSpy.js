/**
 * Active section id based on scroll position (IntersectionObserver).
 * Use for navbar highlight.
 */

import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds, options = {}) {
  const { rootMargin = '-20% 0px -70% 0px', threshold = 0 } = options;
  const [activeId, setActiveId] = useState(sectionIds[0] || '');

  const idsKey = Array.isArray(sectionIds) ? sectionIds.join(',') : String(sectionIds);

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',').filter(Boolean) : [];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin, threshold }
    );

    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, [idsKey, rootMargin, threshold]);

  return activeId;
}

export default useScrollSpy;
