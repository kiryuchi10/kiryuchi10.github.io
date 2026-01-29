/**
 * Particle trail engine for cursor glitter / light-scattering effect.
 * Spawns particles at cursor; updates positions with drag; removes by lifetime.
 */

export const MAX_PARTICLES = 1200;
export const EMIT_PER_MOVE = 4;
export const MOVE_THRESHOLD_PX = 3;

/**
 * @typedef {Object} Particle
 * @property {number} x
 * @property {number} y
 * @property {number} vx
 * @property {number} vy
 * @property {number} life
 * @property {number} maxLife
 * @property {number} size
 * @property {number} tw - twinkle seed
 */

/**
 * Spawn new particles at (x, y).
 * @param {Particle[]} out - array to push into
 * @param {number} x - client X
 * @param {number} y - client Y
 * @param {number} count
 * @param {number} strength
 */
export function spawnParticles(out, x, y, count, strength = 1) {
  const cap = MAX_PARTICLES - out.length;
  const n = Math.min(count, Math.max(0, cap));
  for (let i = 0; i < n; i++) {
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

/**
 * Update all particles: integrate velocity, apply drag, remove dead.
 * @param {Particle[]} particles
 */
export function stepParticles(particles) {
  const drag = 0.92;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life += 1;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= drag;
    p.vy *= drag;
    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
    }
  }
}
