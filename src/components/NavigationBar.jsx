import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', label: '🏠 Home' },
    { to: '/profile', label: '👤 Profile' },
    { to: '/resume', label: '📄 Resume' },
    { to: '/projects', label: '💻 Projects' },
    { to: '/contact', label: '✉️ Contact' },
  ];

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      <div className="hamburger" onClick={toggleSidebar}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <nav className={`sidebar ${open ? 'open' : ''}`}>
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

export default NavigationBar;
