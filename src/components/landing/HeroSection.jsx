import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { personalInfo, roles, tagline, socialLinks } from '../../data/portfolioData';

export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const role = roles[currentIndex % roles.length];
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex <= role.length) {
        setDisplayedText(role.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 2000);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsla(173_80%_40%/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsla(217_91%_60%/0.15),transparent_50%)]" />

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-primary text-lg font-medium mb-4 block">{personalInfo.greeting}</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              I'm <span className="gradient-text">{personalInfo.displayName}</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-16 mb-8"
          >
            <h2 className="text-2xl md:text-4xl font-semibold text-primary">
              {displayedText}
              <span className="animate-pulse">|</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-2 mb-8"
          >
            <p className="text-xl md:text-2xl text-foreground/90">{tagline.primary}</p>
            <p className="text-lg md:text-xl text-muted-foreground">{tagline.secondary}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-muted-foreground text-foreground hover:bg-muted transition-colors"
            >
              GitHub
            </a>
            <a
              href={socialLinks.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              View CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-primary rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
