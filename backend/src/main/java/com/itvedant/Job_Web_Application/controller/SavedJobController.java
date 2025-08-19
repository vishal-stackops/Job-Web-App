package com.itvedant.Job_Web_Application.controller;


import com.itvedant.Job_Web_Application.entities.SavedJob;
import com.itvedant.Job_Web_Application.entities.SavedJobWithDetails;
import com.itvedant.Job_Web_Application.service.SavedJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class SavedJobController {
    
    @Autowired
    private SavedJobService savedJobService;
    
    /**
     * Test endpoint to verify API is working
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Saved Jobs API is working!");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Save a job for a seeker
     */
    @PostMapping
    public ResponseEntity<?> saveJob(@RequestBody Map<String, Long> request) {
        try {
            Long jobId = request.get("jobId");
            Long seekerId = request.get("seekerId");
            
            if (jobId == null || seekerId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "jobId and seekerId are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            SavedJob savedJob = savedJobService.saveJob(jobId, seekerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get all saved jobs for a seeker
     */
    @GetMapping("/{seekerId}")
    public ResponseEntity<?> getSavedJobs(@PathVariable Long seekerId) {
        try {
            List<SavedJobWithDetails> savedJobs = savedJobService.getSavedJobsWithDetailsBySeeker(seekerId);
            return ResponseEntity.ok(savedJobs);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Check if a job is saved by a seeker
     */
    @GetMapping("/check/{jobId}/{seekerId}")
    public ResponseEntity<?> checkIfSaved(@PathVariable Long jobId, @PathVariable Long seekerId) {
        try {
            boolean isSaved = savedJobService.isJobSaved(jobId, seekerId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("isSaved", isSaved);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Unsave a job for a seeker
     */
    @DeleteMapping("/{jobId}/{seekerId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long jobId, @PathVariable Long seekerId) {
        try {
            savedJobService.unsaveJob(jobId, seekerId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Job unsaved successfully");
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get saved job count for a seeker
     */
    @GetMapping("/count/{seekerId}")
    public ResponseEntity<?> getSavedJobCount(@PathVariable Long seekerId) {
        try {
            long count = savedJobService.getSavedJobCount(seekerId);
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get all seekers who saved a specific job (for recruiters)
     */
    @GetMapping("/job/{jobId}/seekers")
    public ResponseEntity<?> getSeekersWhoSavedJob(@PathVariable Long jobId) {
        try {
            List<SavedJob> savedJobs = savedJobService.getSeekersWhoSavedJob(jobId);
            return ResponseEntity.ok(savedJobs);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Bulk unsave jobs for a seeker
     */
    @DeleteMapping("/bulk/{seekerId}")
    public ResponseEntity<?> unsaveMultipleJobs(
            @PathVariable Long seekerId, 
            @RequestBody List<Long> jobIds) {
        try {
            savedJobService.unsaveMultipleJobs(seekerId, jobIds);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Jobs unsaved successfully");
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Saved Jobs API is running");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete all saved job references for a specific job (for force delete)
     */
    @DeleteMapping("/job/{jobId}")
    public ResponseEntity<?> deleteAllSavedJobsForJob(@PathVariable Long jobId) {
        try {
            savedJobService.deleteAllSavedJobsForJob(jobId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "All saved references for this job have been removed");
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}