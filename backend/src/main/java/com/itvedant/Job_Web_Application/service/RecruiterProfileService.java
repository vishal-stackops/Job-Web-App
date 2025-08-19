package com.itvedant.Job_Web_Application.service;

import com.itvedant.Job_Web_Application.entities.RecruiterProfile;
import com.itvedant.Job_Web_Application.repository.RecruiterProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RecruiterProfileService {
    
    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;
    
    /**
     * Get profile by recruiter ID
     */
    public Optional<RecruiterProfile> getProfileByRecruiterId(Long recruiterId) {
        System.out.println("Getting recruiter profile for ID: " + recruiterId);
        try {
            Optional<RecruiterProfile> profile = recruiterProfileRepository.findByRecruiterId(recruiterId);
            if (profile.isPresent()) {
                System.out.println("Profile found: " + profile.get());
            } else {
                System.out.println("No profile found for recruiter ID: " + recruiterId);
            }
            return profile;
        } catch (Exception e) {
            System.err.println("Error getting profile for recruiter ID " + recruiterId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error retrieving recruiter profile: " + e.getMessage());
        }
    }
    
    /**
     * Check if profile exists for recruiter
     */
    public boolean profileExists(Long recruiterId) {
        System.out.println("Checking if profile exists for recruiter ID: " + recruiterId);
        try {
            boolean exists = recruiterProfileRepository.existsByRecruiterId(recruiterId);
            System.out.println("Profile exists for recruiter ID " + recruiterId + ": " + exists);
            return exists;
        } catch (Exception e) {
            System.err.println("Error checking profile existence for recruiter ID " + recruiterId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error checking profile existence: " + e.getMessage());
        }
    }
    
    /**
     * Create new profile
     */
    public RecruiterProfile createProfile(RecruiterProfile profile) {
        System.out.println("Creating new profile for recruiter ID: " + profile.getRecruiterId());
        System.out.println("Profile data: " + profile);
        
        try {
            // Check if profile already exists
            if (recruiterProfileRepository.existsByRecruiterId(profile.getRecruiterId())) {
                System.err.println("Profile already exists for recruiter ID: " + profile.getRecruiterId());
                throw new RuntimeException("Profile already exists for this recruiter");
            }
            
            RecruiterProfile savedProfile = recruiterProfileRepository.save(profile);
            System.out.println("Profile created successfully: " + savedProfile);
            return savedProfile;
        } catch (RuntimeException e) {
            System.err.println("Runtime exception while creating profile: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error creating profile: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create recruiter profile: " + e.getMessage());
        }
    }
    
    /**
     * Update existing profile
     */
    public RecruiterProfile updateProfile(Long recruiterId, RecruiterProfile updatedProfile) {
        System.out.println("Updating profile for recruiter ID: " + recruiterId);
        System.out.println("Updated profile data: " + updatedProfile);
        
        try {
            Optional<RecruiterProfile> existingProfile = recruiterProfileRepository.findByRecruiterId(recruiterId);
            
            if (existingProfile.isPresent()) {
                System.out.println("Existing profile found, updating fields...");
                RecruiterProfile profile = existingProfile.get();
                
                // Update fields
                profile.setName(updatedProfile.getName());
                profile.setEmail(updatedProfile.getEmail());
                profile.setCompanyName(updatedProfile.getCompanyName());
                profile.setPhoneNumber(updatedProfile.getPhoneNumber());
                profile.setPosition(updatedProfile.getPosition());
                profile.setCompanyDescription(updatedProfile.getCompanyDescription());
                profile.setLinkedinProfile(updatedProfile.getLinkedinProfile());
                profile.setWebsite(updatedProfile.getWebsite());
                
                RecruiterProfile savedProfile = recruiterProfileRepository.save(profile);
                System.out.println("Profile updated successfully: " + savedProfile);
                return savedProfile;
            } else {
                System.out.println("No existing profile found, creating new profile...");
                // Create new profile if doesn't exist
                updatedProfile.setRecruiterId(recruiterId);
                RecruiterProfile savedProfile = recruiterProfileRepository.save(updatedProfile);
                System.out.println("New profile created: " + savedProfile);
                return savedProfile;
            }
        } catch (Exception e) {
            System.err.println("Error updating profile: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update recruiter profile: " + e.getMessage());
        }
    }
    
    /**
     * Delete profile
     */
    public void deleteProfile(Long recruiterId) {
        System.out.println("Deleting profile for recruiter ID: " + recruiterId);
        try {
            recruiterProfileRepository.deleteByRecruiterId(recruiterId);
            System.out.println("Profile deleted successfully for recruiter ID: " + recruiterId);
        } catch (Exception e) {
            System.err.println("Error deleting profile: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete recruiter profile: " + e.getMessage());
        }
    }
}