# ------------------------------
# Stage 1: Build the jar
# ------------------------------
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the jar (skip tests for speed)
RUN mvn clean package -DskipTests

# ------------------------------
# Stage 2: Run the jar
# ------------------------------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot default port
EXPOSE 8080

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]

