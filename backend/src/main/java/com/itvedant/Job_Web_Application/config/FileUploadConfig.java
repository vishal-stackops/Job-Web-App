package com.itvedant.Job_Web_Application.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads/resumes/}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Normalize the upload directory path
        Path uploadPath = Paths.get(uploadDir).normalize();
        String uploadAbsolutePath = uploadPath.toFile().getAbsolutePath();

        try {
            // Decode any encoded characters like %20 (space) from file path
            uploadAbsolutePath = URLDecoder.decode(uploadAbsolutePath, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            System.err.println("Error decoding upload path: " + e.getMessage());
        }

        // Serve files from /uploads/** path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadAbsolutePath + "/")
                .setCachePeriod(3600)
                .resourceChain(true);

        // Serve files from /resumes/** path
        registry.addResourceHandler("/resumes/**")
                .addResourceLocations("file:" + uploadAbsolutePath + "/")
                .setCachePeriod(3600)
                .resourceChain(true);

        System.out.println("File upload directory configured: " + uploadAbsolutePath);
        System.out.println("Files will be served from: /uploads/** and /resumes/**");
    }
}
