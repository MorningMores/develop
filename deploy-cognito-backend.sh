#!/bin/bash
set -e

# 🚀 Deploy Backend with Cognito Support to EC2
# RDS: concert-prod-db.cpy08oyiq2n5.ap-southeast-1.rds.amazonaws.com
# EC2: 52.221.197.39

echo "🔨 Building Docker image for linux/amd64..."
cd main_backend
docker buildx build --platform linux/amd64 \
  -t 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:latest \
  --push .

echo "📦 Deploying to EC2..."
ssh -o StrictHostKeyChecking=no ec2-user@52.221.197.39 << 'ENDSSH'
  # Stop old container
  docker stop $(docker ps -q) 2>/dev/null || true
  docker rm $(docker ps -aq) 2>/dev/null || true
  
  # Login to ECR
  aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin 161326240347.dkr.ecr.us-east-1.amazonaws.com
  
  # Pull latest image
  docker pull 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:latest
  
  # Run with Cognito config
  docker run -d -p 8080:8080 \
    -e SPRING_DATASOURCE_URL=jdbc:mysql://concert-prod-db.cpy08oyiq2n5.ap-southeast-1.rds.amazonaws.com:3306/concert_db \
    -e SPRING_DATASOURCE_USERNAME=admin \
    -e SPRING_DATASOURCE_PASSWORD=Concert2024! \
    -e AWS_REGION=us-east-1 \
    -e AWS_S3_EVENT_PICTURES_BUCKET=concert-event-pictures-useast1-161326240347 \
    -e AWS_S3_USER_AVATARS_BUCKET=concert-user-avatars-useast1-161326240347 \
    -e AWS_COGNITO_USER_POOL_ID=us-east-1_nTZpyinXc \
    -e AWS_COGNITO_CLIENT_ID=5fpck32uhi8m87b5tkirvaf0iu \
    -e AWS_COGNITO_REGION=us-east-1 \
    --restart unless-stopped \
    161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:latest
  
  echo "✅ Container started. Waiting for health check..."
  sleep 10
  
  # Show container status
  docker ps
  
  # Show logs
  echo ""
  echo "📋 Application logs (last 20 lines):"
  docker logs $(docker ps -q) --tail 20
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Test endpoints:"
echo "  Health: curl http://52.221.197.39:8080/api/auth/test"
echo "  Register: curl -X POST http://52.221.197.39:8080/api/auth/register -H 'Content-Type: application/json' -d '{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"Test1234!\"}'"
echo ""
echo "📊 CloudFront URLs:"
echo "  Images CDN: https://dzh397ixo71bk.cloudfront.net"
echo "  Web CDN: https://d3jivuimmea02r.cloudfront.net"
echo ""
echo "🔑 Cognito:"
echo "  Pool: us-east-1_nTZpyinXc"
echo "  Client: 5fpck32uhi8m87b5tkirvaf0iu"
