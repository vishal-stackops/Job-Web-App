import React, { useEffect, useState } from 'react';
import RecruiterNavbar from './RecruiterNavbar';
import './Applications.css';
import axios from "axios";
import API_BASE_URL from "../config/api";

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
      const response = await axios.get(`/api/applications/recruiter/${recruiterId}`, { withCredentials: true });
      setApplications(response.data);

      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(app => app.status === 'PENDING').length;
      const accepted = response.data.filter(app => app.status === 'ACCEPTED').length;
      const rejected = response.data.filter(app => app.status === 'REJECTED').length;
      setStats({ total, pending, accepted, rejected });

      // Fetch seeker profiles in parallel
      const profiles = {};
      await Promise.all(
        response.data.map(async (app) => {
          if (app.seeker && app.seeker.id) {
            try {
              const profileResponse = await axios.get(`/api/profiles/seeker/${app.seeker.id}`, { withCredentials: true });
              profiles[app.seeker.id] = profileResponse.data;
            } catch {
              try {
                const seekerResponse = await axios.get(`/api/seekers/${app.seeker.id}`, { withCredentials: true });
                profiles[app.seeker.id] = {
                  ...seekerResponse.data,
                  phoneNumber: 'N/A',
                  experienceLevel: 'N/A',
                  skills: 'N/A',
                  education: 'N/A'
                };
              } catch {
                profiles[app.seeker.id] = null;
              }
            }
          }
        })
      );
      setSeekerProfiles(profiles);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.put(`/api/applications/${applicationId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      alert('Application status updated successfully!');
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const getFullResumeUrl = (resumeUrl) => {
    if (!resumeUrl.startsWith('http')) {
      return `${resumeUrl.startsWith('/') ? '' : '/'}${resumeUrl}`;
    }
    return resumeUrl;
  };

  const handleViewResume = (resumeUrl, applicantName) => {
    setResumeLoading(true);
    setResumeError(null);

    const fullUrl = getFullResumeUrl(resumeUrl);
    setSelectedResume({ url: fullUrl, name: applicantName });

    const timeout = setTimeout(() => {
      setResumeError('PDF is taking too long to load. You can download the file instead.');
    }, 10000);
    setIframeTimeout(timeout);

    setResumeLoading(false);
  };

  const closeResumeModal = () => {
    setSelectedResume(null);
    setResumeError(null);
    if (iframeTimeout) clearTimeout(iframeTimeout);
    setIframeTimeout(null);
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

  const sortedApplications = [...applications].sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0));
  const filteredApplications = selectedStatus === 'ALL' 
    ? sortedApplications 
    : sortedApplications.filter(app => app.status === selectedStatus);

  if (loading) return <><RecruiterNavbar /><div className="recruiter-home-content"><p>Loading applications...</p></div></>;
  if (error) return <><RecruiterNavbar /><div className="recruiter-home-content"><p style={{ color: 'red' }}>{error}</p></div></>;

  return (
    <>
      <RecruiterNavbar />
      <div className="recruiter-home-content">
        <h2>Job Applications</h2>

        {/* Statistics */}
        <div className="applications-stats">
          <div className="stat-card"><div className="stat-number">{stats.total}</div><div className="stat-label">Total Applications</div></div>
          <div className="stat-card pending"><div className="stat-number">{stats.pending}</div><div className="stat-label">Pending</div></div>
          <div className="stat-card accepted"><div className="stat-number">{stats.accepted}</div><div className="stat-label">Accepted</div></div>
          <div className="stat-card rejected"><div className="stat-number">{stats.rejected}</div><div className="stat-label">Rejected</div></div>
        </div>

        {/* Status Filter */}
        <div className="status-filter">
          <label>Filter by Status: </label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="status-select">
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
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(app.status) }}>{app.status}</span>
                </div>

                <div className="application-details">
                  <div className="detail-row"><strong>Company:</strong> <span>{app.job?.company}</span></div>
                  <div className="detail-row"><strong>Location:</strong> <span>{app.job?.location}</span></div>
                  <div className="detail-row"><strong>Applied:</strong> <span>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</span></div>
                  <div className="detail-row"><strong>Job Type:</strong> <span>{app.job?.jobType}</span></div>
                </div>

                <div className="seeker-info">
                  <h4>Applicant Information</h4>
                  <div className="seeker-details">
                    <div className="detail-row"><strong>Full Name:</strong> <span>{app.seeker?.name || seekerProfiles[app.seeker?.id]?.name || 'N/A'}</span></div>
                    <div className="detail-row"><strong>Email:</strong> <span>{app.seeker?.email || seekerProfiles[app.seeker?.id]?.email || 'N/A'}</span></div>
                    <div className="detail-row"><strong>Phone:</strong> <span>{seekerProfiles[app.seeker?.id]?.phoneNumber || 'N/A'}</span></div>
                    <div className="detail-row"><strong>Experience:</strong> <span>{seekerProfiles[app.seeker?.id]?.experienceLevel || 'N/A'}</span></div>
                    <div className="detail-row"><strong>Skills:</strong> <span>{seekerProfiles[app.seeker?.id]?.skills || 'N/A'}</span></div>
                    <div className="detail-row"><strong>Education:</strong> <span>{seekerProfiles[app.seeker?.id]?.education || 'N/A'}</span></div>
                  </div>
                </div>

                {app.coverLetter && <div className="cover-letter"><strong>Cover Letter:</strong><p>{app.coverLetter}</p></div>}

                {app.resumeUrl && (
                  <div className="resume-link">
                    <strong>Resume:</strong>
                    <button className="view-resume-btn" onClick={() => handleViewResume(app.resumeUrl, app.seeker?.name || 'Applicant')}>📄 View Resume</button>
                  </div>
                )}

                <div className="application-actions">
                  {app.status === 'PENDING' && <>
                    <button className="accept-btn" onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}>Accept</button>
                    <button className="reject-btn" onClick={() => handleStatusUpdate(app.id, 'REJECTED')}>Reject</button>
                  </>}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedResume && (
          <div className="resume-modal-overlay" onClick={closeResumeModal}>
            <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
              <div className="resume-modal-header">
                <h3>Resume - {selectedResume.name}</h3>
                <button className="close-btn" onClick={closeResumeModal}>×</button>
              </div>
              <div className="resume-modal-content">
                {resumeLoading && <p>Loading resume...</p>}
                {resumeError && <p>{resumeError}</p>}
                {!resumeLoading && !resumeError && (
                  <iframe src={`${selectedResume.url}#toolbar=1`} title={`Resume - ${selectedResume.name}`} width="100%" height="600px" style={{ border: 'none' }} onLoad={() => { if (iframeTimeout) { clearTimeout(iframeTimeout); setIframeTimeout(null); }}} />
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
