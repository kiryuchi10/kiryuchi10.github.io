import type { Particle } from './trailEngine';

export function renderParticles(
  ctx: CanvasRenderingContext2D,
  p: Particle[],
  t: number,
  w: number,
  h: number
): void {
  ctx.save();

  // 1) Fade existing trail by reducing alpha (transparent erase, no black overlay)
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; // higher = faster fade, lower = longer trail
  ctx.fillRect(0, 0, w, h);

  // 2) Draw new particles additively (glow)
  ctx.globalCompositeOperation = 'lighter';

  for (const s of p) {
    const k = 1 - s.life / s.maxLife;
    const alpha = Math.max(0, k);

    const r = s.size * (1.2 + (1 - k) * 0.4);
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3.2);
    g.addColorStop(0, `rgba(180,120,255,${0.22 * alpha})`);
    g.addColorStop(0.3, `rgba(120,160,255,${0.14 * alpha})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r * 3.2, 0, Math.PI * 2);
    ctx.fill();

    const tw = 0.5 + 0.5 * Math.sin(t * 0.02 + s.tw);
    ctx.fillStyle = `rgba(255,255,255,${0.35 * alpha * tw})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, Math.max(0.7, r * 0.25), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
