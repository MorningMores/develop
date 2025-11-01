# 🔄 Complete System Flow Diagram
**Concert Platform - Singapore Deployment**

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USERS / CLIENTS                                    │
│                    (Browser, Mobile App, API Clients)                        │
└──────────────────┬──────────────────────────────────┬────────────────────────┘
                   │                                  │
                   │ HTTPS                            │ HTTPS
                   ▼                                  ▼
      ┌────────────────────────┐         ┌────────────────────────┐
      │  CloudFront UGC CDN    │         │  CloudFront Website    │
      │  (Event/Avatar Images) │         │  (Static Frontend)     │
      │  d1234.cloudfront.net  │         │  d5678.cloudfront.net  │
      └────────────┬───────────┘         └────────────┬───────────┘
                   │                                  │
                   │ Private (OAI)                    │ Private (OAI)
                   ▼                                  ▼
      ┌────────────────────────┐         ┌────────────────────────┐
      │  S3 Event Pictures     │         │  S3 Website Bucket     │
      │  S3 User Avatars       │         │  (Frontend Build)      │
      └────────────────────────┘         └────────────────────────┘
```

---

## 🔄 Flow 1: File Upload (Event Pictures / Avatars)

### **Step-by-Step Upload Flow:**

```
1. USER REQUEST
   │
   ├─> Client (Browser/App)
   │   └─> Wants to upload event picture or avatar
   │
   ▼
2. REQUEST PRESIGNED URL
   │
   ├─> POST https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev/upload/event-picture
   │   └─> Headers: { "Content-Type": "application/json" }
   │   └─> Body: { "filename": "concert.jpg", "contentType": "image/jpeg" }
   │
   ▼
3. API GATEWAY
   │
   ├─> AWS API Gateway HTTP API (v2)
   │   └─> Route: POST /upload/event-picture
   │   └─> Integration: AWS_PROXY → Lambda
   │   └─> CORS enabled (localhost:3000 + production domain)
   │
   ▼
4. LAMBDA FUNCTION
   │
   ├─> Function: concert-generate-presigned-url
   │   ├─> Runtime: Python 3.11
   │   ├─> Memory: 128 MB
   │   ├─> Timeout: 3 seconds
   │   ├─> Role: concert-lambda-presigned-url-role
   │   │
   │   └─> Code Logic:
   │       ├─> Parse request (filename, contentType)
   │       ├─> Generate S3 key (e.g., "events/uuid-concert.jpg")
   │       ├─> Call S3 generate_presigned_url()
   │       │   └─> Method: PUT
   │       │   └─> Expiration: 300 seconds (5 minutes)
   │       │   └─> Permissions: s3:PutObject
   │       │
   │       └─> Return JSON:
   │           {
   │             "uploadUrl": "https://concert-event-pictures-xxx.s3...?X-Amz-...",
   │             "fileUrl": "https://concert-event-pictures-xxx.s3.../events/file.jpg",
   │             "key": "events/uuid-concert.jpg"
   │           }
   │
   ▼
5. CLIENT UPLOAD
   │
   ├─> Client receives presigned URL
   │   └─> PUT request directly to S3 presigned URL
   │       ├─> Headers: { "Content-Type": "image/jpeg" }
   │       ├─> Body: Binary file data
   │       └─> No AWS credentials needed!
   │
   ▼
6. S3 STORAGE
   │
   ├─> S3 Bucket: concert-event-pictures-161326240347
   │   ├─> Encryption: AES-256 (server-side)
   │   ├─> Versioning: Enabled
   │   ├─> Access: Private (blocked public access)
   │   │
   │   └─> Permissions:
   │       ├─> Lambda: s3:PutObject, s3:GetObject, s3:DeleteObject
   │       └─> CloudFront OAI: s3:GetObject (read-only)
   │
   ▼
7. CLOUDFRONT ACCESS
   │
   └─> File accessible via CloudFront CDN:
       └─> https://d1234.cloudfront.net/events/uuid-concert.jpg
           ├─> Cache TTL: 1 day default, 1 year max
           ├─> Compression: Gzip enabled
           ├─> HTTPS: Enforced (redirect from HTTP)
           └─> Global edge locations (Price Class 100: NA + EU)
```

### **Upload Flow Code Example:**

```javascript
// Frontend (Nuxt/Vue)
async function uploadEventPicture(file) {
  // Step 1: Get presigned URL from API Gateway
  const response = await fetch(
    'https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev/upload/event-picture',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type
      })
    }
  )
  
  const { uploadUrl, key } = await response.json()
  
  // Step 2: Upload directly to S3 using presigned URL
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  })
  
  // Step 3: Use CloudFront URL for display
  const cloudFrontUrl = `https://d1234.cloudfront.net/${key}`
  return cloudFrontUrl
}
```

---

## 🌐 Flow 2: Website Access (Frontend)

### **Step-by-Step Website Flow:**

```
1. USER REQUEST
   │
   ├─> Browser requests: https://d5678.cloudfront.net
   │
   ▼
2. CLOUDFRONT CDN
   │
   ├─> CloudFront Distribution: Website CDN
   │   ├─> Check cache: Do we have index.html?
   │   │   ├─> YES → Return from edge cache (X-Cache: Hit)
   │   │   └─> NO → Fetch from S3 origin
   │   │
   │   └─> Cache Behaviors:
   │       ├─> Default (HTML): TTL 1 hour
   │       ├─> /_nuxt/* (JS/CSS): TTL 1 week
   │       └─> /images/*: TTL 1 week
   │
   ▼
3. S3 ORIGIN
   │
   ├─> S3 Bucket: concert-website-161326240347
   │   ├─> Fetch: index.html
   │   ├─> Access: Via CloudFront OAI (private)
   │   └─> Website configuration:
   │       ├─> Index: index.html
   │       └─> Error: index.html (SPA routing)
   │
   ▼
4. RESPONSE
   │
   └─> CloudFront returns to browser:
       ├─> index.html (cached at edge)
       ├─> Headers:
       │   ├─> X-Cache: Hit from cloudfront
       │   ├─> Cache-Control: public, max-age=3600
       │   └─> Content-Encoding: gzip
       │
       └─> Browser loads HTML and requests assets:
           ├─> /_nuxt/entry.js (cached 1 week)
           ├─> /_nuxt/styles.css (cached 1 week)
           └─> /images/logo.png (cached 1 week)
```

### **Website Deployment Flow:**

```
1. BUILD FRONTEND
   │
   ├─> cd main_frontend/concert1
   │   └─> npm run build
   │       └─> Output: .output/public/
   │           ├─> index.html
   │           ├─> _nuxt/entry.js
   │           ├─> _nuxt/styles.css
   │           └─> images/
   │
   ▼
2. UPLOAD TO S3
   │
   ├─> aws s3 sync .output/public/ s3://concert-website-161326240347/
   │   ├─> --delete (remove old files)
   │   ├─> --cache-control "public, max-age=31536000" (1 year)
   │   │
   │   └─> Special handling for index.html:
   │       └─> aws s3 cp index.html s3://... --cache-control "public, max-age=3600"
   │
   ▼
3. INVALIDATE CLOUDFRONT CACHE
   │
   └─> aws cloudfront create-invalidation \
       --distribution-id E2XXXXXXXXX \
       --paths "/*"
       │
       └─> Invalidates edge cache (takes ~5-10 minutes)
```

---

## 📸 Flow 3: Image Display (Event/Avatar)

### **Step-by-Step Display Flow:**

```
1. USER VIEWS PAGE
   │
   ├─> Browser loads HTML
   │   └─> <img src="https://d1234.cloudfront.net/events/uuid-concert.jpg">
   │
   ▼
2. CLOUDFRONT REQUEST
   │
   ├─> GET https://d1234.cloudfront.net/events/uuid-concert.jpg
   │   │
   │   └─> Cache Check:
   │       ├─> First Request: X-Cache: Miss from cloudfront
   │       │   └─> Fetch from S3 origin
   │       │
   │       └─> Subsequent Requests: X-Cache: Hit from cloudfront
   │           └─> Serve from edge cache (0ms latency!)
   │
   ▼
3. S3 ORIGIN (if cache miss)
   │
   ├─> S3 Bucket: concert-event-pictures-161326240347
   │   └─> Access via CloudFront OAI
   │       └─> Returns: events/uuid-concert.jpg
   │
   ▼
4. CLOUDFRONT RESPONSE
   │
   └─> Returns to browser:
       ├─> Image bytes (compressed if JPEG/PNG supports it)
       ├─> Headers:
       │   ├─> Cache-Control: public, max-age=86400 (1 day)
       │   ├─> X-Cache: Hit from cloudfront
       │   └─> Age: 3600 (cached for 1 hour)
       │
       └─> Browser displays image
```

---

## 🔐 Flow 4: Security & Permissions

### **Permission Flow Diagram:**

```
┌────────────────────────────────────────────────────────────┐
│                     IAM ROLES & POLICIES                    │
└────────────────────────────────────────────────────────────┘

1. LAMBDA ROLE (concert-lambda-presigned-url-role)
   │
   ├─> Assume Role Policy:
   │   └─> Service: lambda.amazonaws.com
   │
   └─> Attached Policies:
       ├─> AWSLambdaBasicExecutionRole (logs)
       └─> Custom S3 Policy:
           ├─> s3:GetObject (event-pictures/*, user-avatars/*)
           └─> s3:PutObject (event-pictures/*, user-avatars/*)

2. CLOUDFRONT OAI (Origin Access Identity)
   │
   ├─> UGC OAI: EA944KE54B1C6
   │   └─> S3 Bucket Policies:
   │       ├─> event-pictures: s3:GetObject
   │       └─> user-avatars: s3:GetObject
   │
   └─> Website OAI: E29ER9INQ469SC
       └─> S3 Bucket Policy:
           └─> website: s3:GetObject

3. S3 BUCKET POLICIES
   │
   ├─> concert-event-pictures-161326240347:
   │   ├─> CloudFront OAI → s3:GetObject (read)
   │   └─> Lambda Role → s3:PutObject, s3:DeleteObject, s3:GetObject (write)
   │
   ├─> concert-user-avatars-161326240347:
   │   ├─> CloudFront OAI → s3:GetObject (read)
   │   └─> Lambda Role → s3:PutObject, s3:DeleteObject, s3:GetObject (write)
   │
   └─> concert-website-161326240347:
       └─> CloudFront OAI → s3:GetObject (read only)
```

---

## 📊 Flow 5: Monitoring & Alerts

### **CloudWatch Flow:**

```
1. API GATEWAY LOGS
   │
   ├─> Log Group: /aws/apigateway/concert-file-upload
   │   └─> Retention: 7 days
   │   └─> Logs:
   │       ├─> Request ID
   │       ├─> Source IP
   │       ├─> HTTP method
   │       ├─> Status code
   │       └─> Response length
   │
   ▼
2. LAMBDA LOGS
   │
   ├─> Log Group: /aws/lambda/concert-generate-presigned-url
   │   └─> Retention: 7 days
   │   └─> Logs:
   │       ├─> Execution start/end
   │       ├─> Errors/exceptions
   │       └─> Custom logs (print statements)
   │
   ▼
3. CLOUDFRONT METRICS
   │
   ├─> Namespace: AWS/CloudFront
   │   └─> Metrics:
   │       ├─> BytesDownloaded (data transfer)
   │       ├─> Requests (request count)
   │       ├─> CacheHitRate (cache efficiency)
   │       └─> 4xxErrorRate, 5xxErrorRate
   │
   ▼
4. CLOUDWATCH ALARMS
   │
   ├─> concert-cloudfront-data-transfer-dev
   │   ├─> Metric: BytesDownloaded
   │   ├─> Threshold: 900 GB/day (90% of free tier)
   │   └─> Action: SNS → concert-alerts-dev
   │
   └─> concert-cloudfront-requests-dev
       ├─> Metric: Requests
       ├─> Threshold: 300k/day (3% of free tier)
       └─> Action: SNS → concert-alerts-dev
```

---

## 🔄 Flow 6: Complete Request Lifecycle

### **Trace a Single Image Upload:**

```
Timeline: T=0 to T=10 seconds

T=0.000s  │ User clicks "Upload Event Picture"
          │
T=0.100s  │ Frontend: POST to API Gateway
          │ └─> Request: { filename: "concert.jpg", contentType: "image/jpeg" }
          │
T=0.150s  │ API Gateway receives request
          │ ├─> Validates CORS
          │ ├─> Logs to CloudWatch
          │ └─> Invokes Lambda (AWS_PROXY integration)
          │
T=0.200s  │ Lambda starts execution
          │ ├─> Parse event body
          │ ├─> Generate UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
          │ ├─> S3 key: events/a1b2c3d4-e5f6-7890-abcd-ef1234567890-concert.jpg
          │ └─> Generate presigned URL (expires in 300s)
          │
T=0.300s  │ Lambda returns response
          │ └─> { uploadUrl: "https://...", key: "events/...", fileUrl: "..." }
          │
T=0.350s  │ API Gateway returns to client
          │ ├─> Status: 200 OK
          │ └─> Body: Presigned URL JSON
          │
T=0.400s  │ Frontend receives presigned URL
          │ └─> Initiates PUT request to S3
          │
T=0.500s  │ S3 receives upload
          │ ├─> Validates presigned signature
          │ ├─> Checks expiration (valid for 300s)
          │ └─> Accepts file
          │
T=2.500s  │ Upload completes (2MB file @ 1MB/s)
          │ ├─> S3 encrypts file (AES-256)
          │ ├─> Stores in bucket: concert-event-pictures-161326240347
          │ └─> Returns: 200 OK
          │
T=2.600s  │ Frontend receives success
          │ ├─> Displays success message
          │ └─> Updates UI with CloudFront URL
          │
T=3.000s  │ User views image
          │ └─> GET https://d1234.cloudfront.net/events/a1b2c3d4...concert.jpg
          │
T=3.100s  │ CloudFront checks cache
          │ └─> Cache MISS (first request)
          │
T=3.200s  │ CloudFront fetches from S3 origin
          │ ├─> Uses OAI for authentication
          │ └─> S3 returns image bytes
          │
T=4.000s  │ CloudFront caches image at edge
          │ ├─> TTL: 86400 seconds (1 day)
          │ └─> Returns to browser
          │
T=4.100s  │ Browser displays image
          │ └─> Subsequent requests will be cache HIT (0ms latency!)
          │
T=10.000s │ Another user views same image
          │ └─> CloudFront cache HIT → instant delivery!
```

---

## 🛠️ Flow 7: Debugging & Troubleshooting

### **How to Trace Issues:**

```
PROBLEM: Upload fails with "Access Denied"

Step 1: Check API Gateway Logs
   │
   ├─> aws logs tail /aws/apigateway/concert-file-upload --follow
   │   └─> Look for: Status code, error messages
   │
   ▼
Step 2: Check Lambda Logs
   │
   ├─> aws logs tail /aws/lambda/concert-generate-presigned-url --follow
   │   └─> Look for: Exceptions, boto3 errors
   │
   ▼
Step 3: Verify IAM Permissions
   │
   ├─> Check Lambda role: concert-lambda-presigned-url-role
   │   └─> Must have: s3:PutObject, s3:GetObject
   │
   ▼
Step 4: Check S3 Bucket Policy
   │
   ├─> aws s3api get-bucket-policy --bucket concert-event-pictures-161326240347
   │   └─> Verify Lambda role ARN is present
   │
   ▼
Step 5: Test Presigned URL Manually
   │
   └─> curl -X PUT "<presigned-url>" --upload-file test.jpg
       └─> Should return: 200 OK
```

---

## 📈 Flow 8: Scaling & Performance

### **How Traffic Flows at Scale:**

```
1 USER → 10 USERS → 100 USERS → 1,000 USERS → 10,000 USERS

API Gateway:
├─> Autoscales automatically
├─> Rate limit: 10,000 requests/second (default)
└─> Cost: $1 per million requests (HTTP API)

Lambda:
├─> Concurrent executions: 1 → 10 → 100 (autoscales)
├─> Free tier: 1 million invocations/month
└─> Cold start: ~200ms, Warm: ~10ms

S3:
├─> Scales infinitely
├─> 3,500 PUT/COPY/POST/DELETE, 5,500 GET/HEAD per second per prefix
└─> Free tier: 2,000 PUT, 20,000 GET per month

CloudFront:
├─> Global edge network (200+ locations)
├─> Cache hit ratio: 85-95% (most requests never hit origin!)
├─> Free tier: 1 TB data OUT, 10 million requests
└─> Peak: Unlimited (AWS handles it)

Result:
└─> 10,000 concurrent users = NO PROBLEM! ✅
    └─> 90% cache hits = Only 1,000 S3 requests
        └─> Well within free tier limits
```

---

## 🎯 Quick Reference: Key Endpoints

```bash
# API Gateway Endpoints
POST   https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev/upload/event-picture
POST   https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev/upload/avatar

# CloudFront URLs (get these from: terraform output)
GET    https://d1234567890abc.cloudfront.net/events/*    # Event pictures
GET    https://d1234567890abc.cloudfront.net/avatars/*   # User avatars
GET    https://d0987654321xyz.cloudfront.net              # Website

# S3 Buckets (private - no direct access)
s3://concert-event-pictures-161326240347
s3://concert-user-avatars-161326240347
s3://concert-website-161326240347
```

---

## 🔍 How to Find Your CloudFront URLs

```bash
# Method 1: Terraform Output
cd /Users/putinan/development/DevOps/develop/aws
terraform output

# Method 2: AWS Console
open https://console.aws.amazon.com/cloudfront/

# Method 3: AWS CLI
aws cloudfront list-distributions \
  --query 'DistributionList.Items[?Comment==`Concert UGC CDN - Event Pictures & User Avatars`].[Id,DomainName]' \
  --output table
```

---

**📅 Last Updated:** October 31, 2025  
**🌏 Region:** ap-southeast-1 (Singapore)  
**📊 Status:** ✅ Deployed and operational
