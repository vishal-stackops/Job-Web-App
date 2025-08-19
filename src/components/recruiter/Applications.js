import React, { useEffect, useState } from 'react';
import RecruiterNavbar from './RecruiterNavbar';
import axios from 'axios';
import './Applications.css';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [seekerProfiles, setSeekerProfiles] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState(null);
  const [iframeTimeout, setIframeTimeout] = useState(null);

  useEffect(() => {
    const recruiterId = localStorage.getItem('recruiterId');
    if (!recruiterId) {
      setError('Recruiter not logged in.');
      setLoading(false);
      return;
    }
    loadApplications(recruiterId);
  }, []);

  const loadApplications = async (recruiterId) => {
    try {
      console.log('Fetching applications for recruiter:', recruiterId);
      const response = await axios.get(`http://localhost:8080/api/applications/recruiter/${recruiterId}`, { withCredentials: true });
      console.log('Applications response:', response.data);
      setApplications(response.data);
      
      // Calculate statistics
      const total = response.data.length;
      const pending = response.data.filter(app => app.status === 'PENDING').length;
      const accepted = response.data.filter(app => app.status === 'ACCEPTED').length;
      const rejected = response.data.filter(app => app.status === 'REJECTED').length;
      
      setStats({ total, pending, accepted, rejected });
      
      // Fetch profile data for each seeker
      const profiles = {};
      console.log('Fetching seeker profiles...');
      for (const app of response.data) {
        if (app.seeker && app.seeker.id) {
          console.log('Fetching profile for seeker:', app.seeker.id);
          try {
            const profileResponse = await axios.get(`http://localhost:8080/api/profiles/seeker/${app.seeker.id}`, { withCredentials: true });
            console.log('Profile response for seeker', app.seeker.id, ':', profileResponse.data);
            profiles[app.seeker.id] = profileResponse.data;
          } catch (profileErr) {
            console.log('Profile not found for seeker:', app.seeker.id, profileErr.message);
            // Try to fetch basic seeker data as fallback
            try {
              const seekerResponse = await axios.get(`http://localhost:8080/api/seekers/${app.seeker.id}`, { withCredentials: true });
              console.log('Basic seeker data for', app.seeker.id, ':', seekerResponse.data);
              profiles[app.seeker.id] = {
                ...seekerResponse.data,
                phoneNumber: 'N/A',
                experienceLevel: 'N/A',
                skills: 'N/A',
                education: 'N/A'
              };
            } catch (seekerErr) {
              console.log('Seeker data also not found:', app.seeker.id, seekerErr.message);
              profiles[app.seeker.id] = null;
            }
          }
        }
      }
      console.log('All seeker profiles:', profiles);
      setSeekerProfiles(profiles);
      setLoading(false);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/applications/${applicationId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      
      // Update the local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      alert('Application status updated successfully!');
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleViewResume = async (resumeUrl, applicantName) => {
    setResumeLoading(true);
    setResumeError(null);
    
    try {
      // Ensure the URL is properly formatted
      let fullUrl = resumeUrl;
      if (!resumeUrl.startsWith('http')) {
        // If it's a relative path, make it absolute
        fullUrl = `http://localhost:8080${resumeUrl.startsWith('/') ? '' : '/'}${resumeUrl}`;
      }
      
      console.log('Attempting to access resume at:', fullUrl);
      
      // Set the resume immediately without testing first
      setSelectedResume({ url: fullUrl, name: applicantName });
      
      // Set a timeout to check if iframe loads within 10 seconds
      const timeout = setTimeout(() => {
        console.warn('PDF iframe loading timeout - showing download option');
        setResumeError('PDF is taking too long to load. You can download the file instead.');
      }, 10000);
      
      setIframeTimeout(timeout);
      
      // Test if the resume URL is accessible
      try {
        const testResponse = await fetch(fullUrl, { 
          method: 'HEAD',
          mode: 'cors',
          credentials: 'include'
        });
        
        if (!testResponse.ok) {
          console.warn(`Resume file may not be accessible (Status: ${testResponse.status})`);
                     // Try alternative URL format
           const alternativeUrl = fullUrl.replace('/uploads/resumes/', '/resumes/');
          console.log('Trying alternative URL:', alternativeUrl);
          
          const altResponse = await fetch(alternativeUrl, { 
            method: 'HEAD',
            mode: 'cors',
            credentials: 'include'
          });
          
          if (altResponse.ok) {
            console.log('Alternative URL works, updating...');
            setSelectedResume({ url: alternativeUrl, name: applicantName });
          }
        }
      } catch (testErr) {
        console.warn('Resume accessibility test failed:', testErr.message);
        // Don't set error, let the iframe try to load it
      }
      
    } catch (err) {
      console.error('Resume setup error:', err);
      // Still try to display the resume
      setSelectedResume({ url: resumeUrl, name: applicantName });
    } finally {
      setResumeLoading(false);
    }
  };

  const closeResumeModal = () => {
    setSelectedResume(null);
    setResumeError(null);
    if (iframeTimeout) {
      clearTimeout(iframeTimeout);
      setIframeTimeout(null);
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

  // Sort applications by appliedDate (newest first) and then filter by status
  const sortedApplications = [...applications].sort((a, b) => {
    const dateA = a.appliedDate ? new Date(a.appliedDate) : new Date(0);
    const dateB = b.appliedDate ? new Date(b.appliedDate) : new Date(0);
    return dateB - dateA; // Descending order (newest first)
  });

  const filteredApplications = selectedStatus === 'ALL' 
    ? sortedApplications 
    : sortedApplications.filter(app => app.status === selectedStatus);

  if (loading) {
    return (
      <>
        <RecruiterNavbar />
        <div className="recruiter-home-content">
          <p>Loading applications...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <RecruiterNavbar />
        <div className="recruiter-home-content">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <RecruiterNavbar />
      <div className="recruiter-home-content">
        <h2>Job Applications</h2>
        
        {/* Statistics */}
        <div className="applications-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card accepted">
            <div className="stat-number">{stats.accepted}</div>
            <div className="stat-label">Accepted</div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="status-filter">
          <label>Filter by Status: </label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-select"
          >
            <option value="ALL">All Applications</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>

        {filteredApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="recruiter-applications-list">
            {filteredApplications.map(app => (
              <div className="recruiter-application-card" key={app.id}>
                <div className="application-header">
                  <h3 className="job-title">{app.job?.title}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(app.status) }}
                  >
                    {app.status}
                  </span>
                </div>
                
                <div className="application-details">
                  <div className="detail-row">
                    <strong>Company:</strong> <span>{app.job?.company}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Location:</strong> <span>{app.job?.location}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Applied:</strong> <span>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Job Type:</strong> <span>{app.job?.jobType}</span>
                  </div>
                </div>

                {/* Seeker Information Section */}
                <div className="seeker-info">
                  <h4>Applicant Information</h4>
                  <div className="seeker-details">
                    <div className="detail-row">
                      <strong>Full Name:</strong> <span>{app.seeker?.name || seekerProfiles[app.seeker?.id]?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Email:</strong> <span>{app.seeker?.email || seekerProfiles[app.seeker?.id]?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Phone:</strong> <span>{seekerProfiles[app.seeker?.id]?.phoneNumber || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Experience:</strong> <span>{seekerProfiles[app.seeker?.id]?.experienceLevel || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Skills:</strong> <span>{seekerProfiles[app.seeker?.id]?.skills || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Education:</strong> <span>{seekerProfiles[app.seeker?.id]?.education || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Location:</strong> <span>{seekerProfiles[app.seeker?.id]?.location || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Profile Headline:</strong> <span>{seekerProfiles[app.seeker?.id]?.profileHeadline || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="cover-letter">
                    <strong>Cover Letter:</strong>
                    <p>{app.coverLetter}</p>
                  </div>
                )}

                {app.resumeUrl && (
                  <div className="resume-link">
                    <strong>Resume:</strong>
                    <button 
                      className="view-resume-btn"
                      onClick={() => handleViewResume(app.resumeUrl, app.seeker?.name || 'Applicant')}
                    >
                      📄 View Resume
                    </button>
                  </div>
                )}

                {!app.resumeUrl && (
                  <div className="resume-link">
                    <strong>Resume:</strong>
                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No resume uploaded</span>
                  </div>
                )}

                <div className="application-actions">
                  {app.status === 'PENDING' && (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === 'ACCEPTED' && (
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                    >
                      Change to Rejected
                    </button>
                  )}
                  {app.status === 'REJECTED' && (
                    <button
                      className="accept-btn"
                      onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                    >
                      Change to Accepted
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resume Modal */}
        {selectedResume && (
          <div className="resume-modal-overlay" onClick={closeResumeModal}>
            <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
              <div className="resume-modal-header">
                <h3>Resume - {selectedResume.name}</h3>
                <button className="close-btn" onClick={closeResumeModal}>×</button>
              </div>
              <div className="resume-modal-content">
                {resumeLoading && (
                  <div className="resume-loading">
                    <p>Loading resume...</p>
                  </div>
                )}
                {resumeError && (
                  <div className="resume-error">
                    <p>{resumeError}</p>
                    <div className="resume-error-actions">
                      <a 
                        href={selectedResume.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="download-btn"
                      >
                        Download Resume
                      </a>
                    </div>
                  </div>
                )}
                                 {!resumeLoading && (
                   <div className="resume-viewer">
                     {!resumeError ? (
                       <>
                                                   <iframe
                            src={`${selectedResume.url}#toolbar=1&navpanes=1&scrollbar=1`}
                            title={`Resume - ${selectedResume.name}`}
                            width="100%"
                            height="600px"
                            style={{ border: 'none' }}
                            onLoad={() => {
                              console.log('PDF iframe loaded successfully');
                              if (iframeTimeout) {
                                clearTimeout(iframeTimeout);
                                setIframeTimeout(null);
                              }
                            }}
                            onError={(e) => {
                              console.error('PDF iframe error:', e);
                                                             // Try alternative URL format
                               const currentUrl = selectedResume.url;
                               const alternativeUrl = currentUrl.includes('/uploads/resumes/') 
                                 ? currentUrl.replace('/uploads/resumes/', '/resumes/')
                                 : currentUrl.replace('/resumes/', '/uploads/resumes/');
                              
                              console.log('Trying alternative URL in iframe:', alternativeUrl);
                              setSelectedResume({ url: alternativeUrl, name: selectedResume.name });
                            }}
                          />
                         <div className="resume-actions">
                           <a 
                             href={selectedResume.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="download-btn"
                           >
                             Download Resume
                           </a>
                           <button 
                             onClick={() => window.open(selectedResume.url, '_blank')}
                             className="download-btn"
                             style={{ marginLeft: '10px' }}
                           >
                             Open in New Tab
                           </button>
                         </div>
                       </>
                     ) : (
                       <div className="resume-error">
                         <p>{resumeError}</p>
                         <div className="resume-error-actions">
                           <a 
                             href={selectedResume.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="download-btn"
                           >
                             Download Resume
                           </a>
                           <button 
                             onClick={() => window.open(selectedResume.url, '_blank')}
                             className="download-btn"
                             style={{ marginLeft: '10px' }}
                           >
                             Open in New Tab
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Applications; 