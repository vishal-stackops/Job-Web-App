import React, { useEffect, useState } from 'react';
import RecruiterNavbar from './RecruiterNavbar';
import './RecruiterProfile.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function RecruiterProfile() {
  const { recruiterId: paramRecruiterId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <>
      <RecruiterNavbar />
      <div className="recruiter-profile-container">
        <div className="recruiter-profile-form-container">
          <div className="recruiter-profile-form read-only-profile">
            <h2>My Profile</h2>
            {loading && <p>Loading profile...</p>}
            {error && <div className="error-message">{error}</div>}
            {profile && !loading && !error && (
              <>
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="profile-row">
                    <div><strong>Full Name:</strong> {profile.name}</div>
                    <div><strong>Email:</strong> {profile.email}</div>
                  </div>
                  <div className="profile-row">
                    <div><strong>Phone Number:</strong> {profile.phoneNumber || '-'}</div>
                    <div><strong>Position:</strong> {profile.position}</div>
                  </div>
                </div>
                <div className="form-section">
                  <h3>Company Information</h3>
                  <div className="profile-row">
                    <div><strong>Company Name:</strong> {profile.companyName}</div>
                  </div>
                  <div className="profile-row">
                    <div><strong>Company Description:</strong> {profile.companyDescription || '-'}</div>
                  </div>
                </div>
                <div className="form-section">
                  <h3>Professional Links</h3>
                  <div className="profile-row">
                    <div><strong>LinkedIn:</strong> {profile.linkedinProfile ? <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer">{profile.linkedinProfile}</a> : '-'}</div>
                    <div><strong>Website:</strong> {profile.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a> : '-'}</div>
                  </div>
                </div>
                <div className="profile-actions">
                  <button 
                    className="update-profile-btn" 
                    onClick={() => navigate(`/recruiter/profile/recruiter/${paramRecruiterId || localStorage.getItem('recruiterId')}/update`)}
                  >
                    Update Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RecruiterProfile; 