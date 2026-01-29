import React from 'react';
import { basics } from '../../config/content';

export function Footer(): React.ReactElement {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {basics.fullName}
      </p>
      <p>
        <a href={basics.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {' · '}
        <a href={basics.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
