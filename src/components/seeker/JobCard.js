import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App';
import './JobCard.css';

function JobCard({ job }) {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  // Check if job is already saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      const seekerId = localStorage.getItem('seekerId');
      if (!seekerId) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/saved-jobs/check/${job.id}/${seekerId}`);
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.isSaved);
        } else if (response.status === 404) {
          // Backend not implemented yet, assume not saved
          setIsSaved(false);
        }
      } catch (error) {
        console.error('Error checking if job is saved:', error);
        // If backend is not running, assume not saved
        setIsSaved(false);
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
      const response = await fetch('http://localhost:8080/api/saved-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          seekerId: seekerId
        }),
      });
      
      if (response.ok) {
        setIsSaved(true);
      } else if (response.status === 404) {
        // Backend not implemented yet, show alert
        alert('Save functionality will be available once backend is implemented.');
      } else {
        console.error('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      // If backend is not running, show alert
      alert('Save functionality will be available once backend is implemented.');
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
      const response = await fetch(`http://localhost:8080/api/saved-jobs/${job.id}/${seekerId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setIsSaved(false);
      } else if (response.status === 404) {
        // Backend not implemented yet, show alert
        alert('Unsave functionality will be available once backend is implemented.');
      } else {
        console.error('Failed to unsave job');
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
      // If backend is not running, show alert
      alert('Unsave functionality will be available once backend is implemented.');
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
    // Automatically start the application process when modal opens
    handleApplyClick(e);
  };



  const handleCardClick = () => {
    // Job details page removed - no navigation needed
    // navigate(`/seeker/job/${job.id}`);
  };

  const handleApplyClick = async (e) => {
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
      const resp = await fetch(`http://localhost:8080/api/applications/check/${job.id}/${seekerId}`);
      
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
      formData.append('jobId', job.id);
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
    setShowApplyForm(false);
    setApplyError('');
    setApplySuccess('');
    setAlreadyApplied(false);
    setResumeFile(null);
  };

  return (
    <>
      <div className="job-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <h3>{job.title}</h3>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <div className="job-card-actions">
          <button className="apply-btn" onClick={handleApply}>Apply</button>
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`} 
            onClick={isSaved ? handleUnsaveJob : handleSaveJob}
            disabled={savingJob}
          >
            {savingJob ? '...' : (isSaved ? 'Saved' : 'Save')}
          </button>
        </div>
      </div>

      {/* Modal Popup for More Info and Apply */}
      {showModal && (
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
            }}>{job.title}</h3>
            <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Company:</strong> {job.company}</p>
            <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Location:</strong> {job.location}</p>
                         {job.description && <p style={{
              marginBottom:'1.2rem',
              color: theme === 'dark' ? '#cbd5e1' : '#374151',
              lineHeight: '1.6',
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '0.5rem',
              backgroundColor: theme === 'dark' ? '#334155' : '#f8fafc',
              borderRadius: '6px',
              border: theme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0'
            }}>{job.description}</p>}
            {job.salaryRange && <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Salary:</strong> {job.salaryRange}</p>}
            {job.jobType && <p style={{
              marginBottom:'0.7rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Job Type:</strong> {job.jobType}</p>}
            {job.experienceLevel && <p style={{
              marginBottom:'1.2rem',
              color: theme === 'dark' ? '#e2e8f0' : '#000'
            }}><strong style={{color: theme === 'dark' ? '#f1f5f9' : '#000'}}>Experience Level:</strong> {job.experienceLevel}</p>}

            {/* Apply Button or Upload Form */}
            {!showApplyForm && !alreadyApplied && !applySuccess && (
              <button className="apply-btn" onClick={handleApplyClick} disabled={checkingApplied}>
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

export default JobCard; 