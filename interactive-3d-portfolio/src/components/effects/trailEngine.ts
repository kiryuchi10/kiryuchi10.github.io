export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  tw: number; // twinkle seed
};

export const MAX_PARTICLES = 1200;
export const EMIT_PER_MOVE = 4;
export const MOVE_THRESHOLD_PX = 3;

export function spawnParticles(
  out: Particle[],
  x: number,
  y: number,
  count: number,
  strength = 1
): void {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = (0.2 + Math.random() * 1.2) * strength;
    out.push({
      x,
      y,
      vx: Math.cos(a) * s + (Math.random() - 0.5) * 0.3,
      vy: Math.sin(a) * s + (Math.random() - 0.5) * 0.3,
      life: 0,
      maxLife: 40 + Math.random() * 30,
      size: 2 + Math.random() * 6,
      tw: Math.random() * 10_000,
    });
  }
}

export function stepParticles(p: Particle[]): void {
  const drag = 0.92;
  for (let i = p.length - 1; i >= 0; i--) {
    const s = p[i];
    s.life += 1;
    s.x += s.vx;
    s.y += s.vy;
    s.vx *= drag;
    s.vy *= drag;
    if (s.life >= s.maxLife) p.splice(i, 1);
  }
}
