import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProfileSetup.css';
import axios from "axios";
import API_BASE_URL from "../../config/api";

function ProfileSetup( ) {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const mode = currentLocation.state?.mode || 'create';

  
  const [form, setForm] = useState({
    profilePicture: '',
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

  // useEffect(() => {
  //   const id = localStorage.getItem('seekerId');

  //   // 🔒 Not logged in
  //   if (!id) {
  //     navigate('/signin');
  //     return;
  //   }

  //   // ❌ NOT coming from Profile click
  //   if (!location.state?.fromProfile) {
  //     navigate('/seeker'); // dashboard
  //     return;
  //   }

  //   setSeekerId(id);
  //   setFetching(false);
  // }, [navigate, location]);

  useEffect(() => {
  const id = localStorage.getItem('seekerId');
  if (!id) {
    navigate('/signin');
    return;
  }
  setSeekerId(id);

  if (mode === 'update') {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(
          `${API_BASE_URL}/api/profiles/seeker/${id}`,
          { withCredentials: true }
        );

        if (profileRes.data) {
          setForm({
            profilePicture: profileRes.data.profilePicture || '',
            profileHeadline: profileRes.data.profileHeadline || '',
            location: profileRes.data.location || '',
            employment: profileRes.data.employment || '',
            skills: profileRes.data.skills || '',
            education: profileRes.data.education || '',
            experienceLevel: profileRes.data.experienceLevel || '',
            availability: profileRes.data.availability || '',
            phoneNumber: profileRes.data.phoneNumber || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }

  setFetching(false);
}, [navigate, mode]);


  
  useEffect(() => {
  const id = localStorage.getItem('seekerId');
  if (!id) {
    navigate('/signin');
    return;
  }
  setSeekerId(id);
  setFetching(false); // show form ONLY when user comes here
}, [navigate]);


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Preview
  const reader = new FileReader();
  reader.onload = () => {
    setForm(prev => ({ ...prev, profilePicture: reader.result, profileFile: file }));
  };
  reader.readAsDataURL(file);
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const formData = new FormData();
    formData.append('profileHeadline', form.profileHeadline);
    formData.append('location', form.location);
    formData.append('employment', form.employment);
    formData.append('skills', form.skills);
    formData.append('education', form.education);
    formData.append('experienceLevel', form.experienceLevel);
    formData.append('availability', form.availability);
    formData.append('phoneNumber', form.phoneNumber);

    if (form.profileFile) {
      formData.append('profilePicture', form.profileFile); // file upload
    }

    await axios.put(
      `${API_BASE_URL}/api/profiles/${seekerId}`,
      formData,
      { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
    );

    navigate('/seeker/profile'); // redirect to profile page

  } catch (err) {
    setError(err.response?.data?.message || 'Profile save failed');
  } finally {
    setLoading(false);
  }
};


  if (fetching) return null;

  return (
    <SeekerNavbar />
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <div className="profile-setup-header">
          <h1>{mode === 'update' ? 'Update Your Profile' : 'Complete Your Profile'}</h1>
          <p>{mode === 'update' ? 'Edit your information' : 'Tell us about yourself'}</p>

        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-setup-form">

          <div className="form-group">
  <label>Profile Picture</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) setForm(prev => ({ ...prev, profileFile: file }));
    }}
  />
  {form.profilePicture && (
    <img
      src={form.profilePicture}
      alt="Profile Preview"
      className="profile-preview"
      style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '0.5rem' }}
    />
  )}
</div>


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
            <label>Availability</label>
            <input
              name="availability"
              value={form.availability}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Employment</label>
            <input
              name="employment"
              value={form.employment}
              onChange={handleFormChange}
            />
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
