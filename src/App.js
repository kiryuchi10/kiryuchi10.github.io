import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/landing/ThemeContext';
import SimpleLayout from './components/landing/SimpleLayout';
import {
  About,
  Contact,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  SunMoonOrb,
} from './components';
import { CursorTrail } from './fx/cursor';
import Analytics from './components/Analytics';
import Blog from './components/Blog';
import Resume from './components/Resume';
import CollapsibleDevTools from './components/CollapsibleDevTools';
import { useVisitorTracking } from './hooks';

function App() {
  useVisitorTracking({
    trackOnMount: true,
    trackPageChanges: true,
    enableDebug: process.env.NODE_ENV === 'development',
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative z-0 bg-primary min-h-screen">
              {/* Full-viewport starfield (space background) */}
              <div className="fixed inset-0 -z-20 overflow-hidden">
                <StarsCanvas />
              </div>
              <SunMoonOrb />
              <div className="relative z-10 bg-hero-pattern bg-cover bg-no-repeat bg-center min-h-[60vh] md:min-h-[70vh]">
                <Navbar />
                <Hero />
              </div>
              <About />
              <Tech />
              <Works />
              <div className="relative z-10">
                <Contact />
              </div>
              {/* Cursor glitter / light-scattering trail (top overlay) */}
              <CursorTrail />
            </div>
          }
        />
        <Route path="/analytics" element={<SimpleLayout><Analytics /></SimpleLayout>} />
        <Route path="/blog" element={<SimpleLayout><Blog /></SimpleLayout>} />
        <Route path="/resume" element={<SimpleLayout><Resume /></SimpleLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CollapsibleDevTools showInProduction={false} />
    </ThemeProvider>
  );
}

export default App;
