#!/bin/bash
set -e

echo "🧹 Cleaning up old container if exists..."
docker rm -f gpa-react-container || true

echo "📦 Navigating to app directory..."
if [ -d "gpa-react" ]; then
  cd gpa-react
  git pull origin main
else
  git clone https://github.com/RawailEocean/gpa-react.git
  cd gpa-react
fi

echo "🔨 Building Docker image (this may take time)..."
docker build -t gpa-react . 2>&1

echo "🚀 Running new Docker container..."
docker run -d --name gpa-react-container -p 80:80 gpa-react

echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

echo "✅ Deployment completed!"
