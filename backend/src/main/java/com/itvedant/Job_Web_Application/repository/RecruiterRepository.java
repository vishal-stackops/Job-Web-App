package com.itvedant.Job_Web_Application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itvedant.Job_Web_Application.entities.Recruiter;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
	Recruiter findByEmail(String email);
}
