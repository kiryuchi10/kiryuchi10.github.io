import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

type VantaEffect = { destroy: () => void };

/**
 * Full-viewport VANTA.GLOBE background.
 * Options match vanilla usage: scale 1, min 200x200, mouse/touch on, gyro off.
 */
export function VantaGlobeBackground(): React.ReactElement {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let effect: VantaEffect | null = null;

    // UMD bundle expects THREE; pass it so we don't rely on window
    const initGlobe = (GLOBE: (opts: Record<string, unknown>) => VantaEffect) => {
      if (!elRef.current) return;
      effect = GLOBE({
        el: elRef.current,
        THREE,
        scale: 1.0,
        scaleMobile: 1.0,
        minWidth: 200.0,
        minHeight: 200.0,
        gyroControls: false,
        touchControls: true,
        mouseControls: true,
      });
    };

    // vanta UMD bundle has no types
    import('vanta/dist/vanta.globe.min.js' as string)
      .then((mod: { default?: (opts: Record<string, unknown>) => VantaEffect }) => {
        const GLOBE = mod.default ?? (mod as unknown as { GLOBE: (opts: Record<string, unknown>) => VantaEffect }).GLOBE;
        if (GLOBE && elRef.current) initGlobe(GLOBE);
      })
      .catch((err) => console.error('[VANTA.GLOBE] load failed', err));

    return () => {
      if (effect?.destroy) effect.destroy();
    };
  }, []);

  return (
    <div
      ref={elRef}
      className="vanta-globe-background"
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        minHeight: '100vh',
        minWidth: '100%',
      }}
    />
  );
}
