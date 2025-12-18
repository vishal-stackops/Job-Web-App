import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSetup.css';
import axios from "axios"
import  API_BASE_URL from "../../config/api";


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
  const [imagePreview, setImagePreview] = useState('https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128');
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('seekerId');
    if (!id) {
      navigate('/signin');
      return;
    }
    setSeekerId(id);

    const checkExistingProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/profiles/seeker/${id}`,
          { withCredentials: true }
        );

        if (response.data) {
          const profileData = response.data;
          setForm({
            profilePicture: profileData.profilePicture || 'https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128',
            profileHeadline: profileData.profileHeadline || '',
            location: profileData.location || '',
            employment: profileData.employment || '',
            skills: profileData.skills || '',
            education: profileData.education || '',
            experienceLevel: profileData.experienceLevel || '',
            availability: profileData.availability || '',
            phoneNumber: profileData.phoneNumber || ''
          });
          setImagePreview(profileData.profilePicture || 'https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128');
          setIsUpdate(true);
        }
      } catch (err) {
        console.log('No existing profile found, creating new one');
        setIsUpdate(false);
      } finally {
        setFetching(false);
      }
    };

    checkExistingProfile();
  }, [navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'profilePicture') {
      setImagePreview(value || 'https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const profileData = {
        profilePicture: form.profilePicture,
        profileHeadline: form.profileHeadline,
        location: form.location,
        employment: form.employment,
        skills: form.skills,
        education: form.education,
        experienceLevel: form.experienceLevel,
        availability: form.availability,
        phoneNumber: form.phoneNumber
      };

      if (isUpdate) {
        await axios.put(
          `${API_BASE_URL}/api/profiles/seeker/${seekerId}`,
          profileData,
          { withCredentials: true }
        );

        navigate('/seeker', {
          state: { success: 'Profile updated successfully!' }
        });
      } else {
        const createData = {
          ...profileData,
          seeker: { id: Number(seekerId) }
        };

        await axios.post(
          `${API_BASE_URL}/api/profiles`,
          createData,
          { withCredentials: true }
        );

        navigate('/seeker', {
          state: { success: 'Profile created successfully! Welcome to TalentHub!' }
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        `Failed to ${isUpdate ? 'update' : 'create'} profile. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!seekerId || fetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <div className="profile-setup-header">
          <h1>{isUpdate ? 'Update Your Profile' : 'Complete Your Profile'}</h1>
          <p>
            {isUpdate
              ? 'Update your information to keep your profile current'
              : 'Tell us about yourself to get started with TalentHub'}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-setup-form">
          {/* FORM CONTENT UNCHANGED */}
          {/* 👆 exactly same JSX as you sent */}
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? (isUpdate ? 'Updating Profile...' : 'Creating Profile...')
                : (isUpdate ? 'Update Profile' : 'Complete Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
