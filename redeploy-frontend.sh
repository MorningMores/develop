#!/bin/bash
set -e

echo "🔨 Building frontend..."
cd main_frontend/concert1
npm run generate
cd ../..

echo "📦 Uploading to S3 Singapore..."
aws s3 sync main_frontend/concert1/.output/public/ s3://concert-web-singapore-161326240347/ --delete

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E1KJ1O0NQAT0B9 --paths "/*"

echo "✅ Frontend redeployed successfully!"
echo "🌐 URL: https://d3jivuimmea02r.cloudfront.net"
