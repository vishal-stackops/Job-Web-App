import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Signin.css';
import axios from "axios";
import API_BASE_URL from "../config/api";

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
    setError('');

    const apiUrl = form.isRecruiter
      ? `${API_BASE_URL}/api/recruiters/signin`
      : `${API_BASE_URL}/api/seekers/signin`;

    const payload = {
      email: form.email,
      password: form.password
    };

    try {
      const res = await axios.post(apiUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      const data = res.data;

      if (form.isRecruiter) {
        localStorage.clear();
        localStorage.setItem('recruiterId', data.id);
        localStorage.setItem('recruiterName', data.name);
        navigate('/recruiter');
      } else {
        localStorage.clear();
        localStorage.setItem('seekerId', data.id);
        localStorage.setItem('seekerName', data.name);

        // Always go to dashboard
        navigate('/seeker');

      //   // Minimal safe change: profile check
      //   try {
      //     const profileCheck = await axios.get(
      //       `${API_BASE_URL}/api/profiles/check/${data.id}`,
      //       { withCredentials: true }
      //     );

      //     if (profileCheck.data.exists) {
      //       navigate('/seeker'); // existing user → dashboard
      //     } else {
      //       navigate('/seeker/profile-setup'); // new user → setup form
      //     }
      //   } catch (err) {
      //     console.error('Profile check error:', err);
      //     navigate('/seeker/profile-setup'); // fallback → setup form
      //   }
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Signin failed'
      );
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
            <input
              type="checkbox"
              name="isRecruiter"
              checked={form.isRecruiter}
              onChange={handleChange}
            />
            I am a recruiter
          </label>

          <button className="get-started-btn" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
