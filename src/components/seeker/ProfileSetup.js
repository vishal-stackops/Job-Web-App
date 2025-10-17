import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfileSetup.css';

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
    
    // Check if profile already exists and fetch data
    const checkExistingProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profiles/seeker/${id}`, {
          withCredentials: true
        });
        
        if (response.data) {
          // Profile exists, pre-fill the form
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
        // Profile doesn't exist, this is a new profile creation
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

    // Update image preview when profile picture URL changes
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
        // Update existing profile using PUT method
        await axios.put(`http://localhost:8080/api/profiles/seeker/${seekerId}`, profileData, {
          withCredentials: true
        });
        
        // Redirect to seeker home with success message
        navigate('/seeker', { 
          state: { success: 'Profile updated successfully!' }
        });
      } else {
        // Create new profile
        const createData = {
          ...profileData,
          seeker: { id: Number(seekerId) }
        };
        
        await axios.post('http://localhost:8080/api/profiles', createData, {
          withCredentials: true
        });

        // Redirect to seeker home with success message
        navigate('/seeker', { 
          state: { success: 'Profile created successfully! Welcome to TalentHub!' }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isUpdate ? 'update' : 'create'} profile. Please try again.`);
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
          <p>{isUpdate ? 'Update your information to keep your profile current' : 'Tell us about yourself to get started with TalentHub'}</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-setup-form">
          <div className="form-section">
            <h3>Profile Picture</h3>
            
            <div className="profile-picture-section">
              <div className="profile-picture-preview">
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="profile-picture-preview-img"
                  onError={() => setImagePreview('https://ui-avatars.com/api/?name=U&background=6366f1&color=fff&size=128')}
                />
              </div>
              <div className="profile-picture-upload">
                <div className="form-group">
                  <label htmlFor="profilePicture">Profile Picture URL</label>
                  <input
                    type="url"
                    id="profilePicture"
                    name="profilePicture"
                    value={form.profilePicture}
                    onChange={handleFormChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="profile-picture-input"
                  />
                  <small className="upload-hint">
                    Enter a direct link to your profile picture (JPG, PNG, GIF)
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="profileHeadline">Professional Headline *</label>
              <input
                type="text"
                id="profileHeadline"
                name="profileHeadline"
                value={form.profileHeadline}
                onChange={handleFormChange}
                placeholder="e.g., Senior Software Developer"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleFormChange}
                placeholder="e.g., New York, NY"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleFormChange}
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Details</h3>
            
            <div className="form-group">
              <label htmlFor="employment">Current Employment Status *</label>
              <select
                id="employment"
                name="employment"
                value={form.employment}
                onChange={handleFormChange}
                required
              >
                <option value="">Select employment status</option>
                <option value="EMPLOYED">Currently Employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="STUDENT">Student</option>
                <option value="FREELANCER">Freelancer</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level *</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleFormChange}
                required
              >
                <option value="">Select experience level</option>
                <option value="ENTRY">Entry Level (0-2 years)</option>
                <option value="MID">Mid Level (3-5 years)</option>
                <option value="SENIOR">Senior Level (6-10 years)</option>
                <option value="EXPERT">Expert Level (10+ years)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="availability">Availability *</label>
              <select
                id="availability"
                name="availability"
                value={form.availability}
                onChange={handleFormChange}
                required
              >
                <option value="">Select availability</option>
                <option value="IMMEDIATE">Immediately Available</option>
                <option value="TWO_WEEKS">Available in 2 weeks</option>
                <option value="ONE_MONTH">Available in 1 month</option>
                <option value="THREE_MONTHS">Available in 3 months</option>
                <option value="NOT_AVAILABLE">Not currently available</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Skills & Education</h3>
            
            <div className="form-group">
              <label htmlFor="skills">Skills *</label>
              <textarea
                id="skills"
                name="skills"
                value={form.skills}
                onChange={handleFormChange}
                placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
                rows="3"
                required
              />
              <small>Separate skills with commas</small>
            </div>

            <div className="form-group">
              <label htmlFor="education">Education</label>
              <textarea
                id="education"
                name="education"
                value={form.education}
                onChange={handleFormChange}
                placeholder="e.g., Bachelor's in Computer Science from XYZ University"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (isUpdate ? 'Updating Profile...' : 'Creating Profile...') : (isUpdate ? 'Update Profile' : 'Complete Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup; 