# Stage 1: Build jar
FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and src from backend folder
COPY backend/pom.xml .
COPY backend/src ./src

# Build jar
RUN mvn clean package -DskipTests

# Stage 2: Run jar
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
