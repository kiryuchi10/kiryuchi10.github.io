import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { personalInfo } from '../../data/portfolioData';

export default function SimpleLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 glass py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold gradient-text">
            {personalInfo.displayName}
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
