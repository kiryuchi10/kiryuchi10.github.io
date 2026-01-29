import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  spawnParticles,
  stepParticles,
  MAX_PARTICLES,
  EMIT_PER_MOVE,
  MOVE_THRESHOLD_PX,
} from './trailEngine';
import { renderParticles } from './trailRenderer';

/**
 * Full-screen canvas overlay that draws a glittering / light-scattering trail
 * following the cursor. Respects prefers-reduced-motion and disables on touch devices.
 */
export default function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: typeof window !== 'undefined' ? window.innerWidth : 1920, h: typeof window !== 'undefined' ? window.innerHeight : 1080 });
  const [enabled, setEnabled] = useState(true);

  const emit = useCallback((x, y, burst = false) => {
    const particles = particlesRef.current;
    if (particles.length >= MAX_PARTICLES) return;
    const count = burst ? 20 : EMIT_PER_MOVE;
    const strength = burst ? 1.5 : 1;
    spawnParticles(particles, x, y, count, strength);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (e) => {
      const { clientX: x, clientY: y } = e;
      const last = lastRef.current;
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= MOVE_THRESHOLD_PX) {
        emit(x, y, false);
        lastRef.current = { x, y };
      }
    };

    const handlePointerDown = (e) => {
      emit(e.clientX, e.clientY, true);
    };

    const handlePointerLeave = () => {
      lastRef.current = { x: 0, y: 0 };
    };

    // Prefers reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setReduced = (e) => setEnabled(!e.matches);
    setReduced(reducedMotion);
    reducedMotion.addEventListener('change', setReduced);

    // Optional: disable trail on small viewport + touch to save perf (e.g. mobile)
    const isNarrowTouch =
      window.matchMedia('(max-width: 768px)').matches &&
      typeof navigator !== 'undefined' &&
      navigator.maxTouchPoints > 0;
    if (isNarrowTouch) setEnabled(false);

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    const loop = () => {
      timeRef.current += 1;
      const particles = particlesRef.current;
      stepParticles(particles);
      const ctx = canvas.getContext('2d');
      const { w, h } = sizeRef.current;
      if (ctx && enabled) {
        renderParticles(ctx, particles, timeRef.current, w, h);
      } else if (ctx && !enabled && particles.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(0, 0, sizeRef.current.w, sizeRef.current.h);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotion.removeEventListener('change', setReduced);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [emit, enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ left: 0, top: 0 }}
      aria-hidden
    />
  );
}
