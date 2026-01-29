import React from 'react';
import StarsCanvas from '../components/canvas/StarsCanvas';
import SunScrollTracker from '../components/effects/SunScrollTracker';
import Navbar3D from '../components/landing3d/Navbar3D';
import Hero3D from '../components/landing3d/Hero3D';
import Journey3D from '../components/landing3d/Journey3D';
import Skills3D from '../components/landing3d/Skills3D';
import Projects3D from '../components/landing3d/Projects3D';
import Contact3D from '../components/landing3d/Contact3D';

/**
 * One-page scroll portfolio: Starfield + Sun + Navbar + sections.
 * Routes (/blog, /resume, /analytics) are in App.js.
 */
export default function IndexPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <StarsCanvas />
      <SunScrollTracker />
      <Navbar3D />
      <main className="relative z-[1]">
        <Hero3D />
        <Journey3D />
        <Skills3D />
        <Projects3D />
        <Contact3D />
      </main>
    </div>
  );
}
