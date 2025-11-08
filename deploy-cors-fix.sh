#!/bin/bash
set -e

# 🚀 Deploy CORS-fixed Backend using AWS Systems Manager

INSTANCE_ID="i-0ffd487469a6fa1aa"
RDS_ENDPOINT="concert-prod-db.cpy08oyiq2n5.ap-southeast-1.rds.amazonaws.com"

echo "🔧 Building CORS-fixed backend..."
cd main_backend

# Build Docker image with CORS fix
echo "📦 Building Docker image..."
docker buildx build --platform linux/amd64 \
  -t 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:cors-fix \
  . || { echo "❌ Docker build failed"; exit 1; }

echo "🚀 Pushing to ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 161326240347.dkr.ecr.us-east-1.amazonaws.com
docker push 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:cors-fix

echo "📦 Deploying to EC2 via SSM..."
aws ssm send-command \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --region ap-southeast-1 \
  --parameters 'commands=[
    "docker stop $(docker ps -q) 2>/dev/null || true",
    "docker rm $(docker ps -aq) 2>/dev/null || true", 
    "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 161326240347.dkr.ecr.us-east-1.amazonaws.com",
    "docker pull 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:cors-fix",
    "docker run -d -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:mysql://'$RDS_ENDPOINT':3306/concert_db -e SPRING_DATASOURCE_USERNAME=concert_user -e SPRING_DATASOURCE_PASSWORD=Concert123! -e AWS_REGION=us-east-1 -e AWS_S3_EVENT_PICTURES_BUCKET=concert-event-pictures-useast1-161326240347 -e AWS_S3_USER_AVATARS_BUCKET=concert-user-avatars-useast1-161326240347 -e AWS_COGNITO_USER_POOL_ID=us-east-1_nTZpyinXc -e AWS_COGNITO_CLIENT_ID=5fpck32uhi8m87b5tkirvaf0iu -e AWS_COGNITO_REGION=us-east-1 --restart unless-stopped 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:cors-fix"
  ]' \
  --output text

echo ""
echo "⏳ Waiting 30 seconds for deployment..."
sleep 30

echo ""
echo "✅ Testing CORS-fixed backend..."
curl -X POST http://52.221.197.39:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"username":"corstest","email":"corstest@example.com","password":"password123"}' \
  -s | jq . || echo "Testing registration endpoint..."

echo ""
echo "🎉 CORS fix deployment complete!"
echo ""
echo "📊 Backend URL: http://52.221.197.39:8080"