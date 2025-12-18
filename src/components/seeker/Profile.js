import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeekerNavbar from './SeekerNavbar';
import './Profile.css';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [seekerInfo, setSeekerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('seekerId');
    if (!id) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(`${API_BASE_URL}/api/profiles/seeker/${id}`, { withCredentials: true });

        if (!profileRes.data) {
          // First time: redirect to ProfileSetup
          navigate('/seeker/profile-setup');
          return;
        }

        setUser(profileRes.data);

        const seekerRes = await axios.get(`${API_BASE_URL}/api/seekers/${id}`, { withCredentials: true });
        setSeekerInfo(seekerRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <><SeekerNavbar /><div>Loading profile...</div></>;

  if (error) return <><SeekerNavbar /><div style={{ color: 'red' }}>{error}</div></>;

  return (
    <>
      <SeekerNavbar />
      <div className="profile-card-center">
        <div className="profile-card">
          <button className="profile-back-btn" onClick={() => navigate('/seeker')}>
            Back
          </button>

          <div className="profile-card-left">
            <img
              src={user.profilePicture || "https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128"}
              alt="Profile"
              className="profile-pic"
            />
            <h2 className="profile-name">{user.profileHeadline || 'User Profile'}</h2>

            {seekerInfo && (
              <div className="seeker-basic-info">
                <div><strong>Name:</strong> {seekerInfo.name || 'Not specified'}</div>
                <div><strong>Email:</strong> {seekerInfo.email || 'Not specified'}</div>
              </div>
            )}

            <button className="update-profile-btn" onClick={() => navigate('/seeker/profile-setup')}>
              Update Profile
            </button>
          </div>

          <div className="profile-card-right">
            <div className="profile-info-list">
              <div><strong>Location:</strong> {user.location || 'Not specified'}</div>
              <div><strong>Employment:</strong> {user.employment || 'Not specified'}</div>
              <div><strong>Experience Level:</strong> {user.experienceLevel || 'Not specified'}</div>
              <div><strong>Availability:</strong> {user.availability || 'Not specified'}</div>
              {user.phoneNumber && <div><strong>Phone:</strong> {user.phoneNumber}</div>}
              {user.skills && <div><strong>Skills:</strong> {user.skills}</div>}
              {user.education && <div><strong>Education:</strong> {user.education}</div>}
              <div><strong>Member Since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Profile;
