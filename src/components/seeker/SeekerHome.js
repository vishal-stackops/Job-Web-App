import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SeekerNavbar from './SeekerNavbar';
import ThemeToggle from '../ThemeToggle';
import './SeekerHome.css';
import JobCard from './JobCard';
import { useProfileCheck } from '../../hooks/useProfileCheck';

function SeekerHome() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [success, setSuccess] = useState(location.state && location.state.success ? location.state.success : '');
  
  // Use the profile check hook
  const { isChecking } = useProfileCheck();

  useEffect(() => {
    if (location.state && location.state.success) {
      setSuccess(location.state.success);
      setTimeout(() => setSuccess(''), 2000);
      // Clean up state so message doesn't persist on next visit
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching jobs from:', 'http://localhost:8080/api/jobs');
        
        const response = await fetch('http://localhost:8080/api/jobs');
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const responseText = await response.text();
        console.log('Raw response:', responseText); // Debug: log the raw response
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response that failed to parse:', responseText);
          throw new Error(`Invalid JSON response: ${parseError.message}`);
        }
        
        console.log('Parsed jobs data:', data);
        
        // Handle both direct array and wrapped response
        if (Array.isArray(data)) {
          setJobs(data);
          setFilteredJobs(data);
        } else if (data.jobs && Array.isArray(data.jobs)) {
          // If response is wrapped in an object with 'jobs' property
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format received from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        
        if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
          setError('Backend server not running. Please start your Spring Boot application.');
        } else if (err.message.includes('500')) {
          setError('Server error: ' + err.message + '. Check your backend logs for details.');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    // Only fetch jobs if profile check is complete
    if (!isChecking) {
      fetchJobs();
    }
  }, [isChecking]);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = jobs.filter(job => {
      return job.title?.toLowerCase().includes(query);
    });
    
    setFilteredJobs(filtered);
  };

  // Show loading while checking profile
  if (isChecking) {
    return (
      <div className="seeker-gradient-bg">
        <SeekerNavbar onSearch={handleSearch} />
        <main className="seeker-home-content">
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            fontSize: '1.2rem',
            color: '#6366f1'
          }}>
            Checking profile...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="seeker-gradient-bg">
      <SeekerNavbar onSearch={handleSearch} />
      <main className="seeker-home-content">
        {success && (
          <div style={{
            color: '#22c55e',
            background: '#dcfce7',
            borderRadius: '8px',
            padding: '0.7rem 1rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {success}
          </div>
        )}
        <div className="jobs-section">
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              fontSize: '1.2rem',
              color: '#6366f1'
            }}>
              Loading jobs...
            </div>
          )}
          {error && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              fontSize: '1.2rem',
              color: '#ef4444',
              background: '#fee2e2',
              borderRadius: '8px',
              margin: '1rem'
            }}>
              Error: {error}
            </div>
          )}
          {!loading && !error && filteredJobs.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              fontSize: '1.2rem',
              color: '#6b7280'
            }}>
              {jobs.length === 0 ? 'No jobs found.' : 'No jobs found with that title.'}
            </div>
          )}
          {!loading && !error && filteredJobs.length > 0 && (
            <div className="jobs-list">
              {filteredJobs.map((job) => (
                <JobCard job={job} key={job.id} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SeekerHome;
