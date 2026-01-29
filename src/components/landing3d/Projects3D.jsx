import React from 'react';
import { projects } from '../../constants';
import { useTilt } from '../../hooks/useTilt';

function MeteorLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <span className="meteor" style={{ animationDelay: '0.2s', top: '12%', right: '-10%' }} />
      <span className="meteor" style={{ animationDelay: '1.6s', top: '35%', right: '-15%' }} />
      <span className="meteor" style={{ animationDelay: '2.9s', top: '60%', right: '-20%' }} />
      <span className="meteor" style={{ animationDelay: '4.2s', top: '78%', right: '-12%' }} />
    </div>
  );
}

function ProjectCard({ p }) {
  const tilt = useTilt(8);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="relative rounded-2xl border border-white/10 overflow-hidden
                 bg-gradient-to-br from-[#0b1220]/85 via-[#0b1b2f]/70 to-[#0b1220]/85
                 shadow-[0_0_40px_rgba(59,130,246,0.10)]
                 transition-transform duration-200"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <MeteorLayer />

      <div className="p-6" style={{ transform: 'translateZ(14px)' }}>
        <div className="text-xl font-semibold">{p.name}</div>
        <p className="mt-3 text-white/70 leading-relaxed">{p.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags?.map((t) => (
            <span key={t.name} className={`text-xs ${t.color}`}>
              #{t.name}
            </span>
          ))}
        </div>

        <a
          href={p.sourceCodeLink}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center w-full
                     py-3 rounded-xl border border-white/15
                     text-white/85 hover:text-white hover:bg-white/5 transition"
        >
          Explore More
        </a>
      </div>

      <div className="h-44 bg-black/30 border-t border-white/10">
        {/* Image is optional; if missing, keep a clean gradient block */}
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function Projects3D() {
  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

