import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProfileSetup.css';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    profilePicture: 'https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128',
    profileHeadline: '',
    location: '',
    employment: '',
    skills: '',
    education: '',
    experienceLevel: '',
    availability: '',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [seekerId, setSeekerId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('seekerId');

    // 🔒 Not logged in
    if (!id) {
      navigate('/signin');
      return;
    }

    // ❌ NOT coming from Profile click
    if (!location.state?.fromProfile) {
      navigate('/seeker'); // dashboard
      return;
    }

    setSeekerId(id);
    setFetching(false);
  }, [navigate, location]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_BASE_URL}/api/profiles`,
        { ...form, seeker: { id: Number(seekerId) } },
        { withCredentials: true }
      );

      // ✅ After first completion → profile page
      navigate('/seeker/profile');

    } catch (err) {
      setError(err.response?.data?.message || 'Profile save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return null;

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <div className="profile-setup-header">
          <h1>Complete Your Profile</h1>
          <p>Tell us about yourself</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-setup-form">

          <div className="form-group">
            <label>Profile Headline</label>
            <input name="profileHeadline" value={form.profileHeadline} onChange={handleFormChange} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleFormChange} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleFormChange} />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input name="skills" value={form.skills} onChange={handleFormChange} />
          </div>

          <div className="form-group">
            <label>Education</label>
            <input name="education" value={form.education} onChange={handleFormChange} />
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select name="experienceLevel" value={form.experienceLevel} onChange={handleFormChange}>
              <option value="">Select</option>
              <option value="ENTRY">Entry</option>
              <option value="MID">Mid</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
