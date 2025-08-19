import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import './SeekerHome.css';

function SeekerNavbar({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const seekerId = localStorage.getItem('seekerId');
  const profileUrl = seekerId ? `/seeker/profile/seeker/${seekerId}` : '/signin';
  const [searchQuery, setSearchQuery] = useState('');

  // Check if we're on the saved jobs page
  const isOnSavedJobsPage = location.pathname === '/seeker/saved';

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('seekerId');
    localStorage.removeItem('seekerName');
    localStorage.removeItem('recruiterId');
    localStorage.removeItem('recruiterName');
    navigate('/signin');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    // If search query is empty, show all jobs
    if (!e.target.value.trim()) {
      onSearch('');
    }
  };

  return (
    <nav className="navbar seeker-navbar">
      <div className="navbar-left">
        <span className="website-name">TalentHub</span>
      </div>
      <div className="navbar-center">
        <NavLink to="/seeker" className={({isActive}) => isActive ? 'seeker-link active' : 'seeker-link'}>Home</NavLink>
        <NavLink to="/seeker/applications" className={({isActive}) => isActive ? 'seeker-link active' : 'seeker-link'}>My Applications</NavLink>
        <NavLink to="/seeker/saved" className={({isActive}) => isActive ? 'seeker-link active' : 'seeker-link'}>Saved Jobs</NavLink>
      </div>
      {/* Hide search panel on saved jobs page */}
      {!isOnSavedJobsPage && (
        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-bar-wrapper">
              <input
                className="search-bar"
                type="text"
                placeholder="Search by job title..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button type="submit" className="search-icon-btn" title="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="navbar-right">
        <NavLink
          to={profileUrl}
          className={({ isActive }) => 'seeker-link profile-btn' + (isActive ? ' active' : '')}
        >
          Profile
        </NavLink>
        <ThemeToggle />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default SeekerNavbar; 