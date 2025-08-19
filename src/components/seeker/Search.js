import React from 'react';
import './Search.css';
import SeekerNavbar from './SeekerNavbar';
import { useProfileCheck } from '../../hooks/useProfileCheck';

function Search() {
  // Use the profile check hook
  const { isChecking } = useProfileCheck();

  // Show loading while checking profile
  if (isChecking) {
    return (
      <div className="search-gradient-bg">
        <SeekerNavbar />
        <div className="search-page-center">
          <div className="search-content">
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              fontSize: '1.2rem',
              color: '#6366f1'
            }}>
              Checking profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-gradient-bg">
      <SeekerNavbar />
      <div className="search-page-center">
        <div className="search-content">
          <h2 className="search-heading">Find Your Dream Job</h2>
          <div className="search-bar-wrapper">
            <input
              className="search-bar"
              type="text"
              placeholder="Search for jobs, companies, skills..."
            />
            <button className="search-icon-btn" title="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search; 