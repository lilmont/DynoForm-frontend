# Step 1: Use Node.js to build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

RUN npm install -g @angular/cli

# Copy the Angular project files
COPY . .

# Build the Angular app
RUN ng build --configuration=production

# Step 2: Use a lightweight web server to serve the app
FROM nginx:latest

# Copy built app files to the web server's root directory
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder app/dist/dyno-form.frontend/browser /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

