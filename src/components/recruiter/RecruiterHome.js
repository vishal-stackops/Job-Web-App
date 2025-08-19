import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import RecruiterNavbar from './RecruiterNavbar';
import ThemeToggle from '../ThemeToggle';
import axios from 'axios';
import './RecruiterHome.css';
import './RecruiterJobCards.css';

function RecruiterHome() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
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
    
    // First check if recruiter has a profile
    checkRecruiterProfile(recruiterId);
  }, []);

  const checkRecruiterProfile = async (recruiterId) => {
    try {
      const profileRes = await axios.get(`http://localhost:8080/api/recruiters/${recruiterId}/profile`);
      if (profileRes.data) {
        // Profile exists, load jobs
        loadJobs(recruiterId);
      } else {
        // No profile, show profile form
        setShowProfileForm(true);
        setLoading(false);
      }
    } catch (err) {
      // Profile doesn't exist, show profile form
      setShowProfileForm(true);
      setLoading(false);
    }
  };

  const loadJobs = async (recruiterId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/jobs/recruiter/${recruiterId}`, { withCredentials: true });
      const jobsData = res.data;
      
      // Fetch applications count for each job
      const jobsWithApplications = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const applicationsRes = await axios.get(`http://localhost:8080/api/applications/job/${job.id}`, { withCredentials: true });
            return {
              ...job,
              applications: applicationsRes.data || []
            };
          } catch (err) {
            console.error(`Error fetching applications for job ${job.id}:`, err);
            return {
              ...job,
              applications: []
            };
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
      // First try to delete normally
      await axios.delete(`http://localhost:8080/api/jobs/${jobToDelete.id}`, { withCredentials: true });
      setJobs(jobs => jobs.filter(job => job.id !== jobToDelete.id));
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      
      // Check if it's the foreign key constraint error
      if (errorMessage.includes('foreign key constraint fails') || 
          errorMessage.includes('saved_jobs') ||
          errorMessage.includes('Cannot delete or update a parent row') ||
          errorMessage.includes('FKawvc9t3d3efu6ta6h30tb984t') ||
          errorMessage.includes('constraint fails') ||
          errorMessage.includes('could not execute statement') ||
          errorMessage.includes('FOREIGN KEY constraint')) {
        
        // Show force delete modal instead of window.confirm
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
      // First delete all saved job references
      await axios.delete(`http://localhost:8080/api/saved-jobs/job/${jobToDelete.id}`, { withCredentials: true });
      
      // Then try to delete the job again
      await axios.delete(`http://localhost:8080/api/jobs/${jobToDelete.id}`, { withCredentials: true });
      setJobs(jobs => jobs.filter(job => job.id !== jobToDelete.id));
      setShowForceDeleteModal(false);
      setJobToDelete(null);
    } catch (forceErr) {
      alert('Failed to force delete job: ' + (forceErr.response?.data?.message || forceErr.message));
      setShowForceDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const handleForceDeleteCancel = () => {
    setShowForceDeleteModal(false);
    setJobToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
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
      const profileData = {
        ...profileForm,
        recruiterId: parseInt(recruiterId)
      };

      await axios.post(`http://localhost:8080/api/recruiters/${recruiterId}/profile`, profileData, { withCredentials: true });
      
      // Profile created successfully, hide form and load jobs
      setShowProfileForm(false);
      loadJobs(recruiterId);
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
  };



  const handleLogout = () => {
    // Optionally clear auth/session here
    navigate('/signin');
  };
  return (
    <>
      <RecruiterNavbar />
      {showProfileForm ? (
        <div className="recruiter-profile-container">
          <div className="recruiter-profile-form-container">
            <form className="recruiter-profile-form" onSubmit={handleProfileSubmit}>
              <h2>Complete Your Profile</h2>
              <p className="profile-subtitle">
                Please provide your information to complete your recruiter profile
              </p>
              
              {profileError && (
                <div className="error-message">
                  {profileError}
                </div>
              )}

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
                      placeholder="Enter your full name"
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
                      placeholder="Enter your email"
                      required
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Phone Number
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleProfileChange}
                      placeholder="Enter your phone number"
                    />
                  </label>
                  <label>
                    Position *
                    <input
                      type="text"
                      name="position"
                      value={profileForm.position}
                      onChange={handleProfileChange}
                      placeholder="e.g., HR Manager, Talent Acquisition"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Company Information</h3>
                <label>
                  Company Name *
                  <input
                    type="text"
                    name="companyName"
                    value={profileForm.companyName}
                    onChange={handleProfileChange}
                    placeholder="Enter your company name"
                    required
                  />
                </label>
                <label>
                  Company Description
                  <textarea
                    name="companyDescription"
                    value={profileForm.companyDescription}
                    onChange={handleProfileChange}
                    placeholder="Brief description of your company"
                    rows="3"
                  />
                </label>
              </div>

              <div className="form-section">
                <h3>Professional Links</h3>
                <div className="form-row">
                  <label>
                    LinkedIn Profile
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={profileForm.linkedinProfile}
                      onChange={handleProfileChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </label>
                  <label>
                    Company Website
                    <input
                      type="url"
                      name="website"
                      value={profileForm.website}
                      onChange={handleProfileChange}
                      placeholder="https://yourcompany.com"
                    />
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={profileLoading}
                >
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
          {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}
          {!loading && !error && jobs.length > 0 && (
            <div className="recruiter-jobs-list">
              {jobs.map(job => (
                <div className="recruiter-job-card" key={job.id}>
                  <h3 className="recruiter-job-title">{job.title}</h3>
                  <div className="recruiter-job-meta">
                    <span className="recruiter-job-company">{job.company}</span>
                    <span className="recruiter-job-location">{job.location}</span>
                  </div>
                  <div className="recruiter-job-details">
                    <span className="recruiter-job-salary">{job.salaryRange}</span>
                    <span className="recruiter-job-type">{job.jobType}</span>
                    <span className="recruiter-job-level">{job.experienceLevel}</span>
                  </div>
                  <div className="recruiter-job-date">
                    {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'No date'}
                  </div>
                  <div className="recruiter-job-apps">
                    <svg className="applications-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="applications-text">
                      {job.applications ? job.applications.length : 0} {job.applications && job.applications.length === 1 ? 'Applicant' : 'Applicants'}
                    </span>
                  </div>
                  <button
                    className="recruiter-job-delete-btn"
                    onClick={() => handleDeleteClick(job)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

             {/* Delete Confirmation Modal */}
       {showDeleteModal && jobToDelete && (
         <div className="delete-confirmation-modal">
           <div className="delete-confirmation-content">
             <div className="delete-confirmation-icon">
               <svg fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
               </svg>
             </div>
             <h3 className="delete-confirmation-title">
               Delete Job Posting
             </h3>
             <p className="delete-confirmation-message">
               Are you sure you want to delete "<strong>{jobToDelete.title}</strong>"? This action cannot be undone and will permanently remove this job posting.
             </p>
             <div className="delete-confirmation-actions">
               <button
                 className="delete-cancel-btn"
                 onClick={handleDeleteCancel}
               >
                 Cancel
               </button>
               <button
                 className="delete-confirm-btn"
                 onClick={handleDeleteConfirm}
               >
                 Delete Job
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Force Delete Confirmation Modal */}
       {showForceDeleteModal && jobToDelete && (
         <div className="delete-confirmation-modal">
           <div className="delete-confirmation-content force-delete">
             <div className="delete-confirmation-icon force-delete-icon">
               <svg fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
               </svg>
             </div>
             <h3 className="delete-confirmation-title force-delete-title">
               Job Has Saved References
             </h3>
             <p className="delete-confirmation-message force-delete-message">
               This job "<strong>{jobToDelete.title}</strong>" has been saved by job seekers. 
               <br /><br />
               <span className="warning-text">⚠️ Warning:</span> Deleting this job will also remove all saved references to it from job seekers' accounts.
             </p>
             <div className="delete-confirmation-actions">
               <button
                 className="delete-cancel-btn"
                 onClick={handleForceDeleteCancel}
               >
                 Cancel
               </button>
               <button
                 className="delete-confirm-btn force-delete-btn"
                 onClick={handleForceDeleteConfirm}
               >
                 Delete Anyway
               </button>
             </div>
           </div>
         </div>
       )}
    </>
  );
}

export default RecruiterHome;
