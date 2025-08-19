package com.itvedant.Job_Web_Application.controller;

import com.itvedant.Job_Web_Application.entities.Profile;
import com.itvedant.Job_Web_Application.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;
    
    /**
     * GET /api/profiles/seeker/{seekerId}
     * Get profile by seeker ID
     */
    @GetMapping("/seeker/{seekerId}")
    public ResponseEntity<?> getProfileBySeeker(@PathVariable Long seekerId) {
        try {
            Profile profile = profileService.getProfileBySeekerId(seekerId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/check/{seekerId}")
    public ResponseEntity<?> checkProfileExists(@PathVariable Long seekerId) {
        try {
            boolean exists = profileService.profileExists(seekerId);
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error checking profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * POST /api/profiles
     * Create a new profile
     */
    @PostMapping
    public ResponseEntity<?> createProfile(@RequestBody Map<String, Object> request) {
        try {
            Long seekerId = Long.valueOf(request.get("seeker").toString().replaceAll("[^0-9]", ""));
            
            Profile profileData = new Profile();
            profileData.setProfilePicture((String) request.get("profilePicture"));
            profileData.setProfileHeadline((String) request.get("profileHeadline"));
            profileData.setLocation((String) request.get("location"));
            profileData.setEmployment((String) request.get("employment"));
            profileData.setSkills((String) request.get("skills"));
            profileData.setEducation((String) request.get("education"));
            profileData.setExperienceLevel((String) request.get("experienceLevel"));
            profileData.setAvailability((String) request.get("availability"));
            profileData.setPhoneNumber((String) request.get("phoneNumber"));
            
            Profile profile = profileService.createProfile(seekerId, profileData);
            return ResponseEntity.status(HttpStatus.CREATED).body(profile);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * PUT /api/profiles/seeker/{seekerId}
     * Update profile by seeker ID
     */
    @PutMapping("/seeker/{seekerId}")
    public ResponseEntity<?> updateProfileBySeeker(@PathVariable Long seekerId, @RequestBody Map<String, Object> request) {
        try {
            Profile profileData = new Profile();
            profileData.setProfilePicture((String) request.get("profilePicture"));
            profileData.setProfileHeadline((String) request.get("profileHeadline"));
            profileData.setLocation((String) request.get("location"));
            profileData.setEmployment((String) request.get("employment"));
            profileData.setSkills((String) request.get("skills"));
            profileData.setEducation((String) request.get("education"));
            profileData.setExperienceLevel((String) request.get("experienceLevel"));
            profileData.setAvailability((String) request.get("availability"));
            profileData.setPhoneNumber((String) request.get("phoneNumber"));
            
            Profile profile = profileService.updateProfileBySeekerId(seekerId, profileData);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * PUT /api/profiles/{profileId}
     * Update an existing profile
     */
    @PutMapping("/{profileId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long profileId, @RequestBody Map<String, Object> request) {
        try {
            Profile profileData = new Profile();
            profileData.setProfilePicture((String) request.get("profilePicture"));
            profileData.setProfileHeadline((String) request.get("profileHeadline"));
            profileData.setLocation((String) request.get("location"));
            profileData.setEmployment((String) request.get("employment"));
            profileData.setSkills((String) request.get("skills"));
            profileData.setEducation((String) request.get("education"));
            profileData.setExperienceLevel((String) request.get("experienceLevel"));
            profileData.setAvailability((String) request.get("availability"));
            profileData.setPhoneNumber((String) request.get("phoneNumber"));
            
            Profile profile = profileService.updateProfile(profileId, profileData);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * GET /api/profiles
     * Get all profiles
     */
    @GetMapping
    public ResponseEntity<?> getAllProfiles() {
        try {
            List<Profile> profiles = profileService.getAllProfiles();
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving profiles: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * DELETE /api/profiles/{profileId}
     * Delete a profile
     */
    @DeleteMapping("/{profileId}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long profileId) {
        try {
            profileService.deleteProfile(profileId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Profile deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}