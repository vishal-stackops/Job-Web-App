import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SeekerNavbar from './SeekerNavbar';
import './Profile.css';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { seekerId } = useParams();
  const [user, setUser] = useState(null);
  const [seekerInfo, setSeekerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!seekerId) {
      setError('No seeker ID found in URL. Please sign in again.');
      setLoading(false);
      return;
    }
    
    // Fetch both profile data and seeker info
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await fetch(`http://localhost:8080/api/profiles/seeker/${seekerId}`);
        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            throw new Error('Profile not found. Please complete your profile setup.');
          }
          throw new Error('Failed to fetch profile data');
        }
        
        const profileText = await profileResponse.text();
        console.log('Raw profile response:', profileText);
        
        let profileData;
        try {
          profileData = JSON.parse(profileText);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response that failed to parse:', profileText);
          throw new Error('Invalid profile data received from server');
        }
        
        setUser(profileData);
        
        // Fetch seeker info (name and email)
        const seekerResponse = await axios.get(`http://localhost:8080/api/seekers/${seekerId}`, {
          withCredentials: true
        });
        
        setSeekerInfo(seekerResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [seekerId]);

  const handleUpdateProfile = () => {
    navigate('/seeker/profile-setup');
  };

  if (loading) return (<><SeekerNavbar /><div className="profile-card-center"><div className="profile-card"><p>Loading profile...</p></div></div></>);
  if (error) return (<><SeekerNavbar /><div className="profile-card-center"><div className="profile-card"><p style={{color:'red'}}>{error}</p></div></div></>);

  if (!user) return (
    <>
      <SeekerNavbar />
      <div className="profile-card-center">
        <div className="profile-card">
          <p>Profile not found.</p>
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
            Complete Profile Setup
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <SeekerNavbar />
      <div className="profile-card-center">
        <div className="profile-card">
          <button className="profile-back-btn" onClick={() => navigate('/seeker')}>Back</button>
          <div className="profile-card-left">
            <img src={user.profilePicture || "https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128"} alt="Profile" className="profile-pic" />
            <h2 className="profile-name">{user.profileHeadline || 'User Profile'}</h2>
            
            {/* Display Name and Email */}
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

            {/* Update Profile Button */}
            <button className="update-profile-btn" onClick={handleUpdateProfile}>
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