/**
 * Canvas2D renderer for cursor glitter trail.
 * Uses additive blending (lighter) for light-scattering look.
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; tw: number }>} particles
 * @param {number} t - time (for twinkle)
 * @param {number} w - canvas width
 * @param {number} h - canvas height
 */
export function renderParticles(ctx, particles, t, w, h) {
  // Fade previous frame slightly -> trail persistence
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, w, h);

  // Additive light look
  ctx.globalCompositeOperation = 'lighter';

  for (const s of particles) {
    const k = 1 - s.life / s.maxLife;
    const alpha = Math.max(0, k);

    // Glow
    const r = s.size * (1.2 + (1 - k) * 0.4);
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3.2);
    g.addColorStop(0, `rgba(180,120,255,${0.22 * alpha})`);
    g.addColorStop(0.3, `rgba(120,160,255,${0.14 * alpha})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle dot (twinkle)
    const tw = 0.5 + 0.5 * Math.sin(t * 0.02 + s.tw);
    ctx.fillStyle = `rgba(255,255,255,${0.35 * alpha * tw})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, Math.max(0.7, r * 0.25), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
