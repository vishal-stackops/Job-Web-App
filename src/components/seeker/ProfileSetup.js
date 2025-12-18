import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSetup.css';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function ProfileSetup() {
  const navigate = useNavigate();
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
  const [imagePreview, setImagePreview] = useState(form.profilePicture);

  // ✅ ONLY AUTH CHECK — NO PROFILE CHECK HERE
  useEffect(() => {
    const id = localStorage.getItem('seekerId');
    if (!id) {
      navigate('/signin');
      return;
    }
    setSeekerId(id);
    setFetching(false);
  }, [navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'profilePicture') setImagePreview(value);
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

      // ✅ AFTER FIRST TIME PROFILE CREATION → PROFILE PAGE
      navigate('/seeker/profile');

    } catch (err) {
      setError(err.response?.data?.message || 'Profile save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading...</div>;

  return (
    <SeekerNavbar/>
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <div className="profile-setup-header">
          <h1>Complete Your Profile</h1>
          <p>Tell us about yourself</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-setup-form">

          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Profile Headline</label>
              <input
                name="profileHeadline"
                value={form.profileHeadline}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Education</label>
              <input
                name="education"
                value={form.education}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleFormChange}
              >
                <option value="">Select</option>
                <option value="ENTRY">Entry</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
