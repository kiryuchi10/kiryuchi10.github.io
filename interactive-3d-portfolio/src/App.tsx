import React from 'react';
import { HomePage } from './pages/HomePage';
import './styles/globals.css';
import './styles/theme.css';
import './styles/components.css';

export default function App(): React.ReactElement {
  return (
    <div className="app">
      <HomePage />
    </div>
  );
}
