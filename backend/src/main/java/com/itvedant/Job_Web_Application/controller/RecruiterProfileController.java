package com.itvedant.Job_Web_Application.controller;

import com.itvedant.Job_Web_Application.entities.RecruiterProfile;
import com.itvedant.Job_Web_Application.service.RecruiterProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiters")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RecruiterProfileController {
    
    @Autowired
    private RecruiterProfileService recruiterProfileService;
    
    /**
     * GET /api/recruiters/{recruiterId}/profile
     * Get recruiter profile by recruiter ID
     */
    @GetMapping("/{recruiterId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long recruiterId) {
        System.out.println("Received GET profile request for recruiter ID: " + recruiterId);
        try {
            var profile = recruiterProfileService.getProfileByRecruiterId(recruiterId);
            
            if (profile.isPresent()) {
                System.out.println("Profile retrieved successfully: " + profile.get());
                return ResponseEntity.ok(profile.get());
            } else {
                System.out.println("Profile not found for recruiter ID: " + recruiterId);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Profile not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (RuntimeException e) {
            System.err.println("Runtime exception in GET profile: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.err.println("General exception in GET profile: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * POST /api/recruiters/{recruiterId}/profile
     * Create new recruiter profile
     */
    @PostMapping("/{recruiterId}/profile")
    public ResponseEntity<?> createProfile(@PathVariable Long recruiterId, @RequestBody RecruiterProfile profile) {
        System.out.println("Received create profile request for recruiter ID: " + recruiterId);
        System.out.println("Profile data: " + profile);
        
        try {
            // Set the recruiter ID from path variable
            profile.setRecruiterId(recruiterId);
            
            // Validate required fields
            if (profile.getName() == null || profile.getName().trim().isEmpty()) {
                System.err.println("Validation failed: Name is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (profile.getEmail() == null || profile.getEmail().trim().isEmpty()) {
                System.err.println("Validation failed: Email is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (profile.getCompanyName() == null || profile.getCompanyName().trim().isEmpty()) {
                System.err.println("Validation failed: Company name is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Company name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (profile.getPosition() == null || profile.getPosition().trim().isEmpty()) {
                System.err.println("Validation failed: Position is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Position is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            RecruiterProfile savedProfile = recruiterProfileService.createProfile(profile);
            System.out.println("Profile created successfully: " + savedProfile);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
            
        } catch (RuntimeException e) {
            System.err.println("Runtime exception in create profile: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.err.println("General exception in create profile: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * PUT /api/recruiters/{recruiterId}/profile
     * Update existing recruiter profile
     */
    @PutMapping("/{recruiterId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long recruiterId, @RequestBody RecruiterProfile profile) {
        System.out.println("Received update profile request for recruiter ID: " + recruiterId);
        System.out.println("Profile data: " + profile);
        
        try {
            // Validate required fields
            if (profile.getName() == null || profile.getName().trim().isEmpty()) {
                System.err.println("Validation failed: Name is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (profile.getEmail() == null || profile.getEmail().trim().isEmpty()) {
                System.err.println("Validation failed: Email is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (profile.getCompanyName() == null || profile.getCompanyName().trim().isEmpty()) {
                System.err.println("Validation failed: Company name is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Company name is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (profile.getPosition() == null || profile.getPosition().trim().isEmpty()) {
                System.err.println("Validation failed: Position is required");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Position is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            RecruiterProfile updatedProfile = recruiterProfileService.updateProfile(recruiterId, profile);
            System.out.println("Profile updated successfully: " + updatedProfile);
            return ResponseEntity.ok(updatedProfile);
            
        } catch (RuntimeException e) {
            System.err.println("Runtime exception in update profile: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.err.println("General exception in update profile: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * DELETE /api/recruiters/{recruiterId}/profile
     * Delete recruiter profile
     */
    @DeleteMapping("/{recruiterId}/profile")
    public ResponseEntity<?> deleteProfile(@PathVariable Long recruiterId) {
        System.out.println("Received delete profile request for recruiter ID: " + recruiterId);
        try {
            recruiterProfileService.deleteProfile(recruiterId);
            System.out.println("Profile deleted successfully for recruiter ID: " + recruiterId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Profile deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Runtime exception in delete profile: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.err.println("General exception in delete profile: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}