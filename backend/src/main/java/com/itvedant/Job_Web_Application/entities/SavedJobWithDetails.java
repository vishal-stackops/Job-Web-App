package com.itvedant.Job_Web_Application.entities;


import com.itvedant.Job_Web_Application.entities.Job;
import java.time.LocalDateTime;

public class SavedJobWithDetails {
    
    private Long savedJobId;
    private Long jobId;
    private Long seekerId;
    private LocalDateTime savedDate;
    
    // Job details
    private String jobTitle;
    private String company;
    private String location;
    private String description;
    private String salaryRange;
    private String jobType;
    private String experienceLevel;
    
    // Constructors
    public SavedJobWithDetails() {}
    
    public SavedJobWithDetails(SavedJob savedJob, Job job) {
        this.savedJobId = savedJob.getId();
        this.jobId = savedJob.getJobId();
        this.seekerId = savedJob.getSeekerId();
        this.savedDate = savedJob.getSavedDate();
        
        if (job != null) {
            this.jobTitle = job.getTitle();
            this.company = job.getCompany();
            this.location = job.getLocation();
            this.description = job.getDescription();
            this.salaryRange = job.getSalaryRange();
            this.jobType = job.getJobType();
            this.experienceLevel = job.getExperienceLevel();
        }
    }
    
    // Getters and Setters
    public Long getSavedJobId() {
        return savedJobId;
    }
    
    public void setSavedJobId(Long savedJobId) {
        this.savedJobId = savedJobId;
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
    
    public String getJobTitle() {
        return jobTitle;
    }
    
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }
    
    public String getCompany() {
        return company;
    }
    
    public void setCompany(String company) {
        this.company = company;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getSalaryRange() {
        return salaryRange;
    }
    
    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }
    
    public String getJobType() {
        return jobType;
    }
    
    public void setJobType(String jobType) {
        this.jobType = jobType;
    }
    
    public String getExperienceLevel() {
        return experienceLevel;
    }
    
    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
    
    @Override
    public String toString() {
        return "SavedJobWithDetails{" +
                "savedJobId=" + savedJobId +
                ", jobId=" + jobId +
                ", seekerId=" + seekerId +
                ", savedDate=" + savedDate +
                ", jobTitle='" + jobTitle + '\'' +
                ", company='" + company + '\'' +
                ", location='" + location + '\'' +
                ", description='" + description + '\'' +
                ", salaryRange='" + salaryRange + '\'' +
                ", jobType='" + jobType + '\'' +
                ", experienceLevel='" + experienceLevel + '\'' +
                '}';
    }
}
