import React, { useState, useEffect } from 'react';
import SeekerNavbar from './SeekerNavbar';
import axios from 'axios';
import './MyApplications.css';
import { useProfileCheck } from '../../hooks/useProfileCheck';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  
  // Use the profile check hook
  const { isChecking, seekerId } = useProfileCheck();

  useEffect(() => {
    if (!isChecking && seekerId) {
      loadApplications(seekerId);
    }
  }, [isChecking, seekerId]);

  const loadApplications = async (seekerId) => {
    try {
      console.log('Fetching applications for seeker:', seekerId);
      const response = await axios.get(`http://localhost:8080/api/applications/seeker/${seekerId}`, { 
        withCredentials: true 
      });
      console.log('Applications response:', response.data);
      
      // Check if the response contains job data
      if (response.data && response.data.length > 0) {
        console.log('First application:', response.data[0]);
        console.log('First application job data:', response.data[0].job);
        console.log('Job title:', response.data[0].job?.title);
        console.log('Job company:', response.data[0].job?.company);
        console.log('Job location:', response.data[0].job?.location);
      }
      
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading applications:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'ACCEPTED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      case 'WITHDRAWN': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Under Review';
      case 'ACCEPTED': return 'Accepted';
      case 'REJECTED': return 'Rejected';
      case 'WITHDRAWN': return 'Withdrawn';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  // Sort applications by appliedDate (newest first) and then filter by status
  const sortedApplications = [...applications].sort((a, b) => {
    const dateA = a.appliedDate ? new Date(a.appliedDate) : new Date(0);
    const dateB = b.appliedDate ? new Date(b.appliedDate) : new Date(0);
    return dateB - dateA; // Descending order (newest first)
  });

  const filteredApplications = selectedStatus === 'ALL' 
    ? sortedApplications 
    : sortedApplications.filter(app => app.status === selectedStatus);

  return (
    <>
      <SeekerNavbar />
      <div className="applications-page-bg">
        <div className="applications-container">
          <h2 className="applications-title">My Applications</h2>
          
          {/* Status Filter */}
          <div className="status-filter">
            <label>Filter by Status: </label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-select"
            >
              <option value="ALL">All Applications</option>
              <option value="PENDING">Under Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {loading && <p className="loading-text">Loading your applications...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && filteredApplications.length === 0 && (
            <p className="no-applications">No applications found.</p>
          )}
          
          {!loading && !error && filteredApplications.length > 0 && (
            <div className="applications-list">
              {filteredApplications.map((app) => (
                <div className="application-card" key={app.id}>
                  {/* Header Section with Job Title and Company Logo */}
                  <div className="application-header">
                    <div className="header-content">
                      <h3 className="job-title">
                        {app.job?.title || 'Job Title Not Available'}
                      </h3>
                      <p className="company-name">
                        {app.job?.company || 'Company Not Available'}
                      </p>
                    </div>
                    <div className="application-logo">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${app.job?.company?.charAt(0) || 'J'}&background=6366f1&color=fff&size=64`} 
                        alt={app.job?.company + ' logo'} 
                      />
                    </div>
                  </div>

                  {/* Job Details Section */}
                  <div className="job-details-section">
                    <h4 className="section-title">Job Details</h4>
                    <div className="job-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{app.job?.location || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Job Type:</span>
                        <span className="detail-value">{app.job?.jobType || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Experience Level:</span>
                        <span className="detail-value">{app.job?.experienceLevel || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Salary Range:</span>
                        <span className="detail-value">{app.job?.salaryRange || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Application Status Section */}
                  <div className="application-status-section">
                    <h4 className="section-title">Application Status</h4>
                    <div className="status-info">
                      <div className="status-item">
                        <span className="status-label">Status:</span>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(app.status) }}
                        >
                          {getStatusText(app.status)}
                        </span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">Date Applied:</span>
                        <span className="status-value">{formatDate(app.appliedDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Description Section */}
                  {app.job?.description && (
                    <div className="job-description-section">
                      <h4 className="section-title">Job Description</h4>
                      <div className="description-content">
                        <p>{app.job.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyApplications; 