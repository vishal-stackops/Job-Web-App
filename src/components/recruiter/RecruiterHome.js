import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterNavbar from './RecruiterNavbar';
import './RecruiterHome.css';
import './RecruiterJobCards.css';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function RecruiterHome() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    position: '',
    companyDescription: '',
    linkedinProfile: '',
    website: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const recruiterId = localStorage.getItem('recruiterId');
    if (!recruiterId) {
      setError('Recruiter not logged in.');
      setLoading(false);
      return;
    }
    checkRecruiterProfile(recruiterId);
  }, []);

  const checkRecruiterProfile = async (recruiterId) => {
    try {
      const profileRes = await axios.get(`${API_BASE_URL}/api/recruiters/${recruiterId}/profile`, { withCredentials: true });
      if (profileRes.data) {
        loadJobs(recruiterId);
      } else {
        setShowProfileForm(true);
        setLoading(false);
      }
    } catch {
      setShowProfileForm(true);
      setLoading(false);
    }
  };

  const loadJobs = async (recruiterId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/jobs/recruiter/${recruiterId}`, { withCredentials: true });
      const jobsData = res.data;

      // const jobsWithApplications = await Promise.all(
      //   jobsData.map(async (job) => {
      //     try {
      //       const applicationsRes = await axios.get(`/api/applications/job/${job.id}`, { withCredentials: true });
      //       return { ...job, applications: applicationsRes.data || [] };
      //     } catch {
      //       return { ...job, applications: [] };
      //     }
      //   })
      // );

      console.log("jobsData:", jobsData); // check if it's an array

      const jobsWithApplications = await Promise.all(
      (Array.isArray(jobsData) ? jobsData : []).map(async (job) => {
        try {
            const applicationsRes = await axios.get(`${API_BASE_URL}/api/applications/job/${job.id}`, { withCredentials: true });
            return { ...job, applications: applicationsRes.data || [] };
        } catch {
            return { ...job, applications: [] };
        }
      })
    );

      setJobs(jobsWithApplications);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/jobs/${jobToDelete.id}`, { withCredentials: true });
      setJobs(jobs => jobs.filter(job => job.id !== jobToDelete.id));
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      if (
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('saved_jobs')
      ) {
        setShowDeleteModal(false);
        setShowForceDeleteModal(true);
      } else {
        alert('Failed to delete job: ' + errorMessage);
        setShowDeleteModal(false);
        setJobToDelete(null);
      }
    }
  };

  const handleForceDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/saved-jobs/job/${jobToDelete.id}`, { withCredentials: true });
      await axios.delete(`${API_BASE_URL}/api/jobs/${jobToDelete.id}`, { withCredentials: true });
      setJobs(jobs => jobs.filter(job => job.id !== jobToDelete.id));
      setShowForceDeleteModal(false);
      setJobToDelete(null);
    } catch (err) {
      alert('Failed to force delete job: ' + (err.response?.data?.message || err.message));
      setShowForceDeleteModal(false);
      setJobToDelete(null);
    }
  };

  // ✅ FIXED FUNCTION (MISSING EARLIER)
  const handleForceDeleteCancel = () => {
    setShowForceDeleteModal(false);
    setJobToDelete(null);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');

    const recruiterId = localStorage.getItem('recruiterId');
    if (!recruiterId) {
      setProfileError('Recruiter not logged in.');
      setProfileLoading(false);
      return;
    }

    try {
      const profileData = { ...profileForm, recruiterId: parseInt(recruiterId) };
      await axios.post(`${API_BASE_URL}/api/recruiters/${recruiterId}/profile`, profileData, { withCredentials: true });
      setShowProfileForm(false);
      loadJobs(recruiterId);
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/signin');
  };

  return (
  <>
    <RecruiterNavbar />

    {/* Profile Form */}
    {showProfileForm ? (
      <div className="recruiter-profile-container">
        <div className="recruiter-profile-form-container">
          <form className="recruiter-profile-form" onSubmit={handleProfileSubmit}>
            <h2>Complete Your Profile</h2>
            {profileError && <div className="error-message">{profileError}</div>}

            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <label>
                  Full Name *
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </label>
                <label>
                  Email *
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Phone Number
                  <input
                    type="text"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                  />
                </label>
                <label>
                  Position
                  <input
                    type="text"
                    name="position"
                    value={profileForm.position}
                    onChange={handleProfileChange}
                  />
                </label>
              </div>
            </div>

            {/* Company Information */}
            <div className="form-section">
              <h3>Company Information</h3>
              <div className="form-row">
                <label>
                  Company Name
                  <input
                    type="text"
                    name="companyName"
                    value={profileForm.companyName}
                    onChange={handleProfileChange}
                  />
                </label>
                <label>
                  Company Description
                  <textarea
                    name="companyDescription"
                    value={profileForm.companyDescription}
                    onChange={handleProfileChange}
                  />
                </label>
              </div>
            </div>

            {/* Professional Links */}
            <div className="form-section">
              <h3>Professional Links</h3>
              <div className="form-row">
                <label>
                  LinkedIn
                  <input
                    type="url"
                    name="linkedin"
                    value={profileForm.linkedin}
                    onChange={handleProfileChange}
                  />
                </label>
                <label>
                  Website
                  <input
                    type="url"
                    name="website"
                    value={profileForm.website}
                    onChange={handleProfileChange}
                  />
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : (
      <div className="recruiter-home-content">
        {loading && <p>Loading jobs...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && jobs.length > 0 && (
          <div className="recruiter-jobs-list">
            {jobs.map((job) => (
              <div className="recruiter-job-card" key={job.id}>
                <h3>{job.title}</h3>
                <button onClick={() => handleDeleteClick(job)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Delete Modal */}
    {showForceDeleteModal && jobToDelete && (
      <div className="delete-confirmation-modal">
        <div className="delete-confirmation-content">
          <h3>Job Has Saved References</h3>
          <button onClick={handleForceDeleteCancel}>Cancel</button>
          <button onClick={handleForceDeleteConfirm}>Delete Anyway</button>
        </div>
      </div>
    )}
  </>
);
}

export default RecruiterHome;
