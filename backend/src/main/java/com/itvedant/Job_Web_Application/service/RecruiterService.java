package com.itvedant.Job_Web_Application.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itvedant.Job_Web_Application.entities.Recruiter;
import com.itvedant.Job_Web_Application.repository.RecruiterRepository;

@Service
public class RecruiterService {

    @Autowired
    private RecruiterRepository repo;

    public List<Recruiter> getAll() {
        return repo.findAll();
    }

    public Recruiter registerRecruiter(Recruiter r) {
        return repo.save(r);
    }

    public Recruiter loginRecruiter(Recruiter user) {
        Recruiter recruiter = repo.findByEmail(user.getEmail());
        if (recruiter != null && recruiter.getPassword().equals(user.getPassword())) {
            return recruiter;
        }
        return null;
    }

    public Recruiter update(Long id, Recruiter r) {
        Recruiter recruiter = repo.findById(id).orElseThrow();
        recruiter.setName(r.getName());
        recruiter.setEmail(r.getEmail());
        recruiter.setPassword(r.getPassword());
        return repo.save(recruiter);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
