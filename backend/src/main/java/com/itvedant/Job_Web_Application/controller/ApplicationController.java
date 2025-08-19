package com.itvedant.Job_Web_Application.controller;

import com.itvedant.Job_Web_Application.entities.Application;
import com.itvedant.Job_Web_Application.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    /**
     * GET /api/applications/recruiter/{recruiterId}
     * Get all applications for jobs posted by a specific recruiter
     */
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<?> getApplicationsByRecruiter(@PathVariable Long recruiterId) {
        try {
            List<Application> applications = applicationService.getApplicationsByRecruiterId(recruiterId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving applications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * GET /api/applications/job/{jobId}
     * Get all applications for a specific job
     */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsByJob(@PathVariable Long jobId) {
        try {
            List<Application> applications = applicationService.getApplicationsByJobId(jobId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving applications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * GET /api/applications/seeker/{seekerId}
     * Get all applications by a specific seeker
     */
    @GetMapping("/seeker/{seekerId}")
    public ResponseEntity<?> getApplicationsBySeeker(@PathVariable Long seekerId) {
        try {
            List<Application> applications = applicationService.getApplicationsBySeekerId(seekerId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving applications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * POST /api/applications
     * Create a new application
     */
    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Map<String, Object> request) {
        try {
            Long jobId = Long.valueOf(request.get("jobId").toString());
            Long seekerId = Long.valueOf(request.get("seekerId").toString());
            String coverLetter = (String) request.get("coverLetter");
            String resumeUrl = (String) request.get("resumeUrl");

            Application application = applicationService.createApplication(jobId, seekerId, coverLetter, resumeUrl);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * PUT /api/applications/{applicationId}/status
     * Update application status
     */
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long applicationId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null || status.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Status is required");
                return ResponseEntity.badRequest().body(response);
            }

            Application application = applicationService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating application status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * DELETE /api/applications/{applicationId}
     * Delete an application
     */
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long applicationId) {
        try {
            applicationService.deleteApplication(applicationId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Application deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * GET /api/applications/{applicationId}
     * Get application by ID
     */
    @GetMapping("/{applicationId}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long applicationId) {
        try {
            var application = applicationService.getApplicationById(applicationId);
            if (application.isPresent()) {
                return ResponseEntity.ok(application.get());
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Application not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * GET /api/applications/status/{status}
     * Get applications by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getApplicationsByStatus(@PathVariable String status) {
        try {
            List<Application> applications = applicationService.getApplicationsByStatus(status);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving applications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * GET /api/applications/check/{jobId}/{seekerId}
     * Check if seeker has applied to a job
     */
    @GetMapping("/check/{jobId}/{seekerId}")
    public ResponseEntity<?> checkIfApplied(@PathVariable Long jobId, @PathVariable Long seekerId) {
        try {
            boolean hasApplied = applicationService.hasSeekerAppliedToJob(jobId, seekerId);
            Map<String, Object> response = new HashMap<>();
            response.put("hasApplied", hasApplied);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error checking application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadApplication(
            @RequestParam("jobId") Long jobId,
            @RequestParam("seekerId") Long seekerId,
            @RequestParam("resume") MultipartFile resumeFile
    ) {
        try {
            // Get the current working directory and create uploads path
            String currentDir = System.getProperty("user.dir");
            String uploadsDir = currentDir + File.separator + "uploads" + File.separator + "resumes" + File.separator;

            // Create directory if it doesn't exist
            File dir = new File(uploadsDir);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to create upload directory");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }

            // Generate unique filename
            String fileName = System.currentTimeMillis() + "_" + resumeFile.getOriginalFilename();
            String filePath = uploadsDir + fileName;
            File dest = new File(filePath);

            // Save the file
            resumeFile.transferTo(dest);

            // Create the resume URL (relative path for web access)
            String resumeUrl = "/uploads/resumes/" + fileName;

            // Create application with resume URL
            Application application = applicationService.createApplication(jobId, seekerId, null, resumeUrl);

            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error uploading resume: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * POST /api/applications/upload-resume
     * Upload resume file only (without creating application)
     */
    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("resume") MultipartFile resumeFile) {
        try {
            // Get the current working directory and create uploads path
            String currentDir = System.getProperty("user.dir");
            String uploadsDir = currentDir + File.separator + "uploads" + File.separator + "resumes" + File.separator;

            // Create directory if it doesn't exist
            File dir = new File(uploadsDir);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to create upload directory");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }

            // Generate unique filename
            String fileName = System.currentTimeMillis() + "_" + resumeFile.getOriginalFilename();
            String filePath = uploadsDir + fileName;
            File dest = new File(filePath);

            // Save the file
            resumeFile.transferTo(dest);

            // Create the resume URL (relative path for web access)
            String resumeUrl = "/uploads/resumes/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("resumeUrl", resumeUrl);
            response.put("message", "Resume uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error uploading resume: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}