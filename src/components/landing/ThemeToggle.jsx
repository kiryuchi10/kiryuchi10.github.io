import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      <motion.span
        initial={false}
        animate={{ scale: theme === 'dark' ? 1 : 0, rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        🌙
      </motion.span>
      <motion.span
        initial={false}
        animate={{ scale: theme === 'light' ? 1 : 0, rotate: theme === 'light' ? 0 : -180 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        ☀️
      </motion.span>
    </button>
  );
}
