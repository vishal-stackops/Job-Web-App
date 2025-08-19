import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, createContext } from 'react';
import Welcome from './components/Welcome';
import Signup from './components/Signup';
import Signin from './components/Signin';
import SeekerHome from './components/seeker/SeekerHome';
import RecruiterHome from './components/recruiter/RecruiterHome';
// import ThemeToggle from './components/ThemeToggle';
import Search from './components/seeker/Search.js';
// import JobDetails from './components/seeker/JobDetails';
import Profile from './components/seeker/Profile';
import MyApplications from './components/seeker/MyApplications';
import SavedJobs from './components/seeker/SavedJobs';
import ProfileSetup from './components/seeker/ProfileSetup';
import AddJob from './components/recruiter/AddJob';
import RecruiterProfile from './components/recruiter/RecruiterProfile';
import RecruiterProfileUpdate from './components/recruiter/RecruiterProfileUpdate';
import Applications from './components/recruiter/Applications';

import './components/seeker/SavedJobs.css';
import './components/seeker/Search.css';

export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`App ${theme}-theme`}>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/seeker/search" element={<Search />} />
            {/* <Route path="/seeker/job/:id" element={<JobDetails />} /> */}
            <Route path="/seeker/profile" element={<Profile />} />
            <Route path="/seeker/profile/seeker/:seekerId" element={<Profile />} />
            <Route path="/seeker/profile-setup" element={<ProfileSetup />} />
            <Route path="/seeker/applications" element={<MyApplications />} />
            <Route path="/seeker/saved" element={<SavedJobs />} />
            <Route path="/seeker/*" element={<SeekerHome />} />
            <Route path="/recruiter/*" element={<RecruiterHome />} />
            <Route path="/recruiter/add" element={<AddJob />} />
            <Route path="/recruiter/applications" element={<Applications />} />
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            <Route path="/recruiter/profile/recruiter/:recruiterId" element={<RecruiterProfile />} />
            <Route path="/recruiter/profile/recruiter/:recruiterId/update" element={<RecruiterProfileUpdate />} />

          </Routes>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
