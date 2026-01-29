/**
 * Smooth scroll to section by id.
 * Use for one-page scroll navbar (no router).
 */

export function scrollToId(id, options = {}) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: options.behavior ?? 'smooth',
      block: options.block ?? 'start',
      inline: options.inline ?? 'nearest',
    });
  }
}

export default scrollToId;
