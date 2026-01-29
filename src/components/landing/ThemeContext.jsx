import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} });

export function ThemeProvider({ children, defaultTheme = 'dark', storageKey = 'portfolio-theme' }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return window.localStorage.getItem(storageKey) || defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    if (theme === 'light') root.classList.add('light');
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (e) {}
  }, [theme, storageKey]);

  const setTheme = (v) => setThemeState(typeof v === 'function' ? v(theme) : v);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
