import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Signin.css';

function Signin() {
  const [form, setForm] = useState({ email: '', password: '', isRecruiter: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const signupSuccess = location.state?.signupSuccess;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error
    
    const apiUrl = form.isRecruiter
      ? 'http://localhost:8080/api/recruiters/signin'
      : 'http://localhost:8080/api/seekers/signin';
    
    const payload = {
      email: form.email,
      password: form.password
    };
    
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        setError(errorText || 'Signin failed');
        return;
      }
      
      const responseText = await res.text();
      console.log('Raw signin response:', responseText); // Debug: log the raw response
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response that failed to parse:', responseText);
        setError(`Invalid JSON response: ${parseError.message}`);
        return;
      }
      
      if (form.isRecruiter) {
        // Clear any existing session data first
        localStorage.clear();
        localStorage.setItem('recruiterId', data.id);
        localStorage.setItem('recruiterName', data.name);
        navigate('/recruiter');
      } else {
        // Clear any existing session data first
        localStorage.clear();
        localStorage.setItem('seekerId', data.id);
        localStorage.setItem('seekerName', data.name);
        // Check if profile exists, if not redirect to profile setup
        try {
          const profileCheck = await fetch(`http://localhost:8080/api/profiles/check/${data.id}`);
          if (profileCheck.ok) {
            const profileData = await profileCheck.json();
            if (profileData.exists) {
              navigate('/seeker');
            } else {
              navigate('/seeker/profile-setup');
            }
          } else {
            // If profile check fails, redirect to profile setup
            navigate('/seeker/profile-setup');
          }
        } catch (err) {
          console.error('Profile check error:', err);
          // If error, redirect to profile setup
          navigate('/seeker/profile-setup');
        }
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError('Signin failed: ' + err.message);
    }
  };

  return (
    <div className="signin-gradient-bg">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="website-name">TalentHub</span>
          </Link>
        </div>
        <div className="navbar-right">
          <ThemeToggle />
          <Link to="/signin"><button className="nav-btn signin">Sign In</button></Link>
          <Link to="/signup"><button className="nav-btn signup">Sign Up</button></Link>
        </div>
      </nav>
      <div className="signin-container">
        <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {signupSuccess && (
          <div style={{
            color: '#22c55e',
            background: '#dcfce7',
            borderRadius: '8px',
            padding: '0.7rem 1rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            Signup successful! Please sign in.
          </div>
        )}
        {error && (
          <div style={{
            color: '#ef4444',
            background: '#fee2e2',
            borderRadius: '8px',
            padding: '0.7rem 1rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" name="isRecruiter" checked={form.isRecruiter} onChange={handleChange} />
          I am a recruiter
        </label>
        <button className="get-started-btn" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
