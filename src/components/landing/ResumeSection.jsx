/**
 * Resume section on the index page – download CTA + link to full resume page.
 */
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalInfo } from '../../data/portfolioData';

export default function ResumeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="resume" className="py-20 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Resume</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Download my resume or view the full experience page.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass p-8 rounded-2xl max-w-2xl mx-auto text-center"
        >
          <p className="text-foreground/90 mb-6">
            Full Stack Developer · {personalInfo.projectsCompleted} projects · React, Flask, AI integration
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/resume/DONG_HYEUN_LEE_Resume_250603.pdf"
              download="Donghyeun_Lee_Resume.pdf"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              ⬇️ Download PDF
            </a>
            <a
              href="#/resume"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View full Resume page
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
