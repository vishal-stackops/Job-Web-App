# Use official Eclipse Temurin JDK 17 image (lightweight, compatible with Spring Boot)
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy the Spring Boot jar file (built with Maven)
COPY target/*.jar app.jar

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
