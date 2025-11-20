# Stage 1: Build Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist/as232-s5-aej-09-fe/browser /usr/share/nginx/html

# Create a startup script that will replace environment variables
RUN printf '#!/bin/sh\nset -e\n\nexport APIURL=${APIURL:-http://localhost:8080}\n\nfind /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|http://localhost:[0-9]*|${APIURL}|g" {} +\n\nexec nginx -g "daemon off;"\n' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the startup script
ENTRYPOINT ["/docker-entrypoint.sh"]
