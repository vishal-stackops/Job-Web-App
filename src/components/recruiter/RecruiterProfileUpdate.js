import React, { useState, useEffect } from 'react';
import RecruiterNavbar from './RecruiterNavbar';
import './RecruiterProfileUpdate.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function RecruiterProfileUpdate() {
  const { recruiterId: paramRecruiterId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    position: '',
    companyName: '',
    companyDescription: '',
    linkedinProfile: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const recruiterId = paramRecruiterId || localStorage.getItem('recruiterId');
    if (!recruiterId) {
      setError('Recruiter not logged in.');
      setLoading(false);
      return;
    }
    fetchProfile(recruiterId);
  }, [paramRecruiterId]);

  const fetchProfile = async (recruiterId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:8080/api/recruiters/${recruiterId}/profile`);
      setProfile(res.data);
    } catch (err) {
      setError('Profile not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const recruiterId = paramRecruiterId || localStorage.getItem('recruiterId');
    
    try {
      console.log('Sending profile update request:', profile);
      const response = await axios.put(`http://localhost:8080/api/recruiters/${recruiterId}/profile`, profile, { 
        withCredentials: true 
      });
      console.log('Profile update response:', response);
      setSuccess('Profile updated successfully! Redirecting to profile page...');
      setTimeout(() => {
        navigate(`/recruiter/profile/recruiter/${recruiterId}`);
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const recruiterId = paramRecruiterId || localStorage.getItem('recruiterId');
    navigate(`/recruiter/profile/recruiter/${recruiterId}`);
  };

  if (loading) {
    return (
      <>
        <RecruiterNavbar />
        <div className="recruiter-profile-update-container">
          <div className="recruiter-profile-update-form-container">
            <div className="recruiter-profile-update-form">
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RecruiterNavbar />
      <div className="recruiter-profile-update-container">
        <div className="recruiter-profile-update-form-container">
          <div className="recruiter-profile-update-form">
            <h2>Update Profile</h2>
            <p className="profile-subtitle">Update your recruiter profile information</p>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <label>
                    Full Name
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
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
                      value={profile.phoneNumber || ''}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Position
                    <input
                      type="text"
                      name="position"
                      value={profile.position}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Company Information</h3>
                <div className="form-row">
                  <label>
                    Company Name
                    <input
                      type="text"
                      name="companyName"
                      value={profile.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Company Description
                    <textarea
                      name="companyDescription"
                      value={profile.companyDescription || ''}
                      onChange={handleInputChange}
                      placeholder="Describe your company..."
                    />
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Professional Links</h3>
                <div className="form-row">
                  <label>
                    LinkedIn Profile
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={profile.linkedinProfile || ''}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </label>
                  <label>
                    Website
                    <input
                      type="url"
                      name="website"
                      value={profile.website || ''}
                      onChange={handleInputChange}
                      placeholder="https://yourcompany.com"
                    />
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecruiterProfileUpdate; 