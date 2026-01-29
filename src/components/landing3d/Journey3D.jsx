import React from 'react';
import { motion } from 'framer-motion';
import { journeyItems } from '../../data/journey';

export default function Journey3D() {
  return (
    <section id="journey" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="min-h-[240px]" />

          <div className="space-y-12">
            {journeyItems.map((item, i) => (
              <motion.div
                key={item.id}
                className="text-white/90"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-white/30 text-sm mb-2">{item.period}</div>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-relaxed text-white/75">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="w-[2px] bg-white/10 h-full" />
      </div>
    </section>
  );
}
