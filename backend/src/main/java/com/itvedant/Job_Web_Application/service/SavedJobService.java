package com.itvedant.Job_Web_Application.service;

import com.itvedant.Job_Web_Application.entities.Job;
import com.itvedant.Job_Web_Application.entities.SavedJob;
import com.itvedant.Job_Web_Application.entities.SavedJobWithDetails;
import com.itvedant.Job_Web_Application.repository.SavedJobRepository;
import com.itvedant.Job_Web_Application.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SavedJobService {
    
    @Autowired
    private SavedJobRepository savedJobRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    /**
     * Save a job for a seeker
     */
    public SavedJob saveJob(Long jobId, Long seekerId) {
        // Check if already saved
        if (savedJobRepository.existsByJobIdAndSeekerId(jobId, seekerId)) {
            throw new RuntimeException("Job is already saved by this seeker");
        }
        
        SavedJob savedJob = new SavedJob(jobId, seekerId);
        return savedJobRepository.save(savedJob);
    }
    
    /**
     * Get all saved jobs for a seeker
     */
    public List<SavedJob> getSavedJobsBySeeker(Long seekerId) {
        return savedJobRepository.findBySeekerIdOrderBySavedDateDesc(seekerId);
    }
    
    /**
     * Get all saved jobs with job details for a seeker
     */
    public List<SavedJobWithDetails> getSavedJobsWithDetailsBySeeker(Long seekerId) {
        List<SavedJob> savedJobs = savedJobRepository.findBySeekerIdOrderBySavedDateDesc(seekerId);
        
        return savedJobs.stream()
                .map(savedJob -> {
                    Optional<Job> jobOpt = jobRepository.findById(savedJob.getJobId());
                    Job job = jobOpt.orElse(null);
                    return new SavedJobWithDetails(savedJob, job);
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Check if a job is saved by a seeker
     */
    public boolean isJobSaved(Long jobId, Long seekerId) {
        return savedJobRepository.existsByJobIdAndSeekerId(jobId, seekerId);
    }
    
    /**
     * Unsave a job for a seeker
     */
    public void unsaveJob(Long jobId, Long seekerId) {
        // Check if job is actually saved
        if (!savedJobRepository.existsByJobIdAndSeekerId(jobId, seekerId)) {
            throw new RuntimeException("Job is not saved by this seeker");
        }
        
        savedJobRepository.deleteByJobIdAndSeekerId(jobId, seekerId);
    }
    
    /**
     * Get saved job count for a seeker
     */
    public long getSavedJobCount(Long seekerId) {
        return savedJobRepository.countBySeekerId(seekerId);
    }
    
    /**
     * Get all seekers who saved a specific job (for recruiters)
     */
    public List<SavedJob> getSeekersWhoSavedJob(Long jobId) {
        return savedJobRepository.findByJobId(jobId);
    }
    
    /**
     * Bulk unsave jobs for a seeker
     */
    public void unsaveMultipleJobs(Long seekerId, List<Long> jobIds) {
        for (Long jobId : jobIds) {
            if (savedJobRepository.existsByJobIdAndSeekerId(jobId, seekerId)) {
                savedJobRepository.deleteByJobIdAndSeekerId(jobId, seekerId);
            }
        }
    }
    
    /**
     * Get saved jobs with pagination
     */
    public List<SavedJob> getSavedJobsBySeekerWithPagination(Long seekerId, int page, int size) {
        // This would require custom implementation with Pageable
        // For now, return all saved jobs
        return savedJobRepository.findBySeekerIdOrderBySavedDateDesc(seekerId);
    }

    /**
     * Delete all saved job references for a specific job (for force delete)
     * This method is called when a recruiter wants to delete a job that has saved references
     */
    public void deleteAllSavedJobsForJob(Long jobId) {
        try {
            // First check if there are any saved jobs for this job
            List<SavedJob> savedJobs = savedJobRepository.findByJobId(jobId);
            if (!savedJobs.isEmpty()) {
                // Delete all saved job records for this job
                savedJobRepository.deleteByJobId(jobId);
                System.out.println("Deleted " + savedJobs.size() + " saved job references for job ID: " + jobId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete saved job references for job ID: " + jobId + ". Error: " + e.getMessage());
        }
    }
}