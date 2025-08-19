package com.itvedant.Job_Web_Application.controller;

import com.itvedant.Job_Web_Application.entities.Job;
import com.itvedant.Job_Web_Application.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<?> getAllJobs() {
        try {
            return ResponseEntity.ok(jobService.getAll());
        } catch (Exception e) {
            return errorResponse("Error retrieving jobs", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.getJobById(id));
        } catch (RuntimeException e) {
            return notFoundResponse(e.getMessage());
        } catch (Exception e) {
            return errorResponse("Error retrieving job", e);
        }
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<?> getJobsByRecruiter(@PathVariable Long recruiterId) {
        try {
            return ResponseEntity.ok(jobService.getJobsByRecruiterId(recruiterId));
        } catch (Exception e) {
            return errorResponse("Error retrieving jobs", e);
        }
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        try {
            Job savedJob = jobService.create(job);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return errorResponse("Error creating job", e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job job) {
        try {
            Job updatedJob = jobService.update(id, job);
            return ResponseEntity.ok(updatedJob);
        } catch (RuntimeException e) {
            return notFoundResponse(e.getMessage());
        } catch (Exception e) {
            return errorResponse("Error updating job", e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            jobService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
        } catch (RuntimeException e) {
            return notFoundResponse(e.getMessage());
        } catch (Exception e) {
            return errorResponse("Error deleting job", e);
        }
    }

    
    private ResponseEntity<Map<String, String>> errorResponse(String message, Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message + ": " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    private ResponseEntity<Map<String, String>> notFoundResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    @DeleteMapping("/{jobId}/force")
    public ResponseEntity<?> forceDeleteJob(@PathVariable Long jobId) {
        try {
            jobService.forceDeleteJob(jobId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Job and all saved references deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}