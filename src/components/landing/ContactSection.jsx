import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { socialLinks } from '../../data/portfolioData';
import ContactForm from '../ContactForm';

const contactInfo = [
  { title: 'Email', value: socialLinks.email, link: `mailto:${socialLinks.email}` },
  { title: 'Phone', value: `(${socialLinks.phone.slice(0, 3)}) ${socialLinks.phone.slice(3, 6)}-${socialLinks.phone.slice(6)}`, link: `tel:+1${socialLinks.phone}` },
  { title: 'Address', value: socialLinks.address, link: null },
  { title: 'LinkedIn', value: 'linkedin.com/in/dong-hyeun-lee-47a3b813a', link: socialLinks.linkedin },
  { title: 'GitHub (Portfolio)', value: 'github.com/kiryuchi10', link: socialLinks.github },
  { title: 'Blog', value: 'velog.io/@husuhaga10/posts', link: socialLinks.blog },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsla(173_80%_40%/0.1),transparent_70%)]" />
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Send a message or reach out via the links below.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="glass p-8 rounded-2xl text-center"
            >
              <h3 className="text-xl font-bold mb-3 text-foreground">{info.title}</h3>
              {info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {info.value}
                </a>
              ) : (
                <p className="text-muted-foreground">{info.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Have a <span className="text-primary">Question?</span>
          </h3>
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
