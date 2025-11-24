# ============================================
# Multi-Stage Dockerfile para Angular + Nginx
# ============================================
# Este Dockerfile construye la aplicación Angular
# y la sirve usando Nginx con soporte para variables
# de entorno dinámicas en tiempo de ejecución
# ============================================

# =====================================
# STAGE 1: Build Angular Application
# =====================================
FROM node:20-alpine AS build

LABEL maintainer="Fernando Mencia"
LABEL description="APIs AI Demos - Frontend Angular Build Stage"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies needed for build)
RUN npm ci --legacy-peer-deps

# Copy source code --- 
COPY . .

# Build the application for production
RUN npm run build

# ============================================
# STAGE 2: Serve with Nginx
# ============================================
FROM nginx:alpine

LABEL maintainer="Fernando Mencia"
LABEL description="APIs AI Demos - Frontend Angular Production"

# Install gettext for envsubst (environment variable substitution)
RUN apk add --no-cache gettext

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist/as232-s5-aej-09-fe/browser /usr/share/nginx/html

# Create startup script to inject environment variables
# This script replaces API URLs in JavaScript files at container startup
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
# Set default API URL if not provided\n\
export APIURL=${APIURL:-http://localhost:8080}\n\
\n\
echo "=========================================="\n\
echo "Frontend Starting..."\n\
echo "=========================================="\n\
echo "API URL: ${APIURL}"\n\
echo "=========================================="\n\
\n\
# Generate config.json with dynamic API URL\n\
echo "Generating config.json..."\n\
echo "{\\"apiUrl\\": \\"${APIURL}\\"}" > /usr/share/nginx/html/config.json\n\
\n\
# Replace API URLs in all JavaScript files\n\
# This allows dynamic configuration without rebuilding the image\n\
echo "Configuring API endpoints..."\n\
find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|http://localhost:[0-9]*|${APIURL}|g" {} +\n\
\n\
echo "Configuration complete!"\n\
echo "=========================================="\n\
\n\
# Start Nginx\n\
exec nginx -g "daemon off;"\n\
' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Use the startup script as entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# ============================================
# BUILD INSTRUCTIONS:
# ============================================
# Build:  docker build -t luismencia/apis-ai-demos-frontend:latest .
# Run:    docker run -p 4200:80 -e APIURL=http://localhost:8080 luismencia/apis-ai-demos-frontend:latest
# Push:   docker push luismencia/apis-ai-demos-frontend:latest
# ============================================
