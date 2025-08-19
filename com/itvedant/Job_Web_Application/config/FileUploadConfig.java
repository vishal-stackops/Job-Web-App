package com.itvedant.Job_Web_Application.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {
    
    @Value("${file.upload-dir:uploads/resumes/}")
    private String uploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from the uploads directory
        Path uploadPath = Paths.get(uploadDir);
        String uploadAbsolutePath = uploadPath.toFile().getAbsolutePath();
        
        // Serve files from /uploads/** path (for backward compatibility)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadAbsolutePath + "/")
                .setCachePeriod(3600) // Cache for 1 hour
                .resourceChain(true);
        
        // Also serve files from /resumes/** path (for new format)
        registry.addResourceHandler("/resumes/**")
                .addResourceLocations("file:" + uploadAbsolutePath + "/")
                .setCachePeriod(3600) // Cache for 1 hour
                .resourceChain(true);
        
        System.out.println("File upload directory configured: " + uploadAbsolutePath);
        System.out.println("Files will be served from: /uploads/** and /resumes/**");
    }
} 