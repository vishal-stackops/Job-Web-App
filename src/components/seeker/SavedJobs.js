import React, { useState, useEffect, useContext } from 'react';
import SeekerNavbar from './SeekerNavbar';
import './SavedJobs.css';
import { useProfileCheck } from '../../hooks/useProfileCheck';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App';

function SavedJobs() {
  // Use the profile check hook
  const { isChecking } = useProfileCheck();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const seekerId = localStorage.getItem('seekerId');
      if (!seekerId) {
        setError('You must be logged in to view saved jobs.');
        setLoading(false);
        return;
      }

      // Validate session by checking if the seekerId is valid
      try {
        // First validate the session
        const sessionCheck = await fetch(`http://localhost:8080/api/seekers/${seekerId}`);
        if (!sessionCheck.ok) {
          // Session is invalid, clear localStorage and redirect
          localStorage.clear();
          navigate('/signin');
          return;
        }

        const response = await fetch(`http://localhost:8080/api/saved-jobs/${seekerId}`);
        if (response.ok) {
          const data = await response.json();
          setSavedJobs(data);
        } else if (response.status === 404) {
          // Backend not implemented yet, show empty state
          setSavedJobs([]);
        } else {
          setError('Failed to fetch saved jobs.');
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        // If backend is not running, show empty state instead of error
        setSavedJobs([]);
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
    // Automatically start the application process when modal opens
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
      const resp = await fetch(`http://localhost:8080/api/applications/check/${job.jobId}/${seekerId}`);
      
      if (!resp.ok) {
        console.error('API Error Response:', resp.status, resp.statusText);
        // If the API is not available, just show the apply form
        setShowApplyForm(true);
        return;
      }
      
      const responseText = await resp.text();
      console.log('Raw check application response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error in check application:', parseError);
        console.error('Response that failed to parse:', responseText);
        // If JSON parsing fails, just show the apply form
        setShowApplyForm(true);
        return;
      }
      
      if (data.hasApplied) {
        setAlreadyApplied(true);
      } else {
        setShowApplyForm(true);
      }
    } catch (err) {
      console.error('Error checking application status:', err);
      // If there's any error, just show the apply form
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
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
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
      formData.append('jobId', selectedJob.jobId);
      formData.append('seekerId', seekerId);
      formData.append('resume', resumeFile);
      
      const response = await fetch('http://localhost:8080/api/applications/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload API Error Response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          console.error('JSON Parse Error in upload response:', parseError);
          throw new Error('Failed to submit application. Please try again.');
        }
        
        throw new Error(errorData.message || 'Failed to submit application');
      }
      
      const responseText = await response.text();
      console.log('Raw upload response:', responseText);
      
      setApplySuccess('Application submitted successfully! Your resume has been uploaded.');
      setResumeFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Upload error:', err);
      setApplyError(err.message || 'Failed to submit application. Please try again.');
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

  // Show loading while checking profile
  if (isChecking) {
    return (
      <>
        <SeekerNavbar />
        <div className="seeker-home-content">
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            fontSize: '1.2rem',
            color: '#6366f1'
          }}>
            Checking profile...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeekerNavbar />
      <div className="seeker-home-content">
        <div className="saved-jobs-section">
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              fontSize: '1.2rem',
              color: '#6366f1'
            }}>
              Loading saved jobs...
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              fontSize: '1.1rem',
              color: '#dc2626',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              margin: '1rem 0'
            }}>
              {error}
            </div>
          ) : savedJobs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              fontSize: '1.1rem',
              color: '#6b7280'
            }}>
              <p>You have no saved jobs yet.</p>
              <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
                Start saving jobs by clicking the "Save" button on job cards!
              </p>
            </div>
          ) : (
            <div className="saved-jobs-list">
              {savedJobs.map((savedJob) => (
                <div 
                  className="saved-job-card" 
                  key={savedJob.savedJobId}
                  onClick={() => handleCardClick(savedJob.jobId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="job-info">
                    <h3>{savedJob.jobTitle || `Job ID: ${savedJob.jobId}`}</h3>
                    <div className="job-details">
                      <span className="company">{savedJob.company || 'N/A'}</span>
                      <span className="separator">•</span>
                      <span className="location">{savedJob.location || 'N/A'}</span>
                      {savedJob.salaryRange && (
                        <>
                          <span className="separator">•</span>
                          <span className="salary">{savedJob.salaryRange}</span>
                        </>
                      )}
                      {savedJob.jobType && (
                        <>
                          <span className="separator">•</span>
                          <span className="job-type">{savedJob.jobType}</span>
                        </>
                      )}
                    </div>
                    {savedJob.description && (
                      <div className="job-description">
                        {savedJob.description.length > 120 
                          ? `${savedJob.description.substring(0, 120)}...` 
                          : savedJob.description}
                      </div>
                    )}
                    <div className="saved-date">
                      <small>Saved on: {new Date(savedJob.savedDate).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div className="saved-job-actions">
                    <button 
                      className="apply-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyJob(e, savedJob);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                  {!savedJob.jobTitle && (
                    <div className="job-not-found">
                      <p>⚠️ Job details not found. The job may have been deleted.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup for More Info and Apply */}
      {showModal && selectedJob && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="modal-content" style={{
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#e2e8f0' : '#000',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: 500,
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            position: 'relative',
            border: theme === 'dark' ? '1px solid #334155' : 'none'
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: theme === 'dark' ? '#94a3b8' : '#888',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 style={{
              marginBottom:'1.2rem',
              color: theme === 'dark' ? '#f1f5f9' : '#000'
            }}>{selectedJob.jobTitle || `Job ID: ${selectedJob.jobId}`}</h3>
            <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Company:</strong> {selectedJob.company || 'N/A'}</p>
            <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Location:</strong> {selectedJob.location || 'N/A'}</p>
            {selectedJob.description && <p style={{
              marginBottom:'1.2rem',
              color: theme === 'dark' ? '#cbd5e1' : '#374151',
              lineHeight: '1.6',
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '0.5rem',
              backgroundColor: theme === 'dark' ? '#334155' : '#f8fafc',
              borderRadius: '6px',
              border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0'
            }}>{selectedJob.description}</p>}
            {selectedJob.salaryRange && <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Salary:</strong> {selectedJob.salaryRange}</p>}
            {selectedJob.jobType && <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Job Type:</strong> {selectedJob.jobType}</p>}
            {selectedJob.experienceLevel && <p style={{
              marginBottom:'1.2rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Experience Level:</strong> {selectedJob.experienceLevel}</p>}

            {/* Apply Button or Upload Form */}
            {!showApplyForm && !alreadyApplied && !applySuccess && (
              <button className="apply-btn" onClick={(e) => handleApplyClick(e, selectedJob)} disabled={checkingApplied}>
                {checkingApplied ? 'Checking...' : 'Apply'}
              </button>
            )}

            {/* Already Applied Message */}
            {alreadyApplied && (
              <div style={{
                color: '#dc2626',
                backgroundColor: '#fee2e2',
                padding: '0.75rem',
                borderRadius: '6px',
                margin: '1rem 0',
                fontSize: '1rem',
                textAlign: 'center',
                fontWeight: 500
              }}>
                You have already applied to this job.
              </div>
            )}

            {/* Upload Form */}
            {showApplyForm && !applySuccess && (
              <form onSubmit={handleSubmitApplication} style={{marginTop:'1.2rem'}}>
                <div className="file-upload-section">
                  <label style={{
                    display:'block',
                    marginBottom:'1rem',
                    fontWeight:'500',
                    color: theme === 'dark' ? '#f1f5f9' : '#000'
                  }}>
                    Resume (PDF/DOC/DOCX):
                  </label>
                  <div className="file-input-container" style={{
                    border: theme === 'dark' ? '2px dashed #475569' : '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    backgroundColor: theme === 'dark' ? '#334155' : '#f9fafb',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => document.getElementById('resume-file-input').click()}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = theme === 'dark' ? '#60a5fa' : '#3b82f6';
                    e.target.style.backgroundColor = theme === 'dark' ? '#475569' : '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = theme === 'dark' ? '#475569' : '#d1d5db';
                    e.target.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb';
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  >
                    <input 
                      id="resume-file-input"
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileChange}
                      required
                      style={{
                        display: 'none'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        color: theme === 'dark' ? '#60a5fa' : '#3b82f6'
                      }}>
                        📄
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: theme === 'dark' ? '#f1f5f9' : '#374151'
                      }}>
                        Click to upload resume
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: theme === 'dark' ? '#94a3b8' : '#6b7280'
                      }}>
                        PDF, DOC, or DOCX (Max 5MB)
                      </div>
                    </div>
                  </div>
                  {resumeFile && (
                    <div style={{
                      padding: '0.5rem',
                      backgroundColor: theme === 'dark' ? '#1e3a8a' : '#dcfce7',
                      color: theme === 'dark' ? '#dbeafe' : '#000',
                      borderRadius: '4px',
                      marginBottom: '1rem'
                    }}>
                      <strong>Selected file:</strong> {resumeFile.name}
                    </div>
                  )}
                </div>
                {applyError && (
                  <div style={{
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    {applyError}
                  </div>
                )}
                <div className="job-card-actions">
                  <button 
                    className="apply-btn" 
                    type="submit" 
                    disabled={applyLoading || !resumeFile}
                    style={{
                      opacity: (!resumeFile || applyLoading) ? 0.6 : 1,
                      cursor: (!resumeFile || applyLoading) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {applyLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}

            {/* Success Message */}
            {applySuccess && (
              <div style={{
                color: '#059669',
                backgroundColor: '#d1fae5',
                padding: '0.75rem',
                borderRadius: '6px',
                margin: '1rem 0',
                fontSize: '1rem',
                textAlign: 'center',
                fontWeight: 500
              }}>
                {applySuccess}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SavedJobs; 