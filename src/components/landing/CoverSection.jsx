/**
 * Full-screen Cover (epitaph-style) as the first view of the index page.
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function CoverSection() {
  return (
    <section
      id="cover"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-background via-background to-card/50 border-b border-border/50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="max-w-xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
          이동현
        </h1>
        <hr className="w-20 h-px border-0 bg-primary/60 mx-auto my-6" />
        <p className="text-xl md:text-2xl text-foreground/90 mb-2">
          &ldquo;코드는 사라져도, 논리는 영원하리.&rdquo;
        </p>
        <p className="text-sm md:text-base text-muted-foreground italic">
          – 마지막 커밋 메시지
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm"
      >
        Scroll to explore
      </motion.div>
    </section>
  );
}
