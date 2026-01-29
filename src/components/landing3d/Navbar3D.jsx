import React, { useEffect, useState } from 'react';
import { navLinks } from '../../constants';
import { scrollToId } from '../../utils/scrollToId';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { getProfile } from '../../data/profile.config';

const sectionIds = navLinks.map((n) => n.id);

export default function Navbar3D() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(sectionIds);
  const profile = getProfile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, item) => {
    if (item.id.startsWith('http') || item.route) return;
    e.preventDefault();
    scrollToId(item.id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition">
      <div
        className={`mx-auto max-w-6xl px-6 py-4 flex items-center ${
          scrolled ? 'bg-black/30 backdrop-blur border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToId('home');
          }}
          className="text-white/90 font-semibold tracking-wide"
        >
          {profile?.basics?.fullName || 'Donghyeun Lee'}
        </a>

        <nav className="ml-auto hidden md:flex items-center gap-6 text-white/70">
          {navLinks.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => handleNavClick(e, n)}
              className={`hover:text-white transition ${activeId === n.id ? 'text-white font-medium' : ''}`}
            >
              {n.title}
            </a>
          ))}
          <a href="#/blog" className="hover:text-white transition">
            Blog
          </a>
          <a href="#/resume" className="hover:text-white transition">
            Resume
          </a>
        </nav>

        <div className="ml-auto md:hidden flex items-center gap-2">
          <a href="#projects" className="px-3 py-2 rounded-lg border border-white/15 text-white/80">
            Menu
          </a>
          <a href="#/blog" className="px-2 py-2 text-white/80">Blog</a>
          <a href="#/resume" className="px-2 py-2 text-white/80">Resume</a>
        </div>
      </div>
    </header>
  );
}
