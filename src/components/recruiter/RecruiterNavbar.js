import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import './RecruiterHome.css';

function RecruiterNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('seekerId');
    localStorage.removeItem('seekerName');
    localStorage.removeItem('recruiterId');
    localStorage.removeItem('recruiterName');
    navigate('/signin');
  };

  return (
    <nav className="navbar recruiter-navbar">
      <div className="navbar-left">
        <span className="website-name">TalentHub</span>
      </div>
      <div className="navbar-center">
        <NavLink to="/recruiter" className={({isActive}) => isActive ? 'recruiter-link active' : 'recruiter-link'}>My Jobs</NavLink>
        <NavLink to="/recruiter/add" className={({isActive}) => isActive ? 'recruiter-link active' : 'recruiter-link'}>Add Job</NavLink>
        <NavLink to="/recruiter/applications" className={({isActive}) => isActive ? 'recruiter-link active' : 'recruiter-link'}>Applications</NavLink>
      </div>
      <div className="navbar-right">
        <NavLink to="/recruiter/profile" className={({isActive}) => isActive ? 'recruiter-link active' : 'recruiter-link'}>Profile</NavLink>
        <ThemeToggle />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default RecruiterNavbar; 