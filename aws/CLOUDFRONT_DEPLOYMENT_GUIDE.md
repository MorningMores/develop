# CloudFront Deployment Guide
**Optimized Multi-CDN Architecture for Concert Platform**

## 🎯 Architecture Overview

You now have **2 separate CloudFront distributions** optimized for different purposes:

### 1. **UGC Distribution** (User-Generated Content)
- **Purpose:** Event pictures + User avatars
- **Price Class:** PriceClass_100 (North America + Europe only)
- **Origins:**
  - `S3-event-pictures` → Event photos
  - `S3-user-avatars` → User profile pictures
- **Cache Behaviors:**
  - `/events/*` → Event pictures (1 day default cache)
  - `/avatars/*` → User avatars (1 hour default cache)

### 2. **Website Distribution** (Frontend Application)
- **Purpose:** Static frontend files (HTML, CSS, JS)
- **Price Class:** PriceClass_All (Global distribution)
- **Origin:** `S3-website` → Frontend build
- **Cache Behaviors:**
  - `/_nuxt/*` → Nuxt build assets (1 week cache)
  - `/images/*` → Static images (1 week cache)
  - Default → HTML files (1 hour cache)

---

## 📊 Current Deployment Status

```bash
cd /Users/putinan/development/DevOps/develop/aws
terraform output
```

### Expected Outputs:

```hcl
# UGC Distribution
cloudfront_ugc_id         = "E1XXXXXXXXX"
cloudfront_ugc_domain     = "d1234567890abc.cloudfront.net"
cloudfront_ugc_url        = "https://d1234567890abc.cloudfront.net"

# Website Distribution
cloudfront_website_id     = "E2XXXXXXXXX"
cloudfront_website_domain = "d0987654321xyz.cloudfront.net"
cloudfront_website_url    = "https://d0987654321xyz.cloudfront.net"

# Usage Examples
usage_examples = {
  event_picture_url = "https://d1234567890abc.cloudfront.net/events/event123.jpg"
  avatar_url        = "https://d1234567890abc.cloudfront.net/avatars/user456.jpg"
  website_url       = "https://d0987654321xyz.cloudfront.net"
}
```

---

## 🚀 How to Use CloudFront

### **1. Upload Files to S3**

#### Via Lambda Presigned URLs (Recommended):

```bash
# Get presigned URL for event picture
curl -X POST https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev/upload/event-picture \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "concert-photo.jpg",
    "contentType": "image/jpeg"
  }'

# Response:
{
  "uploadUrl": "https://concert-event-pictures-161326240347.s3.ap-southeast-1.amazonaws.com/events/concert-photo.jpg?X-Amz-...",
  "fileUrl": "https://concert-event-pictures-161326240347.s3.ap-southeast-1.amazonaws.com/events/concert-photo.jpg",
  "key": "events/concert-photo.jpg"
}

# Upload file using presigned URL
curl -X PUT "<uploadUrl>" \
  -H "Content-Type: image/jpeg" \
  --upload-file concert-photo.jpg
```

#### Via AWS CLI (For website deployment):

```bash
# Upload frontend build to website bucket
aws s3 sync ./dist/ s3://concert-website-161326240347/ \
  --region ap-southeast-1 \
  --exclude "*.map" \
  --cache-control "public, max-age=31536000" \
  --metadata-directive REPLACE

# Specific files with different cache policies
aws s3 cp ./dist/index.html s3://concert-website-161326240347/index.html \
  --region ap-southeast-1 \
  --cache-control "public, max-age=3600" \
  --content-type "text/html"
```

### **2. Access Files via CloudFront**

After uploading, files are automatically available via CloudFront:

```bash
# Event picture (via UGC CDN)
https://d1234567890abc.cloudfront.net/events/concert-photo.jpg

# User avatar (via UGC CDN)
https://d1234567890abc.cloudfront.net/avatars/user123.jpg

# Website (via Website CDN)
https://d0987654321xyz.cloudfront.net
```

---

## 🔄 Cache Invalidation

When you update files, you may need to invalidate CloudFront cache:

```bash
# Get distribution IDs
UGC_DIST=$(terraform output -raw cloudfront_ugc_id)
WEB_DIST=$(terraform output -raw cloudfront_website_id)

# Invalidate specific file
aws cloudfront create-invalidation \
  --distribution-id $UGC_DIST \
  --paths "/events/concert-photo.jpg"

# Invalidate all avatars
aws cloudfront create-invalidation \
  --distribution-id $UGC_DIST \
  --paths "/avatars/*"

# Invalidate entire website (for deployments)
aws cloudfront create-invalidation \
  --distribution-id $WEB_DIST \
  --paths "/*"
```

⚠️ **Free Tier Limit:** 1,000 invalidation paths per month are FREE. Beyond that, $0.005 per path.

---

## 🔐 Security & Permissions

### S3 Bucket Policies:

| Bucket | CloudFront Access | Lambda Access | Public Access |
|--------|------------------|---------------|---------------|
| `event-pictures` | ✅ READ (via OAI) | ✅ WRITE (presigned URL) | ❌ Blocked |
| `user-avatars` | ✅ READ (via OAI) | ✅ WRITE (presigned URL) | ❌ Blocked |
| `website` | ✅ READ (via OAI) | ❌ No access | ❌ Blocked |

### Upload Flow:

```
Client → API Gateway → Lambda → Generate Presigned URL → Client uploads to S3 → CloudFront serves
```

### Access Flow:

```
User → CloudFront (HTTPS) → S3 (via OAI - Private)
```

---

## 💰 Free Tier Limits

### CloudFront (12 months free):
- ✅ **1 TB data transfer OUT** per month
- ✅ **10 million HTTP/HTTPS requests**
- ✅ **2 million CloudFront Function invocations**

### Current Usage Monitoring:

```bash
# Check data transfer
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name BytesDownloaded \
  --dimensions Name=DistributionId,Value=$UGC_DIST \
  --start-time 2025-01-01T00:00:00Z \
  --end-time 2025-01-31T23:59:59Z \
  --period 86400 \
  --statistics Sum \
  --region us-east-1  # CloudFront metrics are in us-east-1

# Check requests
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=$UGC_DIST \
  --start-time 2025-01-01T00:00:00Z \
  --end-time 2025-01-31T23:59:59Z \
  --period 86400 \
  --statistics Sum \
  --region us-east-1
```

### Cost Alarms (Already Deployed):

```bash
# List active alarms
aws cloudwatch describe-alarms \
  --alarm-names \
    concert-cloudfront-data-transfer-dev \
    concert-cloudfront-requests-dev \
  --region ap-southeast-1
```

---

## 🌍 Performance Optimization

### Cache Hit Ratio:

Check how much traffic is served from cache vs. origin:

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=$UGC_DIST \
  --start-time $(date -u -d '1 day ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Average \
  --region us-east-1
```

Target: **>85% cache hit rate**

### TTL Settings:

| Content Type | Min TTL | Default TTL | Max TTL |
|--------------|---------|-------------|---------|
| Event Pictures | 0 | 1 day | 1 year |
| User Avatars | 0 | 1 hour | 1 day |
| HTML Files | 0 | 1 hour | 1 year |
| JS/CSS (_nuxt/*) | 1 day | 1 week | 1 year |
| Static Images | 1 day | 1 week | 1 year |

---

## 🧪 Testing the Setup

### 1. Test S3 Upload:

```bash
#!/bin/bash
# test_upload.sh

API_URL="https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev"
UGC_CDN=$(terraform output -raw cloudfront_ugc_url)

# Create test image
echo "Creating test image..."
convert -size 100x100 xc:blue test.jpg

# Get presigned URL
echo "Getting presigned URL..."
RESPONSE=$(curl -s -X POST "$API_URL/upload/event-picture" \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.jpg", "contentType": "image/jpeg"}')

UPLOAD_URL=$(echo $RESPONSE | jq -r '.uploadUrl')
KEY=$(echo $RESPONSE | jq -r '.key')

# Upload file
echo "Uploading to S3..."
curl -X PUT "$UPLOAD_URL" \
  -H "Content-Type: image/jpeg" \
  --upload-file test.jpg

# Wait for propagation
echo "Waiting 30s for CloudFront propagation..."
sleep 30

# Test CloudFront access
CLOUDFRONT_URL="$UGC_CDN/$KEY"
echo "Testing CloudFront URL: $CLOUDFRONT_URL"
curl -I "$CLOUDFRONT_URL"

# Check cache status
curl -I "$CLOUDFRONT_URL" | grep -i "x-cache"
# Expected: X-Cache: Hit from cloudfront (on 2nd request)
```

### 2. Test Website Deployment:

```bash
#!/bin/bash
# deploy_website.sh

WEBSITE_BUCKET="concert-website-161326240347"
WEBSITE_CDN=$(terraform output -raw cloudfront_website_url)
DIST_ID=$(terraform output -raw cloudfront_website_id)

# Build frontend (example for Nuxt)
cd /Users/putinan/development/DevOps/develop/main_frontend/concert1
npm run build

# Upload to S3
echo "Uploading build to S3..."
aws s3 sync .output/public/ s3://$WEBSITE_BUCKET/ \
  --region ap-southeast-1 \
  --delete \
  --cache-control "public, max-age=31536000"

# Upload index.html with shorter cache
aws s3 cp .output/public/index.html s3://$WEBSITE_BUCKET/index.html \
  --region ap-southeast-1 \
  --cache-control "public, max-age=3600" \
  --content-type "text/html"

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DIST_ID \
  --paths "/*"

echo "Website deployed to: $WEBSITE_CDN"
```

---

## 🔧 Troubleshooting

### Issue: "Access Denied" when accessing CloudFront URL

**Cause:** S3 bucket policy not allowing CloudFront OAI

**Solution:**
```bash
# Verify OAI has access
aws s3api get-bucket-policy \
  --bucket concert-event-pictures-161326240347 \
  --region ap-southeast-1 | jq '.Policy | fromjson'

# Should see CloudFront OAI ARN in Principal
```

### Issue: "SignatureDoesNotMatch" when uploading

**Cause:** Presigned URL expired or incorrect

**Solution:**
```bash
# Presigned URLs are valid for 5 minutes (default)
# Generate a new one and upload immediately

# Check Lambda logs
aws logs tail /aws/lambda/concert-generate-presigned-url \
  --follow \
  --region ap-southeast-1
```

### Issue: Slow cache propagation

**Cause:** CloudFront distribution still deploying

**Solution:**
```bash
# Check distribution status
aws cloudfront get-distribution \
  --id $(terraform output -raw cloudfront_ugc_id) \
  --query 'Distribution.Status' \
  --output text

# Wait for "Deployed" status (10-15 minutes)
```

### Issue: 403 Forbidden on website

**Cause:** Missing index.html or incorrect S3 bucket policy

**Solution:**
```bash
# Verify index.html exists
aws s3 ls s3://concert-website-161326240347/index.html \
  --region ap-southeast-1

# Check bucket policy allows CloudFront
aws s3api get-bucket-policy \
  --bucket concert-website-161326240347 \
  --region ap-southeast-1
```

---

## 📱 Frontend Integration

### Update Frontend Environment Variables:

```javascript
// .env.production (Nuxt)
VITE_UGC_CDN_URL=https://d1234567890abc.cloudfront.net
VITE_API_URL=https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev
VITE_WEBSITE_URL=https://d0987654321xyz.cloudfront.net
```

### Example: Display Event Picture

```vue
<template>
  <div>
    <img 
      :src="eventPictureUrl" 
      alt="Event" 
      loading="lazy"
    />
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const eventKey = "events/concert123.jpg"

const eventPictureUrl = computed(() => {
  return `${config.public.ugcCdnUrl}/${eventKey}`
})
</script>
```

### Example: Upload Avatar

```vue
<script setup>
const uploadAvatar = async (file) => {
  // 1. Get presigned URL
  const response = await $fetch('/upload/avatar', {
    method: 'POST',
    body: {
      filename: file.name,
      contentType: file.type
    }
  })

  // 2. Upload to S3
  await $fetch(response.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  })

  // 3. Use CloudFront URL
  const avatarUrl = `${config.public.ugcCdnUrl}/${response.key}`
  console.log('Avatar uploaded:', avatarUrl)
}
</script>
```

---

## 📈 Monitoring & Alerts

### CloudWatch Alarms Deployed:

1. **CloudFront Data Transfer** (`concert-cloudfront-data-transfer-dev`)
   - Threshold: 900 GB/day
   - Action: SNS alert to `concert-alerts-dev`

2. **CloudFront Requests** (`concert-cloudfront-requests-dev`)
   - Threshold: 300k requests/day
   - Action: SNS alert to `concert-alerts-dev`

### View Metrics Dashboard:

```bash
# Open CloudWatch console
open "https://console.aws.amazon.com/cloudwatch/home?region=ap-southeast-1#dashboards:"

# Or via CLI
aws cloudwatch get-dashboard \
  --dashboard-name ConcertMetricsDashboard \
  --region ap-southeast-1
```

---

## 🎉 Summary

You now have:
- ✅ **2 CloudFront distributions** deployed
- ✅ **3 S3 buckets** (event-pictures, user-avatars, website)
- ✅ **Secure access** via CloudFront OAI
- ✅ **Lambda presigned URLs** for uploads
- ✅ **Cost monitoring** with CloudWatch alarms
- ✅ **FREE TIER optimized** architecture

### Next Steps:

1. ✅ **DONE:** CloudFront distributions deployed
2. ⏳ **Deploy frontend** to website bucket
3. ⏳ **Update frontend** to use CloudFront URLs
4. ⏳ **Test end-to-end** upload and access flow
5. ⏳ **Monitor usage** to stay within free tier

### Quick Commands:

```bash
# Get CloudFront URLs
terraform output | grep cloudfront

# Test upload
./test_upload.sh

# Deploy website
./deploy_website.sh

# Check status
terraform show | grep cloudfront

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_ugc_id) \
  --paths "/*"
```

---

**📅 Deployment Date:** 2025-01-31  
**🌏 Region:** ap-southeast-1 (Singapore)  
**💵 Expected Monthly Cost:** $0.00 (within free tier limits)
