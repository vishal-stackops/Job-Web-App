package com.itvedant.Job_Web_Application.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itvedant.Job_Web_Application.entities.Seeker;

public interface SeekerRepository extends JpaRepository<Seeker, Long> {
	Seeker findByEmail(String email);
}