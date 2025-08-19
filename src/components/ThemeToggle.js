import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}

export default ThemeToggle; 