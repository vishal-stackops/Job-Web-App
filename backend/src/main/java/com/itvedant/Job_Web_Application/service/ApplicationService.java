package com.itvedant.Job_Web_Application.service;

import com.itvedant.Job_Web_Application.entities.Application;
import com.itvedant.Job_Web_Application.entities.Job;
import com.itvedant.Job_Web_Application.entities.Seeker;
import com.itvedant.Job_Web_Application.repository.ApplicationRepository;
import com.itvedant.Job_Web_Application.repository.JobRepository;
import com.itvedant.Job_Web_Application.repository.SeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Get all applications for jobs posted by a specific recruiter
     */
    public List<Application> getApplicationsByRecruiterId(Long recruiterId) {
        return applicationRepository.findByRecruiterId(recruiterId);
    }

    /**
     * Get all applications for jobs posted by a specific recruiter with detailed information
     */
    public List<Map<String, Object>> getApplicationsWithDetails(Long recruiterId) {
        String sql = """
            SELECT 
                a.id as application_id,
                a.status as application_status,
                a.applied_date,
                a.resume_url,
                j.id as job_id,
                j.title as job_title,
                j.company as job_company,
                j.location as job_location,
                j.salary as job_salary,
                j.description as job_description,
                s.id as seeker_id,
                s.name as seeker_name,
                s.email as seeker_email,
                s.phone as seeker_phone
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN seekers s ON a.seeker_id = s.id
            WHERE j.recruiter_id = ?
            ORDER BY a.applied_date DESC
            """;
        
        return jdbcTemplate.queryForList(sql, recruiterId);
    }

    /**
     * Get all applications for a specific job
     */
    public List<Application> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    /**
     * Get all applications by a specific seeker
     */
    public List<Application> getApplicationsBySeekerId(Long seekerId) {
        List<Application> applications = applicationRepository.findBySeekerId(seekerId);

        // Debug logging
        System.out.println("Found " + applications.size() + " applications for seeker: " + seekerId);
        for (Application app : applications) {
            System.out.println("Application ID: " + app.getId());
            System.out.println("Job: " + (app.getJob() != null ? app.getJob().getTitle() : "NULL"));
            System.out.println("Job Company: " + (app.getJob() != null ? app.getJob().getCompany() : "NULL"));
            System.out.println("Job Location: " + (app.getJob() != null ? app.getJob().getLocation() : "NULL"));
            System.out.println("---");
        }

        return applications;
    }

    /**
     * Create a new application
     */
    public Application createApplication(Long jobId, Long seekerId, String coverLetter, String resumeUrl) {
        // Check if job exists
        Optional<Job> jobOpt = jobRepository.findById(jobId);
        if (!jobOpt.isPresent()) {
            throw new RuntimeException("Job not found");
        }

        // Check if seeker exists
        Optional<Seeker> seekerOpt = seekerRepository.findById(seekerId);
        if (!seekerOpt.isPresent()) {
            throw new RuntimeException("Seeker not found");
        }

        // Check if seeker has already applied to this job
        if (applicationRepository.existsByJobIdAndSeekerId(jobId, seekerId)) {
            throw new RuntimeException("You have already applied to this job");
        }

        Job job = jobOpt.get();
        Seeker seeker = seekerOpt.get();

        Application application = new Application(job, seeker, resumeUrl);
        return applicationRepository.save(application);
    }

    /**
     * Update application status
     */
    public Application updateApplicationStatus(Long applicationId, String status) {
        Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
        if (!applicationOpt.isPresent()) {
            throw new RuntimeException("Application not found");
        }

        Application application = applicationOpt.get();
        application.setStatus(ApplicationStatus.valueOf(status.toUpperCase()));
        return applicationRepository.save(application);
    }

    /**
     * Delete an application
     */
    public void deleteApplication(Long applicationId) {
        Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
        if (!applicationOpt.isPresent()) {
            throw new RuntimeException("Application not found");
        }
        applicationRepository.deleteById(applicationId);
    }

    /**
     * Get application by ID
     */
    public Optional<Application> getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId);
    }

    /**
     * Get applications by status
     */
    public List<Application> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(status);
    }

    /**
     * Get applications for a specific job by status
     */
    public List<Application> getApplicationsByJobIdAndStatus(Long jobId, String status) {
        return applicationRepository.findByJobIdAndStatus(jobId, status);
    }

    /**
     * Count applications for a specific job
     */
    public long countApplicationsByJobId(Long jobId) {
        return applicationRepository.countByJobId(jobId);
    }

    /**
     * Count applications by status for a specific recruiter
     */
    public long countApplicationsByRecruiterIdAndStatus(Long recruiterId, String status) {
        return applicationRepository.countByRecruiterIdAndStatus(recruiterId, status);
    }

    /**
     * Check if a seeker has already applied to a job
     */
    public boolean hasSeekerAppliedToJob(Long jobId, Long seekerId) {
        return applicationRepository.existsByJobIdAndSeekerId(jobId, seekerId);
    }

    /**
     * Upload resume file and return the file URL
     */
    public String uploadResume(MultipartFile file) {
        try {
            // Get the current working directory and create uploads path
            String currentDir = System.getProperty("user.dir");
            String uploadsDir = currentDir + File.separator + "uploads" + File.separator + "resumes" + File.separator;

            // Create directory if it doesn't exist
            File dir = new File(uploadsDir);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    throw new RuntimeException("Failed to create upload directory");
                }
            }

            // Generate unique filename
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = uploadsDir + fileName;
            File dest = new File(filePath);

            // Save the file
            file.transferTo(dest);

            // Return the resume URL (relative path for web access)
            return "/uploads/resumes/" + fileName;
        } catch (Exception e) {
            System.err.println("Error uploading resume: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error uploading resume: " + e.getMessage());
        }
    }
}