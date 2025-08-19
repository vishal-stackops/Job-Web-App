package com.itvedant.Job_Web_Application.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itvedant.Job_Web_Application.entities.Seeker;
import com.itvedant.Job_Web_Application.service.SeekerService;

@RestController
@RequestMapping("/api/seekers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SeekerController {

    private final SeekerService service;

    public SeekerController(SeekerService service) {
        this.service = service;
    }

    // Get all seekers
    @GetMapping
    public List<Seeker> getAll() {
        return service.getAll();
    }

    // Get a single seeker by ID
    @GetMapping("/{id}")
    public ResponseEntity<Seeker> getById(@PathVariable Long id) {
        Seeker seeker = service.getById(id);
        if (seeker != null) {
            return ResponseEntity.ok(seeker);
        }
        return ResponseEntity.notFound().build();
    }

    // Signup
    @PostMapping("/signup")
    public ResponseEntity<Seeker> register(@RequestBody Seeker seeker) {
        System.out.println("Received Seeker: " + seeker.getEmail() + " | " + seeker.getPassword());

        try {
            Seeker saved = service.registerSeeker(seeker);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            System.out.println("Signup error: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<Seeker> login(@RequestBody Seeker seeker) {
        Seeker result = service.loginSeeker(seeker);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Seeker s) {
        try {
            Seeker updated = service.update(id, s);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}