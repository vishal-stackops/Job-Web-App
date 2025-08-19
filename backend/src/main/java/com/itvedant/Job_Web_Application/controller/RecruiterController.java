package com.itvedant.Job_Web_Application.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itvedant.Job_Web_Application.entities.Recruiter;
import com.itvedant.Job_Web_Application.service.RecruiterService;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {

    @Autowired
    private RecruiterService service;

    @GetMapping
    public List<Recruiter> getAll() {
        return service.getAll();
    }

    // Signup
    @PostMapping("/signup")
    public ResponseEntity<Recruiter> signup(@RequestBody Recruiter recruiter) {
        return ResponseEntity.ok(service.registerRecruiter(recruiter));
    }

    // Signin
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Recruiter user) {
        Recruiter recruiter = service.loginRecruiter(user);
        if (recruiter != null) {
            return ResponseEntity.ok(recruiter);
        }
        return ResponseEntity.status(401).body("Invalid recruiter credentials");
    }

    @PutMapping("/{id}")
    public Recruiter update(@PathVariable Long id, @RequestBody Recruiter recruiter) {
        return service.update(id, recruiter);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
