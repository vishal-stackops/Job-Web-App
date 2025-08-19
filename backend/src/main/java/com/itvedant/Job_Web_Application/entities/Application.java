package com.itvedant.Job_Web_Application.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itvedant.Job_Web_Application.service.ApplicationStatus;

@Entity
@Table(name = "applications")
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)  // Changed from LAZY to EAGER
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;  // Removed @JsonIgnore
    
    @ManyToOne(fetch = FetchType.EAGER)
    // Keep this for seeker to avoid circular reference
    @JoinColumn(name = "seeker_id", nullable = false)
    private Seeker seeker;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    @Column(name = "applied_date")
    private LocalDateTime appliedDate;
    
    @Column(name = "resume_url")
    private String resumeUrl;
    
    // Constructors
    public Application() {}
    
    public Application(Job job, Seeker seeker, String resumeUrl) {
        this.job = job;
        this.seeker = seeker;
        this.resumeUrl = resumeUrl;
        this.appliedDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Job getJob() {
        return job;
    }
    
    public void setJob(Job job) {
        this.job = job;
    }
    
    public Seeker getSeeker() {
        return seeker;
    }
    
    public void setSeeker(Seeker seeker) {
        this.seeker = seeker;
    }
    
    public ApplicationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }
    
    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }
    
    public String getResumeUrl() {
        return resumeUrl;
    }
    
    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
    
    @PrePersist
    protected void onCreate() {
        appliedDate = LocalDateTime.now();
    }
}