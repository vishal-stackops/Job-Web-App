package com.itvedant.Job_Web_Application.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "saved_jobs")
public class SavedJob {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "job_id", nullable = false)
    private Long jobId;
    
    @Column(name = "seeker_id", nullable = false)
    private Long seekerId;
    
    @Column(name = "saved_date")
    private LocalDateTime savedDate;
    
    // Constructors
    public SavedJob() {
        this.savedDate = LocalDateTime.now();
    }
    
    public SavedJob(Long jobId, Long seekerId) {
        this.jobId = jobId;
        this.seekerId = seekerId;
        this.savedDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getJobId() {
        return jobId;
    }
    
    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }
    
    public Long getSeekerId() {
        return seekerId;
    }
    
    public void setSeekerId(Long seekerId) {
        this.seekerId = seekerId;
    }
    
    public LocalDateTime getSavedDate() {
        return savedDate;
    }
    
    public void setSavedDate(LocalDateTime savedDate) {
        this.savedDate = savedDate;
    }
    
    @Override
    public String toString() {
        return "SavedJob{" +
                "id=" + id +
                ", jobId=" + jobId +
                ", seekerId=" + seekerId +
                ", savedDate=" + savedDate +
                '}';
    }
}