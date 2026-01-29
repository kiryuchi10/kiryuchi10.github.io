import React from 'react';
import { motion } from 'framer-motion';
import { socialLinks } from '../../data/portfolioData';

/**
 * Floating “Open Source” badge.
 * Unique wording/shape to avoid looking copied.
 */
export default function OpenSourceBadge() {
  return (
    <motion.a
      href={socialLinks.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.6 }}
      className="fixed top-24 right-6 z-[60] hidden md:flex items-center gap-2 glass px-4 py-2 rounded-full border border-border shadow-lg hover:shadow-[0_20px_60px_-15px_hsla(217_91%_60%_/_0.35)] transition-shadow"
      aria-label="Open-source portfolio on GitHub"
    >
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 text-primary">
        <>
          {'</>'}
        </>
      </span>
      <span className="text-xs font-semibold tracking-wide text-foreground/90">
        OPEN SOURCE
      </span>
      <span className="text-xs text-muted-foreground">
        View code
      </span>
      <span className="text-primary text-sm">↗</span>
    </motion.a>
  );
}

