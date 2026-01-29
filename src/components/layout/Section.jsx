/**
 * Layout wrapper for one-page scroll sections.
 * Consistent padding, min-height, and id for scroll/spy.
 */

import React from 'react';

export default function Section({ id, children, className = '', minHeight = true }) {
  return (
    <section
      id={id}
      className={`relative z-[1] px-6 py-16 md:py-24 ${minHeight ? 'min-h-[80vh] md:min-h-screen' : ''} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
