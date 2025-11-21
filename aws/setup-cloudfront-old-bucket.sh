#!/bin/bash

set -e

BUCKET_NAME="concert-web-singapore-161326240347"
REGION="ap-southeast-1"

echo "☁️ Setting up CloudFront for existing bucket: $BUCKET_NAME"

# Check if CloudFront distribution already exists
EXISTING_DIST=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='$BUCKET_NAME.s3.$REGION.amazonaws.com']].Id" --output text)

if [ ! -z "$EXISTING_DIST" ]; then
  echo "⚠️  CloudFront distribution already exists: $EXISTING_DIST"
  DIST_DOMAIN=$(aws cloudfront get-distribution --id $EXISTING_DIST --query 'Distribution.DomainName' --output text)
  echo "🌐 URL: https://$DIST_DOMAIN"
  exit 0
fi

# Create new CloudFront distribution
cat > /tmp/cf-dist.json <<EOF
{
  "CallerReference": "$(date +%s)",
  "Comment": "Concert Frontend - Old Bucket",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-$BUCKET_NAME",
      "DomainName": "$BUCKET_NAME.s3.$REGION.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$BUCKET_NAME",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 404,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 300
    }]
  },
  "Enabled": true
}
EOF

echo "📦 Creating CloudFront distribution..."
DIST_OUTPUT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cf-dist.json)

DIST_ID=$(echo $DIST_OUTPUT | jq -r '.Distribution.Id')
DIST_DOMAIN=$(echo $DIST_OUTPUT | jq -r '.Distribution.DomainName')

echo "✅ CloudFront created!"
echo ""
echo "🌐 HTTPS URL: https://$DIST_DOMAIN"
echo "📋 Distribution ID: $DIST_ID"
echo ""
echo "⏳ Wait 15-20 minutes for deployment"
echo ""
echo "💾 Save this:"
echo "  Frontend: https://$DIST_DOMAIN"
echo "  Backend: http://$(kubectl get svc concert-backend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo 'PENDING')"

rm /tmp/cf-dist.json
