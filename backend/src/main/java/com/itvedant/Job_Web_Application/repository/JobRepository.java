package com.itvedant.Job_Web_Application.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.itvedant.Job_Web_Application.entities.Job;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
  
    List<Job> findByRecruiterId(Long recruiterId);
   
    @Query("DELETE FROM SavedJob sj WHERE sj.jobId = :jobId")
    void deleteAllByJobId(@Param("jobId") Long jobId);
}