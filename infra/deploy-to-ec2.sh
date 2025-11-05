#!/bin/bash
# Deploy Spring Boot API to EC2 using Docker
# Run from: /Users/putinan/development/DevOps/develop

set -e

# Configuration
EC2_INSTANCE_ID="i-031914475e91af608"
REGION="us-east-1"
ECR_IMAGE="161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:lambda-v2"
CONTAINER_NAME="concert-api"

echo "🚀 Deploying Spring Boot API to EC2..."

# Get EC2 public IP
EC2_IP=$(aws ec2 describe-instances \
  --instance-ids "$EC2_INSTANCE_ID" \
  --region "$REGION" \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

echo "📍 EC2 Instance: $EC2_IP"

# Get database credentials
echo "🔐 Retrieving database credentials..."
DB_CREDENTIALS=$(aws secretsmanager get-secret-value \
  --secret-id concert-prod/database \
  --region "$REGION" \
  --query 'SecretString' \
  --output text)

DB_USERNAME=$(echo "$DB_CREDENTIALS" | jq -r '.username')
DB_PASSWORD=$(echo "$DB_CREDENTIALS" | jq -r '.password')

echo "✅ Credentials retrieved"

# Create deployment script for EC2
cat > /tmp/deploy-on-ec2.sh << 'EOF'
#!/bin/bash
set -e

echo "🐳 Installing Docker if not present..."
if ! command -v docker &> /dev/null; then
    sudo yum update -y
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ec2-user
fi

echo "🔑 Logging into ECR..."
aws ecr get-login-password --region us-east-1 | \
  sudo docker login --username AWS --password-stdin 161326240347.dkr.ecr.us-east-1.amazonaws.com

echo "🛑 Stopping existing container..."
sudo docker stop concert-api 2>/dev/null || true
sudo docker rm concert-api 2>/dev/null || true

echo "📥 Pulling latest image..."
sudo docker pull 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:lambda-v2

echo "🚀 Starting new container..."
sudo docker run -d \
  --name concert-api \
  --restart unless-stopped \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://concert-prod-db.csfsyoiy61fp.us-east-1.rds.amazonaws.com:3306/concert" \
  -e SPRING_DATASOURCE_USERNAME="REPLACE_DB_USERNAME" \
  -e SPRING_DATASOURCE_PASSWORD="REPLACE_DB_PASSWORD" \
  -e SPRING_PROFILES_ACTIVE="prod" \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO="update" \
  -e REDIS_ENDPOINT="concert-prod-redis-tx4y2n.serverless.use1.cache.amazonaws.com" \
  -e REDIS_PORT="6379" \
  -e COGNITO_USER_POOL_ID="us-east-1_nTZpyinXc" \
  -e COGNITO_CLIENT_ID="5fpck32uhi8m87b5tkirvaf0iu" \
  -e S3_BUCKET_NAME="concert-prod-web-161326240347" \
  161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:lambda-v2

echo "⏳ Waiting for container to start..."
sleep 10

echo "📊 Container status:"
sudo docker ps | grep concert-api || echo "Container not running!"

echo "📋 Recent logs:"
sudo docker logs concert-api --tail 20

echo "✅ Deployment complete!"
echo "🌐 API should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
EOF

# Replace credentials in script
sed -i '' "s/REPLACE_DB_USERNAME/$DB_USERNAME/g" /tmp/deploy-on-ec2.sh
sed -i '' "s/REPLACE_DB_PASSWORD/$DB_PASSWORD/g" /tmp/deploy-on-ec2.sh

# Copy and execute deployment script on EC2
echo "📤 Uploading deployment script to EC2..."
aws ssm send-command \
  --instance-ids "$EC2_INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=[
    'cat > /tmp/deploy.sh << EOF',
    '$(cat /tmp/deploy-on-ec2.sh)',
    'EOF',
    'chmod +x /tmp/deploy.sh',
    '/tmp/deploy.sh'
  ]" \
  --region "$REGION" \
  --output json > /tmp/ssm-command.json

COMMAND_ID=$(jq -r '.Command.CommandId' /tmp/ssm-command.json)

echo "⏳ Waiting for deployment to complete (Command ID: $COMMAND_ID)..."
sleep 30

# Get command output
aws ssm get-command-invocation \
  --command-id "$COMMAND_ID" \
  --instance-id "$EC2_INSTANCE_ID" \
  --region "$REGION" \
  --query 'StandardOutputContent' \
  --output text

echo ""
echo "✅ Deployment Complete!"
echo "🌐 API Endpoint: http://$EC2_IP:8080"
echo "🏥 Health Check: http://$EC2_IP:8080/health"
echo ""
echo "Test with:"
echo "  curl http://$EC2_IP:8080/health"
echo "  curl http://$EC2_IP:8080/api/auth/test"
