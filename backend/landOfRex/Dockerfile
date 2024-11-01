# Base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY backend/landOfRex/gradlew ./gradlew
COPY backend/landOfRex/gradle ./gradle
COPY backend/landOfRex/build.gradle ./

# Copy the source files
COPY backend/landOfRex/src ./src

# Make Gradle wrapper executable
RUN chmod +x ./gradlew

# Build the application using Gradle wrapper
RUN ./gradlew clean build && ls -la /app/build/libs

# Copy the built JAR file
RUN cp /app/build/libs/app-0.0.1-SNAPSHOT.jar /app/app.jar

# Specify the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
