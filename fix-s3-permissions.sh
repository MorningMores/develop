#!/bin/bash

echo "🔧 Fixing S3 permissions for Lambda..."

# Add S3 permissions to Lambda role
aws iam attach-role-policy \
  --region ap-southeast-1 \
  --role-name concert-prod-api-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

echo "✅ S3 permissions added to Lambda role"

# Test S3 bucket access
echo "Testing S3 bucket access..."
aws s3 ls s3://concert-event-pictures-singapore-161326240347/ --region ap-southeast-1

echo "✅ S3 permissions should now work for photo uploads"