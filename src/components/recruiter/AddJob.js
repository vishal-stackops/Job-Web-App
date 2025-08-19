import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterNavbar from './RecruiterNavbar';
import axios from 'axios';
import './AddJob.css';

function AddJob() {
  const navigate = useNavigate();
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salaryRange: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID'
  });
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState('');

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    setJobLoading(true);
    setJobError('');

    const recruiterId = localStorage.getItem('recruiterId');
    if (!recruiterId) {
      setJobError('Recruiter not logged in.');
      setJobLoading(false);
      return;
    }

    try {
    const jobData = {
        ...jobForm,
        recruiter: { id: parseInt(recruiterId) }
    };

      console.log('Sending job data:', jobData); // Debug log

      const response = await axios.post('http://localhost:8080/api/jobs', jobData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Job created successfully:', response.data); // Debug log
      
      // Job created successfully, redirect to recruiter home
      navigate('/recruiter');
    } catch (err) {
      console.error('Error creating job:', err); // Debug log
      console.error('Error response:', err.response); // Debug log
      
      if (err.response?.status === 500) {
        setJobError('Server error: ' + (err.response?.data?.message || 'Internal server error. Please check your backend logs.'));
      } else if (err.response?.status === 400) {
        setJobError('Validation error: ' + (err.response?.data?.message || 'Please check your input data.'));
      } else if (err.response?.status === 404) {
        setJobError('API not found. Please check if your backend is running.');
      } else if (err.code === 'ERR_NETWORK') {
        setJobError('Network error: Cannot connect to backend server. Please check if your Spring Boot application is running.');
      } else {
        setJobError('Error: ' + (err.response?.data?.message || err.message || 'Failed to create job'));
      }
    } finally {
      setJobLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recruiter');
  };

  return (
    <>
      <RecruiterNavbar />
      <div className="add-job-container">
        <div className="add-job-content">
          <form className="add-job-form" onSubmit={handleAddJob}>
            {jobError && (
              <div className="error-message">
                {jobError}
              </div>
            )}

            <div className="form-section">
              <h3>Job Details</h3>
              <div className="form-row">
          <label>
                  Job Title *
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleJobFormChange}
                    placeholder="e.g., Mobile App Developer"
                    required
                  />
          </label>
          <label>
                  Company *
                  <input
                    type="text"
                    name="company"
                    value={jobForm.company}
                    onChange={handleJobFormChange}
                    placeholder="e.g., AppWorks"
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Location *
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleJobFormChange}
                    placeholder="e.g., Seattle, WA"
                    required
                  />
          </label>
          <label>
                  Salary Range
                  <input
                    type="text"
                    name="salaryRange"
                    value={jobForm.salaryRange}
                    onChange={handleJobFormChange}
                    placeholder="e.g., $75,000 - $125,000"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Job Type *
                  <select
                    name="jobType"
                    value={jobForm.jobType}
                    onChange={handleJobFormChange}
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
          </label>
          <label>
                  Experience Level *
                  <select
                    name="experienceLevel"
                    value={jobForm.experienceLevel}
                    onChange={handleJobFormChange}
                    required
                  >
                    <option value="ENTRY">Entry Level</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior Level</option>
                    <option value="EXECUTIVE">Executive Level</option>
                  </select>
                </label>
              </div>
              <label>
                Job Description *
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobFormChange}
                  placeholder="Describe the job responsibilities, requirements, and qualifications..."
                  rows="8"
                  required
                />
          </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={jobLoading}
              >
                {jobLoading ? 'Creating...' : 'Create Job'}
              </button>
            </div>
        </form>
        </div>
      </div>
    </>
  );
}

export default AddJob; 