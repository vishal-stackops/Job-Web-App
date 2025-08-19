package com.itvedant.Job_Web_Application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.itvedant.Job_Web_Application.entities.Application;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    /**
     * Find all applications for jobs posted by a specific recruiter
     */
    @Query("SELECT a FROM Application a JOIN FETCH a.job j WHERE j.recruiter.id = :recruiterId")
    List<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId);
    
    /**
     * Find all applications for a specific job
     */
    @Query("SELECT a FROM Application a JOIN FETCH a.job WHERE a.job.id = :jobId")
    List<Application> findByJobId(@Param("jobId") Long jobId);
    
    /**
     * Find all applications by a specific seeker with job data
     */
    @Query("SELECT a FROM Application a JOIN FETCH a.job WHERE a.seeker.id = :seekerId")
    List<Application> findBySeekerId(@Param("seekerId") Long seekerId);
    
    /**
     * Find applications by status
     */
    @Query("SELECT a FROM Application a JOIN FETCH a.job WHERE a.status = :status")
    List<Application> findByStatus(@Param("status") String status);
    
    /**
     * Find applications for a specific job by status
     */
    @Query("SELECT a FROM Application a JOIN FETCH a.job WHERE a.job.id = :jobId AND a.status = :status")
    List<Application> findByJobIdAndStatus(@Param("jobId") Long jobId, @Param("status") String status);
    
    /**
     * Check if a seeker has already applied to a job
     */
    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);
    
    /**
     * Count applications for a specific job
     */
    long countByJobId(Long jobId);
    
    /**
     * Count applications by status for a specific recruiter
     */
    @Query("SELECT COUNT(a) FROM Application a JOIN a.job j WHERE j.recruiter.id = :recruiterId AND a.status = :status")
    long countByRecruiterIdAndStatus(@Param("recruiterId") Long recruiterId, @Param("status") String status);
    
    /**
     * Delete all applications for a specific job ID
     */
    @Modifying
    @Query("DELETE FROM Application a WHERE a.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
    
    /**
     * Delete application by job ID and seeker ID
     */
    @Modifying
    @Query("DELETE FROM Application a WHERE a.job.id = :jobId AND a.seeker.id = :seekerId")
    void deleteByJobIdAndSeekerId(@Param("jobId") Long jobId, @Param("seekerId") Long seekerId);
    
    /**
     * Count applications by seeker ID
     */
    long countBySeekerId(Long seekerId);
}