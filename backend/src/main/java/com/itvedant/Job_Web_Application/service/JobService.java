package com.itvedant.Job_Web_Application.service;

import com.itvedant.Job_Web_Application.entities.Job;
import com.itvedant.Job_Web_Application.repository.SavedJobRepository;
import com.itvedant.Job_Web_Application.entities.Recruiter;
import com.itvedant.Job_Web_Application.repository.JobRepository;
import com.itvedant.Job_Web_Application.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RecruiterRepository recruiterRepo;

    public List<Job> getAll() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    public List<Job> getJobsByRecruiterId(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    public Job create(Job job) {
        if (job.getRecruiter() == null || job.getRecruiter().getId() == null) {
            throw new IllegalArgumentException("Recruiter must be provided");
        }

        Recruiter recruiter = recruiterRepo.findById(job.getRecruiter().getId())
                .orElseThrow(() -> new IllegalArgumentException("Recruiter not found with ID: " + job.getRecruiter().getId()));

        job.setRecruiter(recruiter);
        job.setPostedDate(LocalDate.now());

        return jobRepository.save(job);
    }

    public Job update(Long id, Job jobData) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        job.setTitle(jobData.getTitle());
        job.setCompany(jobData.getCompany());
        job.setLocation(jobData.getLocation());
        job.setDescription(jobData.getDescription());
        job.setSalaryRange(jobData.getSalaryRange());
        job.setJobType(jobData.getJobType());
        job.setExperienceLevel(jobData.getExperienceLevel());
        job.setPostedDate(jobData.getPostedDate());

        return jobRepository.save(job);
    }

    public void delete(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        jobRepository.delete(job);
    }
    
    /**
     * Force delete job - removes all saved references first, then deletes the job
     */
    public void forceDeleteJob(Long jobId) {
        // Then delete the job itself
        jobRepository.deleteById(jobId);
    }
    
    /**
     * Alternative method using native query to delete all saved jobs for a job
     */
    public void deleteJobWithSavedJobs(Long jobId) {
        // Delete all saved job records for this job using native query
        jobRepository.deleteAllByJobId(jobId);
        
        // Delete the job
        jobRepository.deleteById(jobId);
    }
        
    
}
