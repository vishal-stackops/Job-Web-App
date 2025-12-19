import React, { useState, useEffect, useContext } from 'react';
import SeekerNavbar from './SeekerNavbar';
import './SavedJobs.css';
//import { useProfileCheck } from '../../hooks/useProfileCheck';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function SavedJobs() {
  //const { isChecking } = useProfileCheck();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const seekerId = localStorage.getItem('seekerId');
      if (!seekerId) {
        setError('You must be logged in to view saved jobs.');
        setLoading(false);
        return;
      }

      try {
        // session check (fetch → axios)
        await axios.get(`${API_BASE_URL}/api/seekers/${seekerId}`, {
          withCredentials: true
        });

        // fetch saved jobs (fetch → axios)
        const response = await axios.get(
          `${API_BASE_URL}/api/saved-jobs/${seekerId}`,
          { withCredentials: true }
        );

        setSavedJobs(response.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setSavedJobs([]);
        } else if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/signin');
        } else {
          console.error('Error fetching saved jobs:', err);
          setSavedJobs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [navigate]);

  const handleApplyJob = (e, savedJob) => {
    e.stopPropagation();
    setSelectedJob(savedJob);
    setShowModal(true);
    setApplyError('');
    setApplySuccess('');
    setAlreadyApplied(false);
    setResumeFile(null);
    handleApplyClick(e, savedJob);
  };

  const handleCardClick = (jobId) => {
    navigate(`/seeker/job/${jobId}`);
  };

  const handleApplyClick = async (e, job) => {
    e.stopPropagation();
    setApplyError('');
    setApplySuccess('');
    setCheckingApplied(true);
    setShowApplyForm(false);
    setAlreadyApplied(false);

    const seekerId = localStorage.getItem('seekerId');
    if (!seekerId) {
      setApplyError('You must be logged in as a job seeker to apply.');
      setCheckingApplied(false);
      return;
    }

    try {
      // check application (fetch → axios)
      const resp = await axios.get(
        `${API_BASE_URL}/api/applications/check/${job.jobId}/${seekerId}`,
        { withCredentials: true }
      );

      if (resp.data?.hasApplied) {
        setAlreadyApplied(true);
      } else {
        setShowApplyForm(true);
      }
    } catch (err) {
      console.error('Error checking application status:', err);
      setShowApplyForm(true);
    } finally {
      setCheckingApplied(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileValidation(file);
  };

  const handleFileValidation = (file) => {
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setApplyError('Please upload a PDF, DOC, or DOCX file only.');
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApplyError('File size must be less than 5MB.');
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    setApplyError('');
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess('');

    const seekerId = localStorage.getItem('seekerId');
    if (!seekerId || !resumeFile) {
      setApplyError('Please upload your resume file.');
      return;
    }

    setApplyLoading(true);

    try {
      const formData = new FormData();
      formData.append('jobId', selectedJob.jobId);
      formData.append('seekerId', seekerId);
      formData.append('resume', resumeFile);

      // upload application (fetch → axios)
      await axios.post(
        `${API_BASE_URL}/api/applications/upload`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setApplySuccess('Application submitted successfully! Your resume has been uploaded.');
      setResumeFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    setShowApplyForm(false);
    setApplyError('');
    setApplySuccess('');
    setAlreadyApplied(false);
    setResumeFile(null);
  };

  // if (isChecking) {
  //   return (
  //     <>
  //       <SeekerNavbar />
  //       <div className="seeker-home-content">
  //         <div style={{ textAlign: 'center', padding: '2rem', color: '#6366f1' }}>
  //           Checking profile...
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
  <SeekerNavbar />

  <div className={`saved-jobs-section ${theme === 'dark' ? 'dark-theme' : ''}`}>
    {loading ? (
      <p style={{ marginTop: '2rem' }}>Loading saved jobs...</p>
    ) : error ? (
      <p style={{ marginTop: '2rem', color: 'red' }}>{error}</p>
    ) : savedJobs.length === 0 ? (
      <p style={{ marginTop: '2rem' }}>No saved jobs found.</p>
    ) : (
      <div className="saved-jobs-list">
        {savedJobs.map((savedJob) => (
          <div
            key={savedJob.id}
            className="saved-job-card"
            onClick={() => handleCardClick(savedJob.jobId)}
          >
            <div className="job-info">
              <h3>{savedJob.jobTitle}</h3>

              <div className="job-details">
                <span className="company">{savedJob.companyName}</span>
                <span className="separator">•</span>
                <span className="location">{savedJob.location}</span>
                <span className="separator">•</span>
                <span className="salary">{savedJob.salaryRange}</span>
                <span className="separator">•</span>
                <span className="job-type">{savedJob.jobType}</span>
              </div>

              <p className="job-desc">
                {savedJob.description || 'No job description available.'}
              </p>

              <div className="saved-date">
                <small>Saved on: {savedJob.savedDate}</small>
              </div>
            </div>

            <div className="saved-job-actions">
              <button
                className="apply-btn"
                onClick={(e) => handleApplyJob(e, savedJob)}
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>


  {/* APPLY JOB MODAL */}
{showModal && selectedJob && (
  <div
    className="saved-jobs-section"
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000
    }}
    onClick={closeModal}
  >
    <div
      className="saved-job-card"
      style={{
        maxWidth: '500px',
        height: 'auto',
        cursor: 'default'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="job-info">
        <h3>Apply for {selectedJob.jobTitle}</h3>

        <div className="job-details">
          <span className="company">{selectedJob.companyName}</span>
          <span className="separator">•</span>
          <span className="location">{selectedJob.location}</span>
        </div>

        {checkingApplied && (
          <p className="job-desc">Checking application status...</p>
        )}

        {alreadyApplied && (
          <p
            className="job-desc"
            style={{ color: '#16a34a', fontWeight: 500 }}
          >
            You have already applied for this job.
          </p>
        )}

        {showApplyForm && (
          <form onSubmit={handleSubmitApplication}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ marginTop: '1rem' }}
            />

            {applyError && (
              <p
                className="job-desc"
                style={{ color: '#dc2626', marginTop: '0.5rem' }}
              >
                {applyError}
              </p>
            )}

            {applySuccess && (
              <p
                className="job-desc"
                style={{ color: '#16a34a', marginTop: '0.5rem' }}
              >
                {applySuccess}
              </p>
            )}

            <div className="saved-job-actions" style={{ marginTop: '1rem' }}>
              <button
                type="submit"
                className="apply-btn"
                disabled={applyLoading}
              >
                {applyLoading ? 'Applying...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}

        <div className="saved-job-actions" style={{ marginTop: '0.8rem' }}>
          <button
            type="button"
            className="apply-btn"
            style={{ background: '#6b7280' }}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}



</>

  );
}

export default SavedJobs;
