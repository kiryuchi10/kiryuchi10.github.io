import React, { useState } from 'react';
import { sections } from '../../config/routes';
import { basics } from '../../config/content';

export function Navbar(): React.ReactElement {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string): void => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="navbar-brand"
          onClick={() => scrollTo('home')}
          aria-label="Home"
        >
          {basics.fullName.split(' ')[0]}
        </button>
        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button type="button" onClick={() => scrollTo(id)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
