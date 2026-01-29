import React from 'react';
import { VantaGlobeBackground } from '../components/background/VantaGlobeBackground';
import { CursorTrail } from '../components/effects';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../sections/HeroSection';
import { ResumeSection } from '../sections/ResumeSection';
import { JourneySection } from '../sections/JourneySection';
import { SkillsSection } from '../sections/SkillsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { BlogSection } from '../sections/BlogSection';
import { ContactSection } from '../sections/ContactSection';
import { AnalyticsSection } from '../sections/AnalyticsSection';
import { BuyMeACoffee } from '../components/BuyMeACoffee';
import { ChatAssistant } from '../components/chat/ChatAssistant';

export function HomePage(): React.ReactElement {
  return (
    <>
      {/* Layer 1: BACKGROUND */}
      <VantaGlobeBackground />

      {/* Layer 2: UI (Navbar, content, Footer, etc.) */}
      <div className="app-overlay">
        <Navbar />
        <main>
          <HeroSection />
          <ResumeSection />
          <JourneySection />
          <SkillsSection />
          <ProjectsSection />
          <BlogSection />
          <section className="support-section" aria-label="Support">
            <div className="support-inner">
              <h2 className="support-heading">Support My Work</h2>
              <p className="support-desc">
                If you like what you see and want to support my continued development of open-source
                projects
              </p>
              <BuyMeACoffee showFloating={false} showCard />
            </div>
          </section>
          <ContactSection />
          <AnalyticsSection />
        </main>
        <Footer />
        <BuyMeACoffee showFloating showCard={false} />
        <ChatAssistant />
      </div>

      {/* Layer 3: TOPMOST — cursor trail above everything */}
      <CursorTrail />
    </>
  );
}
