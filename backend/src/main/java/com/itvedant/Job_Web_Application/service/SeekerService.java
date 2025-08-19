package com.itvedant.Job_Web_Application.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.itvedant.Job_Web_Application.entities.Seeker;
import com.itvedant.Job_Web_Application.repository.SeekerRepository;

@Service
public class SeekerService {

    private final SeekerRepository repo;

    public SeekerService(SeekerRepository repo) {
        this.repo = repo;
    }

    public List<Seeker> getAll() {
        return repo.findAll();
    }

    public Seeker getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Seeker registerSeeker(Seeker seeker) {
        if (seeker.getPassword() == null || seeker.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (repo.findByEmail(seeker.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered");
        }
        return repo.save(seeker);
    }

    public Seeker loginSeeker(Seeker user) {
        Seeker seeker = repo.findByEmail(user.getEmail());
        if (seeker == null || user.getPassword() == null) {
            return null;
        }
        if (!seeker.getPassword().equals(user.getPassword())) {
            return null;
        }
        return seeker;
    }

    public Seeker update(Long id, Seeker s) {
        Optional<Seeker> seekerOpt = repo.findById(id);
        if (seekerOpt.isPresent()) {
            Seeker seeker = seekerOpt.get();
            seeker.setName(s.getName());
            if (s.getPassword() == null || s.getPassword().isEmpty()) {
                throw new IllegalArgumentException("Password cannot be empty");
            }
            seeker.setPassword(s.getPassword());
            return repo.save(seeker);
        }
        return null;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
