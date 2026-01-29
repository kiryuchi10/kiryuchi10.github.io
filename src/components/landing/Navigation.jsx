import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { personalInfo } from '../../data/portfolioData';

const navItems = [
  { id: 'cover', label: 'Cover' },
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'lab', label: '3D Lab' },
  { id: 'resume', label: 'Resume' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
  { id: 'analytics', label: 'Analytics', href: '/analytics' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['cover', 'home', 'about', 'lab', 'resume', 'projects', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="#cover" className="text-xl font-bold gradient-text">
            {personalInfo.displayName}
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.href ? (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-sm font-medium transition-colors text-foreground/70 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm font-medium transition-colors relative ${
                    activeSection === item.id ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
