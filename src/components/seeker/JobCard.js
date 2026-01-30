import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App';
import './JobCard.css';
import axios from "axios";
import API_BASE_URL from "../../config/api";


function JobCard({ job,onApplied }) {
  // const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  //const [checkingApplied, setCheckingApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);





  useEffect(() => {
    const checkIfSaved = async () => {
      const seekerId = localStorage.getItem('seekerId');
      if (!seekerId) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/saved-jobs/check/${job.id}/${seekerId}`
        );
        setIsSaved(response.data.isSaved);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setIsSaved(false);
        } else {
          console.error('Error checking if job is saved:', error);
          setIsSaved(false);
        }
      }
    };

    checkIfSaved();
  }, [job.id]);

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    const seekerId = localStorage.getItem('seekerId');
    if (!seekerId) {
      alert('You must be logged in to save jobs.');
      return;
    }

    setSavingJob(true);
    try {
      await axios.post(`${API_BASE_URL}/api/saved-jobs`, {
        jobId: job.id,
        seekerId: seekerId
      });
      setIsSaved(true);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Save functionality will be available once backend is implemented.');
      } else {
        console.error('Error saving job:', error);
        alert('Save functionality will be available once backend is implemented.');
      }
    } finally {
      setSavingJob(false);
    }
  };

  const handleUnsaveJob = async (e) => {
    e.stopPropagation();
    const seekerId = localStorage.getItem('seekerId');
    if (!seekerId) return;

    setSavingJob(true);
    try {
      await axios.delete(
        `${API_BASE_URL}/api/saved-jobs/${job.id}/${seekerId}`
      );
      setIsSaved(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Unsave functionality will be available once backend is implemented.');
      } else {
        console.error('Error unsaving job:', error);
        alert('Unsave functionality will be available once backend is implemented.');
      }
    } finally {
      setSavingJob(false);
    }
  };

  const handleApply = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setApplyError('');
    setApplySuccess('');
    setAlreadyApplied(false);
    setResumeFile(null);
    handleApplyClick(e);
  };

  const handleApplyClick = async (e) => {
    e.stopPropagation();
    setApplyError('');
    setApplySuccess('');
    //setCheckingApplied(true);
    setShowApplyForm(false);
    setAlreadyApplied(false);

    const seekerId = localStorage.getItem('seekerId');
    if (!seekerId) {
      setApplyError('You must be logged in as a job seeker to apply.');
      //setCheckingApplied(false);
      return;
    }

    try {
      const resp = await axios.get(
        `${API_BASE_URL}/api/applications/check/${job.id}/${seekerId}`
      );

      if (resp.data.hasApplied) {
        setAlreadyApplied(true);
      } else {
        setShowApplyForm(true);
      }
       
    } catch (err) {
      console.error('Error checking application status:', err);
      setShowApplyForm(true);
    } finally {
      //setCheckingApplied(false);
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
      const fileInput = document.getElementById('resume-file-input');
      if (fileInput) fileInput.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApplyError('File size must be less than 5MB.');
      setResumeFile(null);
      const fileInput = document.getElementById('resume-file-input');
      if (fileInput) fileInput.value = '';
      return;
    }

    setResumeFile(file);
    setApplyError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = theme === 'dark' ? '#60a5fa' : '#3b82f6';
    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#475569' : '#f3f4f6';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = theme === 'dark' ? '#475569' : '#d1d5db';
    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = theme === 'dark' ? '#475569' : '#d1d5db';
    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileValidation(files[0]);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess('');



    const seekerId = localStorage.getItem('seekerId');
    if (!seekerId) {
      setApplyError('You must be logged in as a job seeker to apply.');
      return;
    }

    if (!resumeFile) {
      setApplyError('Please upload your resume file.');
      return;
    }

    setApplyLoading(true);
    try {
      const formData = new FormData();
      formData.append('jobId', job.id);
      formData.append('seekerId', seekerId);
      formData.append('resume', resumeFile);

      await axios.post(
        `${API_BASE_URL}/api/applications/upload`,
        formData,
        { withCredentials: true }
      );

      setApplySuccess(
        'Application submitted successfully! Your resume has been uploaded.'
      );
      setResumeFile(null);
      // move job to My Applications
      if (onApplied) onApplied(job); // send full job object

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Upload error:', err);
      setApplyError(
        err.response?.data?.message ||
        err.message ||
        'Failed to submit application. Please try again.'
      );
    } finally {
      setApplyLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowApplyForm(false);
    setApplyError('');
    setApplySuccess('');
    setAlreadyApplied(false);
    setResumeFile(null);
  };

    useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (showModal) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showModal]);


  return (
  <>
    {/* JOB CARD */}
    <div className="job-card">
      <h3>{job.title}</h3>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <div className="job-card-actions">
        <button
            className="apply-btn"
          onClick={(e) => handleApply(e, job)}
          >
          Apply Now
        </button>

        <button
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={isSaved ? handleUnsaveJob : handleSaveJob}
          disabled={savingJob}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>

    {/* APPLY MODAL */}
    {showModal && (
      <div
        className="apply-modal-overlay"
        onClick={closeModal}
      >
        <div
          className="apply-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={closeModal}
            aria-label="Close modal"
            >
              ✕
            </button>
          <h2 className="modal-job-title">
            {job.title}
          </h2>

          <p>
            <strong>Company:</strong> {job.company}
          </p>

          <p>
            <strong>Location:</strong> {job.location}
          </p>

          <div className="job-description">
            {job.description}
          </div>

          <p>
            <strong>Salary:</strong> {job.salary}
          </p>

          <p>
            <strong>Job Type:</strong> {job.jobType}
          </p>

          <p>
            <strong>Experience Level:</strong> {job.experienceLevel}
          </p>

          {/* APPLY FORM */}
          {showApplyForm && (
            <form
              className="apply-form"
              onSubmit={handleSubmitApplication}
            >
              <label className="resume-label">
                Upload Resume
              </label>

              <div
                className="resume-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  document
                    .getElementById('resume-file-input')
                    .click()
                }
              >
                Click or drag & drop resume
              </div>

              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                hidden
              />

              <button
                type="submit"
                className="apply-btn"
                disabled={applyLoading}
              >
                {applyLoading
                  ? 'Submitting...'
                  : 'Submit Application'}
              </button>
            </form>
          )}

          {/* ALREADY APPLIED */}
          {alreadyApplied && (
            <div className="apply-info-msg">
              You already applied for this job.
            </div>
          )}

          {/* SUCCESS */}
          {applySuccess && (
            <div className="apply-success-msg">
              {applySuccess}
            </div>
          )}

          {/* ERROR */}
          {applyError && (
            <div className="apply-error-msg">
              {applyError}
            </div>
          )}
        </div>
      </div>
    )}
  </>
);


}

export default JobCard;
