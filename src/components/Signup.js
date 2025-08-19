import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Signup.css';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', isRecruiter: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const apiUrl = form.isRecruiter
      ? 'http://localhost:8080/api/recruiters/signup'
      : 'http://localhost:8080/api/seekers/signup';
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password
    };
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Signup failed');
      const data = await res.json();
      if (form.isRecruiter) {
        navigate('/signin', { state: { signupSuccess: true, role: 'recruiter' } });
      } else {
        navigate('/signin', { state: { signupSuccess: true, role: 'seeker' } });
      }
    } catch (err) {
      alert('Signup failed: ' + err.message);
    }
  };

  return (
    <div className="signup-gradient-bg">
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
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
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
        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" name="isRecruiter" checked={form.isRecruiter} onChange={handleChange} />
          I am a recruiter
        </label>
        <button className="get-started-btn" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
