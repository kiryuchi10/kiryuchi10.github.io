import React, { useRef, useEffect, useCallback } from 'react';
import {
  spawnParticles,
  stepParticles,
  MAX_PARTICLES,
  EMIT_PER_MOVE,
  MOVE_THRESHOLD_PX,
  type Particle,
} from './trailEngine';
import { renderParticles } from './trailRenderer';

/**
 * Full-screen canvas overlay that draws a glittering trail following the cursor.
 * Always active site-wide.
 */
export default function CursorTrail(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const timeRef = useRef(0);

  const dprRef = useRef(1);
  const sizeRef = useRef({ w: 1920, h: 1080 });

  const emit = useCallback((x: number, y: number, burst = false) => {
    const particles = particlesRef.current;

    // Hard cap protection (drop oldest)
    if (particles.length > MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES);
    }

    const count = burst ? 20 : EMIT_PER_MOVE;
    const strength = burst ? 1.5 : 1;
    spawnParticles(particles, x, y, count, strength);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      dprRef.current = dpr;

      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (e: PointerEvent): void => {
      const x = e.clientX;
      const y = e.clientY;

      const last = lastRef.current;
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);

      if (dist >= MOVE_THRESHOLD_PX) {
        emit(x, y, false);
        lastRef.current = { x, y };
      }
    };

    const handlePointerDown = (e: PointerEvent): void => {
      emit(e.clientX, e.clientY, true);
    };

    const handleMouseLeaveWindow = (): void => {
      // Reset tracking so next entry doesn't emit a long streak
      lastRef.current = { x: -9999, y: -9999 };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeaveWindow);

    const tick = (): void => {
      timeRef.current += 1;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { w, h } = sizeRef.current;
        stepParticles(particlesRef.current);
        renderParticles(ctx, particlesRef.current, timeRef.current, w, h);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('mouseleave', handleMouseLeaveWindow);
      cancelAnimationFrame(rafRef.current);
    };
  }, [emit]);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-trail-canvas fixed inset-0 pointer-events-none z-[9999]"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
      aria-hidden
    />
  );
}
