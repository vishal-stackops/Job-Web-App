package com.itvedant.Job_Web_Application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.itvedant.Job_Web_Application.entities.SavedJob;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    
    // Find all saved jobs by seeker ID
    List<SavedJob> findBySeekerId(Long seekerId);
    
    // Find saved job by job ID and seeker ID
    Optional<SavedJob> findByJobIdAndSeekerId(Long jobId, Long seekerId);
    
    // Check if job is saved by seeker
    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);
    
    // Delete saved job by job ID and seeker ID
    void deleteByJobIdAndSeekerId(Long jobId, Long seekerId);
    
    // Count saved jobs by seeker
    long countBySeekerId(Long seekerId);
    
    // Find saved jobs by job ID
    List<SavedJob> findByJobId(Long jobId);
    
    // Find saved jobs ordered by saved date
    List<SavedJob> findBySeekerIdOrderBySavedDateDesc(Long seekerId);
    
    // Delete all saved jobs for a specific job ID (for cascade delete)
    void deleteByJobId(Long jobId);
    
    // Alternative method using native query for better performance
    @Query("DELETE FROM SavedJob sj WHERE sj.jobId = :jobId")
    void deleteAllByJobId(@Param("jobId") Long jobId);
}