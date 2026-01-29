import React, { useEffect, useState } from 'react';
import { scrollToId } from '../utils/scrollToId';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { Link } from 'react-router-dom';

const SECTION_IDS = ['home', 'about', 'tech', 'works', 'contact'];
const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'tech', label: 'Tech' },
  { id: 'works', label: 'Works' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition ${
        scrolled ? 'bg-black/40 backdrop-blur border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollToId('home')}
          className="text-white/90 font-semibold tracking-wide hover:text-white"
        >
          Donghyeun Lee
        </button>
        <div className="hidden md:flex items-center gap-8 text-white/80">
          {LINKS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToId(id)}
              className={`hover:text-white transition ${activeId === id ? 'text-white font-medium' : ''}`}
            >
              {label}
            </button>
          ))}
          <Link to="/blog" className="hover:text-white transition">Blog</Link>
          <Link to="/resume" className="hover:text-white transition">Resume</Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button type="button" onClick={() => scrollToId('contact')} className="px-3 py-2 rounded-lg border border-white/15 text-white/80 text-sm">
            Menu
          </button>
          <Link to="/blog" className="text-white/80 text-sm">Blog</Link>
          <Link to="/resume" className="text-white/80 text-sm">Resume</Link>
        </div>
      </nav>
    </header>
  );
}
