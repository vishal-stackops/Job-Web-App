import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SeekerNavbar from './SeekerNavbar';
import './Profile.css';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function Profile() {
  const navigate = useNavigate();
  const { seekerId } = useParams();
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

    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(
          `${API_BASE_URL}/api/profiles/seeker/${id}`
        );
        setUser(profileResponse.data);

        const seekerResponse = await axios.get(
          `${API_BASE_URL}/api/seekers/${id}`,
          { withCredentials: true }
        );
        setSeekerInfo(seekerResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError('Profile not found.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, seekerId]);

  if (loading) return (
    <>
      <SeekerNavbar />
      <div className="profile-card-center">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <SeekerNavbar />
      <div className="profile-card-center">
        <div className="profile-card">
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
          )}

          {user ? (
            <>
              <div className="profile-card-left">
                <img
                  src={user.profilePicture || "https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128"}
                  alt="Profile"
                  className="profile-pic"
                />
                <h2 className="profile-name">{user.profileHeadline || 'User Profile'}</h2>

                {seekerInfo && (
                  <div className="seeker-basic-info">
                    <div className="info-item">
                      <strong>Name:</strong> {seekerInfo.name || 'Not specified'}
                    </div>
                    <div className="info-item">
                      <strong>Email:</strong> {seekerInfo.email || 'Not specified'}
                    </div>
                  </div>
                )}
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
                  <div>
                    <strong>Member Since:</strong>{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/seeker/profile-setup')}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Complete Profile
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
