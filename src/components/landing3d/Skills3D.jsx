import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/skills.config';

export default function Skills3D() {
  return (
    <section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-6"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '28px',
            marginTop: '32px',
          }}
        >
          {skills.map((s) => (
            <motion.div
              key={s.key}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '18px 10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
              }}
              whileHover={{ scale: 1.08, y: -4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <div
                className="flex items-center justify-center text-4xl"
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }}
              >
                <s.Icon style={{ fontSize: 44, color: s.color }} />
              </div>
              <div className="text-white/90 text-sm font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-5xl md:text-6xl text-white/30 font-extrabold">My Work</div>
      </div>
    </section>
  );
}
