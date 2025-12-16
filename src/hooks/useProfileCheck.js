import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../config/api";

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

        // Check if profile exists using axios
        const response = await axios.get(`/api/profiles/check/${id}`, { withCredentials: true });

        if (response.data && response.data.exists) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
          navigate('/seeker/profile-setup');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Profile check error:', error);
        navigate('/seeker/profile-setup');
      }
    };

    checkProfile();
  }, [navigate]);

  return { isChecking, hasProfile, seekerId };
};
