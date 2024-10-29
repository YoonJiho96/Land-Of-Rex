# Base image for building the application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY LandofRex/package.json LandofRex/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY LandofRex ./

# Build the React application with Vite
RUN npm run build

# Check if build directory exists
RUN ls -la /app/dist  # 빌드 결과물 확인 (Vite의 기본 빌드 경로)
