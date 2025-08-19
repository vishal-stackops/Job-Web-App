package com.itvedant.Job_Web_Application.repository;

import com.itvedant.Job_Web_Application.entities.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    
    /**
     * Find profile by recruiter ID
     */
    Optional<RecruiterProfile> findByRecruiterId(Long recruiterId);
    
    /**
     * Check if profile exists for recruiter
     */
    boolean existsByRecruiterId(Long recruiterId);
    
    /**
     * Delete profile by recruiter ID
     */
    void deleteByRecruiterId(Long recruiterId);
}