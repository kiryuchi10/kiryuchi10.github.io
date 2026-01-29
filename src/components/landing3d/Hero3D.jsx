import React, { useEffect, useState } from 'react';
import ComputersCanvas from '../canvas/ComputersCanvas';
import { useTypewriter } from '../../hooks/useTypewriter';
import { getProfile } from '../../data/profile.config';

export default function Hero3D() {
  const [isMobile, setIsMobile] = useState(false);
  const profile = getProfile();
  const home = profile?.home || {};
  const typed = useTypewriter({
    words: home.typedRoles || ['Technical Builder', 'R&D Engineer', 'AI Developer', 'Data-Driven Engineer'],
    speed: 70,
    pause: 900,
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const resumeHref = profile?.resume?.pdfUrl || '/resume/DONG_HYEUN_LEE_Resume_250603.pdf';

  return (
    <section id="home" className="min-h-[95vh] pt-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-white/30 text-5xl md:text-6xl font-extrabold leading-none select-none">
            {home.tagline || 'Wired for Innovation'}
          </div>

          <div className="mt-8 text-4xl md:text-5xl font-semibold">
            <span className="text-white/90">{home.headline || "I'm a "} </span>
            <span className="text-cyan-300">{typed}</span>
            <span className="caret" />
          </div>

          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-10 px-8 py-3 rounded-full font-semibold
                       bg-gradient-to-r from-purple-600 to-fuchsia-500
                       shadow-[0_0_30px_rgba(168,85,247,0.35)]
                       hover:opacity-95 transition"
          >
            {(home.ctaPrimary?.label || 'Download Resume').toUpperCase()}
          </a>
          {home.ctaSecondary?.scrollToId && (
            <a
              href={`#${home.ctaSecondary.scrollToId}`}
              className="ml-4 inline-flex mt-10 px-6 py-3 rounded-full font-semibold border border-white/20 text-white/90 hover:bg-white/10 transition"
            >
              {home.ctaSecondary?.label || 'View Projects'}
            </a>
          )}
        </div>

        <div className="w-full h-[360px] md:h-[520px]">
          {isMobile ? (
            <div className="w-full h-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
              <div className="text-white/70 text-sm px-6 text-center">
                3D preview is reduced on mobile for performance.
              </div>
            </div>
          ) : (
            <ComputersCanvas />
          )}
        </div>
      </div>
    </section>
  );
}
