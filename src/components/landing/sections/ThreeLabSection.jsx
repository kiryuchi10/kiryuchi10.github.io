import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import InteractiveCard3D from '../../3D/InteractiveCard3D';
import ParticleSystem from '../../3D/ParticleSystem';

export default function ThreeLabSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="lab" className="py-20 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            3D <span className="gradient-text">Lab</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A small interactive playground showcasing my 3D + motion experiments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <InteractiveCard3D />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-2xl p-4"
          >
            <ParticleSystem height="500px" backgroundColor="transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

