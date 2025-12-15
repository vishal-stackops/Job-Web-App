import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../config/axios";
// import API_BASE_URL from "../config/axios";

export const useProfileCheck = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [seekerId, setSeekerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const id = localStorage.getItem('seekerId');
        if (!id) {
          navigate('/signin');
          return;
        }

        setSeekerId(id);

        // Check if profile exists
        const profileCheck = await fetch(`http://${API_BASE_URL}/api/profiles/check/${id}`);
        if (profileCheck.ok) {
          const profileData = await profileCheck.json();
          setHasProfile(profileData.exists);
          
          if (!profileData.exists) {
            // Profile doesn't exist, redirect to profile setup
            navigate('/seeker/profile-setup');
            return;
          }
        } else {
          // If profile check fails, redirect to profile setup
          navigate('/seeker/profile-setup');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Profile check error:', error);
        // If error, redirect to profile setup
        navigate('/seeker/profile-setup');
      }
    };

    checkProfile();
  }, [navigate]);

  return { isChecking, hasProfile, seekerId };
}; 
