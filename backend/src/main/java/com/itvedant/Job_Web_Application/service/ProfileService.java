package com.itvedant.Job_Web_Application.service;

import com.itvedant.Job_Web_Application.entities.Profile;
import com.itvedant.Job_Web_Application.entities.Seeker;
import com.itvedant.Job_Web_Application.repository.ProfileRepository;
import com.itvedant.Job_Web_Application.repository.SeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private SeekerRepository seekerRepository;
    
    /**
     * Get profile by seeker ID
     */
    public Profile getProfileBySeekerId(Long seekerId) {
        return profileRepository.findBySeekerId(seekerId)
                .orElseThrow(() -> new RuntimeException("Profile not found for seeker ID: " + seekerId));
    }
    
    
    public boolean profileExists(Long seekerId) {
        return profileRepository.existsBySeekerId(seekerId);
    }
    
    
    /**
     * Create a new profile
     */
    public Profile createProfile(Long seekerId, Profile profileData) {
        // Check if seeker exists
        Seeker seeker = seekerRepository.findById(seekerId)
                .orElseThrow(() -> new RuntimeException("Seeker not found"));
        
        // Check if profile already exists
        if (profileRepository.existsBySeekerId(seekerId)) {
            throw new RuntimeException("Profile already exists for this seeker");
        }
        
        Profile profile = new Profile(seeker);
        profile.setProfilePicture(profileData.getProfilePicture());
        profile.setProfileHeadline(profileData.getProfileHeadline());
        profile.setLocation(profileData.getLocation());
        profile.setEmployment(profileData.getEmployment());
        profile.setSkills(profileData.getSkills());
        profile.setEducation(profileData.getEducation());
        profile.setExperienceLevel(profileData.getExperienceLevel());
        profile.setAvailability(profileData.getAvailability());
        profile.setPhoneNumber(profileData.getPhoneNumber());
        
        return profileRepository.save(profile);
    }
    
    /**
     * Update an existing profile
     */
    public Profile updateProfile(Long profileId, Profile profileData) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        profile.setProfilePicture(profileData.getProfilePicture());
        profile.setProfileHeadline(profileData.getProfileHeadline());
        profile.setLocation(profileData.getLocation());
        profile.setEmployment(profileData.getEmployment());
        profile.setSkills(profileData.getSkills());
        profile.setEducation(profileData.getEducation());
        profile.setExperienceLevel(profileData.getExperienceLevel());
        profile.setAvailability(profileData.getAvailability());
        profile.setPhoneNumber(profileData.getPhoneNumber());
        
        return profileRepository.save(profile);
    }
    
//    For Update to pfofile
    
    public Profile updateProfileBySeekerId(Long seekerId, Profile profileData) {
        // Find existing profile by seeker ID
        Profile existingProfile = getProfileBySeekerId(seekerId);
        
        // Update the existing profile with new data
        existingProfile.setProfilePicture(profileData.getProfilePicture());
        existingProfile.setProfileHeadline(profileData.getProfileHeadline());
        existingProfile.setLocation(profileData.getLocation());
        existingProfile.setEmployment(profileData.getEmployment());
        existingProfile.setSkills(profileData.getSkills());
        existingProfile.setEducation(profileData.getEducation());
        existingProfile.setExperienceLevel(profileData.getExperienceLevel());
        existingProfile.setAvailability(profileData.getAvailability());
        existingProfile.setPhoneNumber(profileData.getPhoneNumber());
        
        // Save and return the updated profile
        return profileRepository.save(existingProfile);
    }
    
    /**
     * Get all profiles
     */
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }
    
    /**
     * Delete profile
     */
    public void deleteProfile(Long profileId) {
        if (!profileRepository.existsById(profileId)) {
            throw new RuntimeException("Profile not found");
        }
        profileRepository.deleteById(profileId);
    }
}