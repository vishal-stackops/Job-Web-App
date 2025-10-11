# Stage 1: Build jar using Java 21
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy pom.xml and src from backend folder
COPY backend/pom.xml .
COPY backend/src ./src

# Build jar
RUN mvn clean package -DskipTests

# Stage 2: Run jar
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
