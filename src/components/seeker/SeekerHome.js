import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SeekerNavbar from './SeekerNavbar';
import ThemeToggle from '../ThemeToggle';
import './SeekerHome.css';
import JobCard from './JobCard';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function SeekerHome() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [success, setSuccess] = useState(
    location.state && location.state.success ? location.state.success : ''
  );

  //const { isChecking } = useProfileCheck();

  useEffect(() => {
    if (location.state && location.state.success) {
      setSuccess(location.state.success);
      setTimeout(() => setSuccess(''), 2000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching jobs from:', `${API_BASE_URL}/api/jobs`);

        // fetch → axios
        const response = await axios.get(`${API_BASE_URL}/api/jobs`, {
          withCredentials: true
        });

        console.log('Parsed jobs data:', response.data);

        const data = response.data;

        // SAME logic as before
        if (Array.isArray(data)) {
          setJobs(data);
          setFilteredJobs(data);
        } else if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format received from server');
        }

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);

        if (
          err.message?.includes('Failed to fetch') ||
          err.code === 'ERR_NETWORK'
        ) {
          setError('Backend server not running. Please start your Spring Boot application.');
        } else if (err.response?.status === 500) {
          setError('Server error: 500. Check backend logs.');
        } else {
          setError(err.response?.data?.message || err.message);
        }

        setLoading(false);
      }
    };

    fetchJobs();
    // if (!isChecking) {
    //   fetchJobs();
    // }
  }, []);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = jobs.filter(job =>
      job.title?.toLowerCase().includes(query)
    );

    setFilteredJobs(filtered);
  };

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
