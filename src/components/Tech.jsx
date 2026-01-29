import React from 'react';
import TechIcons from './TechIcons';

export default function Tech() {
  return (
    <section id="tech" className="relative z-[1] py-16 md:py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-white mb-8">Technical Expertise</h2>
        <TechIcons />
      </div>
    </section>
  );
}
