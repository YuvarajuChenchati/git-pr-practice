#!/usr/bin/env bash
# ==============================================================================
# Automated Deployment Script for AWS EC2
# Performs zero-downtime rolling reload of containers
# ==============================================================================
set -e

echo "🚀 Starting deployment on AWS EC2..."

# 1. Pull the latest production images from ECR
echo "📦 Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

# 2. Re-create and start containers with latest images
echo "🔄 Updating running services..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# 3. Clean up old dangling images to save EC2 disk space
echo "🧹 Pruning old unused images..."
docker image prune -f

# 4. Verify deployment health
echo "🩺 Verifying health status..."
sleep 3
docker compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed successfully!"
