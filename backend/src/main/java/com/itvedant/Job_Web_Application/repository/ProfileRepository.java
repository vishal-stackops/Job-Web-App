package com.itvedant.Job_Web_Application.repository;

import com.itvedant.Job_Web_Application.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
    /**
     * Find profile by seeker ID
     */
    Optional<Profile> findBySeekerId(Long seekerId);
    
    /**
     * Check if profile exists for seeker
     */
    boolean existsBySeekerId(Long seekerId);
    
}