# Stage 1: Build jar using Maven + Java 21
FROM maven:3.9.2-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and src from backend folder
COPY backend/pom.xml .
COPY backend/src ./src

# Build the jar
RUN mvn clean package -DskipTests

# Stage 2: Run jar using lightweight JDK
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
