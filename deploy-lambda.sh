#!/bin/bash

set -e

echo "🚀 Deploying Concert Backend to AWS Lambda..."

# Build JAR
echo "📦 Building JAR..."
cd main_backend
mvn clean package -DskipTests
cd ..

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t concert-backend main_backend/

# Tag for ECR
echo "🏷️ Tagging for ECR..."
docker tag concert-backend:latest 161326240347.dkr.ecr.ap-southeast-1.amazonaws.com/concert-backend:latest

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 161326240347.dkr.ecr.ap-southeast-1.amazonaws.com

# Push image
echo "⬆️ Pushing image to ECR..."
docker push 161326240347.dkr.ecr.ap-southeast-1.amazonaws.com/concert-backend:latest

# Deploy infrastructure
echo "🏗️ Deploying infrastructure..."
cd infra/terraform/serverless
terraform apply -auto-approve
cd ../../..

echo "✅ Deployment complete!"
echo "🌐 API URL: https://vg3ht9p21k.execute-api.ap-southeast-1.amazonaws.com"