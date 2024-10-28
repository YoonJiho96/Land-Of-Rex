# Frontend Dockerfile

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

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
