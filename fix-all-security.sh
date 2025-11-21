#!/bin/bash
# Auto-fix all security groups and policies

echo "🔒 Fixing all security configurations..."

# Get resource IDs
EKS_SG=$(aws ec2 describe-instances --instance-ids i-021328b8eb58f98f1 --query "Reservations[0].Instances[0].SecurityGroups[0].GroupId" --output text)
RDS_SG="sg-035f95044d71a24fb"
ALB_SG=$(aws elbv2 describe-load-balancers --query "LoadBalancers[?contains(LoadBalancerArn, 'a5506e597994d4f62beee803a6829b1a')].SecurityGroups[0]" --output text)

echo "EKS Security Group: $EKS_SG"
echo "RDS Security Group: $RDS_SG" 
echo "ALB Security Group: $ALB_SG"

# Fix RDS access from EKS
echo "🔧 Allowing EKS to access RDS..."
aws ec2 authorize-security-group-ingress --group-id $RDS_SG --protocol tcp --port 3306 --source-group $EKS_SG 2>/dev/null || echo "Rule already exists"

# Fix ALB access to EKS
echo "🔧 Allowing ALB to access EKS..."
aws ec2 authorize-security-group-ingress --group-id $EKS_SG --protocol tcp --port 8080 --source-group $ALB_SG 2>/dev/null || echo "Rule already exists"

# Fix S3 bucket policy
echo "🔧 Fixing S3 bucket policy..."
aws s3api put-bucket-policy --bucket concert-web-singapore-161326240347 --policy file://s3-bucket-policy.json

echo "✅ All security configurations fixed!"
echo "🚀 Ready for deployment"