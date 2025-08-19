import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Welcome.css';

function Welcome() {
  return (
    <div className="welcome-gradient-bg">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="website-name">TalentHub</span>
          </Link>
        </div>
        <div className="navbar-right">
          <ThemeToggle />
          <Link to="/signin"><button className="nav-btn signin">Sign In</button></Link>
          <Link to="/signup"><button className="nav-btn signup">Sign Up</button></Link>
        </div>
      </nav>
      <main className="welcome-section">
        <h1>Welcome to TalentHub</h1>
        <p>Your dream job is just a click away. Explore thousands of opportunities and take the next step in your career!</p>
        <Link to="/signup"><button className="get-started-btn">Get Started</button></Link>
      </main>
    </div>
  );
}

export default Welcome;