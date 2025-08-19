package com.itvedant.Job_Web_Application.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Seeker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Transient
    private String confirmpassword;

    @JsonIgnore
    @OneToMany(mappedBy = "seeker", cascade = CascadeType.ALL)
    private List<Application> applications = new ArrayList<>();

    @OneToOne(mappedBy = "seeker", cascade = CascadeType.ALL)
    private Profile profile;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmpassword() { return confirmpassword; }
    public void setConfirmpassword(String confirmpassword) { this.confirmpassword = confirmpassword; }

    public List<Application> getApplications() { return applications; }
    public void setApplications(List<Application> applications) { this.applications = applications; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) {
        this.profile = profile;
        if (profile != null) {
            profile.setSeeker(this);
        }
    }
}