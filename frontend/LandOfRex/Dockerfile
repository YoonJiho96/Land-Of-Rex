# Base image for building the application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json for installation
COPY ./LandofRex/package.json ./LandofRex/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./LandofRex ./

# Build the React application with Vite
RUN npm run build
