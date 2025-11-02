# CloudFront Activation Guide

## Current Status: ⏳ Waiting for AWS Account Verification

**Issue**: Your AWS account needs verification before CloudFront can be enabled.

**Error**: 
```
AccessDenied: Your account must be verified before you can add new CloudFront resources
```

**Current Solution**: Using S3 static website hosting (HTTP only)

---

## 📋 Steps to Enable CloudFront

### Step 1: Contact AWS Support (Required First)

1. **Go to AWS Console → Support → Create Case**
2. **Select**: Service limit increase
3. **Use this template**:

```
Subject: Request Account Verification for CloudFront

Category: Service Limit Increase
Service: CloudFront
Limit Type: Distributions

Description:
Hello AWS Support Team,

I am requesting verification of my AWS account (Account ID: 161326240347) 
to enable CloudFront distributions.

I am currently receiving the following error when trying to create a 
CloudFront distribution:

"Your account must be verified before you can add new CloudFront resources"

Use Case:
- Hosting a web application with global CDN distribution
- Need HTTPS for Cognito OAuth callbacks
- S3 static website currently using HTTP only

Please verify my account so I can create CloudFront distributions.

Thank you!
```

4. **Wait for response** (usually 1-2 business days)

---

### Step 2: Once AWS Approves - Enable CloudFront

After AWS Support verifies your account, run these commands:

```bash
cd /Users/putinan/development/DevOps/develop/aws

# Rename disabled CloudFront file to enable it
mv cloudfront.tf.disabled cloudfront.tf

# Validate configuration
terraform validate

# Preview changes
terraform plan

# Apply CloudFront configuration
terraform apply
```

**Expected Resources**:
- CloudFront Distribution (global CDN)
- Origin Access Control (OAC) for S3
- Cache policies (static assets + dynamic content)
- CloudFront Function (SPA routing)
- SSL/TLS certificate (AWS managed)

---

### Step 3: Update Cognito Callback URLs

After CloudFront is deployed, update Cognito to use HTTPS URLs:

**File**: `aws/cognito_web_integration.tf`

**Find** (around line 145):
```hcl
  # Callback URLs (localhost for development)
  # Note: S3 website URLs use HTTP, which Cognito doesn't allow
  # For production, use CloudFront with HTTPS or custom domain with SSL
  callback_urls = [
    "http://localhost:3000/auth/callback",
    "http://localhost:3000"
  ]

  logout_urls = [
    "http://localhost:3000"
  ]
```

**Replace with**:
```hcl
  # Callback URLs (CloudFront HTTPS + localhost)
  callback_urls = [
    "http://localhost:3000/auth/callback",
    "http://localhost:3000",
    "https://${aws_cloudfront_distribution.main.domain_name}",
    "https://${aws_cloudfront_distribution.main.domain_name}/auth/callback"
  ]

  logout_urls = [
    "http://localhost:3000",
    "https://${aws_cloudfront_distribution.main.domain_name}"
  ]
```

Then apply:
```bash
terraform apply
```

---

### Step 4: Update Frontend Amplify Configuration

**File**: `main_frontend/concert1/plugins/amplify.client.ts`

**Update redirectSignIn and redirectSignOut**:

```typescript
import { Amplify } from '@aws-amplify/core';

export default defineNuxtPlugin(() => {
  // Get CloudFront URL from environment or use localhost
  const cloudfrontUrl = process.env.CLOUDFRONT_URL || 'http://localhost:3000';
  
  Amplify.configure({
    Auth: {
      Cognito: {
        identityPoolId: "us-east-1:83d2800d-d497-4319-ac2f-5961c3982d48",
        userPoolId: "us-east-1_TpsZkFbqO",
        userPoolClientId: "1eomnjf6812g8npdr8ta8naem7",
        loginWith: {
          oauth: {
            domain: "concert-auth-161326240347.auth.us-east-1.amazoncognito.com",
            scopes: ["email", "openid", "profile", "aws.cognito.signin.user.admin"],
            redirectSignIn: [`${cloudfrontUrl}/auth/callback`],
            redirectSignOut: [cloudfrontUrl],
            responseType: "code"
          }
        }
      }
    }
  });
});
```

**Add to `.env`**:
```bash
# Get this from terraform output after CloudFront deployment
CLOUDFRONT_URL=https://d1234567890.cloudfront.net
```

---

### Step 5: Deploy Frontend to CloudFront

```bash
cd /Users/putinan/development/DevOps/develop/main_frontend/concert1

# Build for production
npm run generate

# Get CloudFront distribution ID
cd ../../aws
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)

# Sync to S3 (CloudFront will cache)
aws s3 sync ../../main_frontend/concert1/.output/public \
  s3://concert-dev-frontend-142fee22 \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html" \
  --exclude "*.json"

# HTML files with no-cache
aws s3 sync ../../main_frontend/concert1/.output/public \
  s3://concert-dev-frontend-142fee22 \
  --exclude "*" \
  --include "*.html" \
  --include "*.json" \
  --cache-control "no-cache"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🌍 CloudFront Benefits (Why You Need It)

### Current State (S3 Only)
- ❌ HTTP only (no SSL/HTTPS)
- ❌ Cognito OAuth won't work (requires HTTPS)
- ❌ Single region (slower for global users)
- ❌ No CDN caching
- ❌ Browser security warnings
- ✅ Simple setup
- ✅ Low cost

### After CloudFront Enabled
- ✅ HTTPS with AWS managed SSL certificate
- ✅ Cognito OAuth fully functional
- ✅ Global CDN (50+ edge locations)
- ✅ Faster load times worldwide
- ✅ Edge caching (reduced S3 requests)
- ✅ DDoS protection (AWS Shield)
- ✅ Custom domain support
- ✅ Compression (gzip, brotli)

---

## 📊 What CloudFront Will Deploy

```
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront Distribution                   │
│  Domain: d1234567890.cloudfront.net                         │
│  SSL: AWS Managed Certificate                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Edge Locations (50+ worldwide)                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ US-East │  │ EU-West │  │ AP-East │  │ SA-East │       │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                         │                                    │
│                         ▼                                    │
│              ┌──────────────────────┐                       │
│              │  Origin Access       │                       │
│              │  Control (OAC)       │                       │
│              └──────────┬───────────┘                       │
│                         │                                    │
│                         ▼                                    │
│              ┌──────────────────────┐                       │
│              │   S3 Bucket          │                       │
│              │   (Private)          │                       │
│              │   Frontend Files     │                       │
│              └──────────────────────┘                       │
│                                                               │
│  Cache Policies:                                             │
│  - Static Assets: 1 year cache                              │
│  - HTML/JSON: No cache (always fresh)                       │
│  - SPA Router: Redirect to index.html                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 CloudFront Configuration Details

The `cloudfront.tf` file includes:

### 1. Distribution Settings
- **Price Class**: PriceClass_100 (US, Canada, Europe)
- **HTTP Version**: HTTP/2 and HTTP/3 support
- **Compression**: Automatic gzip/brotli
- **IPv6**: Enabled

### 2. Cache Behaviors

**Default Behavior** (Static Assets):
- Cache: 1 year (max-age=31536000)
- Compression: Enabled
- Viewer Protocol: Redirect HTTP to HTTPS
- Allowed Methods: GET, HEAD, OPTIONS

**HTML/JSON Behavior**:
- Cache: No cache
- Always fetch fresh from S3
- SPA routing support

### 3. Origin Access Control (OAC)
- S3 bucket is private (not public)
- Only CloudFront can access S3
- More secure than Origin Access Identity (OAI)

### 4. CloudFront Functions
- **SPA Router**: Rewrites requests without file extensions to `/index.html`
- Enables client-side routing (Nuxt pages work correctly)

### 5. Custom Error Pages
- 404 → index.html (for SPA routing)
- 403 → index.html (for SPA routing)

---

## 🚀 Testing After CloudFront Enabled

### 1. Test HTTPS Access
```bash
# Get CloudFront URL
cd /Users/putinan/development/DevOps/develop/aws
CLOUDFRONT_URL=$(terraform output -raw cloudfront_url)

# Test homepage
curl -I $CLOUDFRONT_URL

# Expected: HTTP/2 200 with HTTPS
```

### 2. Test Cognito OAuth
```bash
# Visit CloudFront URL
open $CLOUDFRONT_URL/login

# Click "Sign In with Hosted UI"
# Should redirect to Cognito
# After login, should redirect back to CloudFront URL (HTTPS)
```

### 3. Test SPA Routing
```bash
# Visit a client-side route directly
open $CLOUDFRONT_URL/events/123

# Should load index.html and route client-side
# Not 404 error
```

### 4. Test Cache Headers
```bash
# Static asset (should cache for 1 year)
curl -I $CLOUDFRONT_URL/_nuxt/app.js

# Expected: cache-control: public, max-age=31536000

# HTML file (should not cache)
curl -I $CLOUDFRONT_URL/index.html

# Expected: cache-control: no-cache
```

### 5. Test Global Performance
```bash
# From different locations (use VPN or online tools)
curl -w "Time: %{time_total}s\n" -o /dev/null -s $CLOUDFRONT_URL

# Expected: Fast response from all regions due to edge caching
```

---

## 📋 Pre-Flight Checklist

Before enabling CloudFront, ensure:

- [ ] AWS Support has verified your account
- [ ] No error when creating CloudFront distribution
- [ ] S3 bucket contains frontend files
- [ ] Terraform state is up to date
- [ ] Backup of current S3 URLs (in case rollback needed)
- [ ] Frontend build is production-ready
- [ ] Cognito callback URLs ready to update

---

## 🔄 Rollback Plan (If Issues Occur)

If CloudFront causes problems:

```bash
cd /Users/putinan/development/DevOps/develop/aws

# 1. Disable CloudFront
mv cloudfront.tf cloudfront.tf.disabled

# 2. Revert Cognito callback URLs to S3/localhost
# Edit cognito_web_integration.tf and remove CloudFront URLs

# 3. Apply changes
terraform apply

# 4. Application will work again with S3 static website
# (but no HTTPS, no Cognito OAuth on S3)
```

---

## 💰 Cost Estimate (CloudFront)

**Free Tier** (first 12 months):
- 1 TB data transfer out
- 10,000,000 HTTP/HTTPS requests
- 2,000,000 CloudFront Function invocations

**After Free Tier**:
- Data transfer: $0.085/GB (US/EU)
- HTTPS requests: $0.01 per 10,000 requests
- CloudFront Functions: $0.10 per 1M invocations

**Example** (10,000 users/month, 100 MB each):
- Data transfer: 1 TB = $85/month
- Requests: ~500,000 = $0.50/month
- **Total**: ~$85.50/month

**Optimization Tips**:
- Use cache effectively (reduce origin requests)
- Compress assets (reduce data transfer)
- Use PriceClass_100 (cheaper regions only)

---

## 🎯 Current Setup Summary

### What's Working Now (S3 Static Website)
- ✅ Frontend hosted and accessible
- ✅ Files served directly from S3
- ✅ Localhost Cognito OAuth works
- ✅ Low cost (~$0.023/GB)

### What's Waiting for CloudFront
- ⏳ HTTPS support
- ⏳ Cognito OAuth on production URL
- ⏳ Global CDN performance
- ⏳ Custom domain with SSL
- ⏳ Advanced caching
- ⏳ DDoS protection

---

## 📞 AWS Support Contact

**How to Check Verification Status**:

1. Try creating a CloudFront distribution:
   ```bash
   cd /Users/putinan/development/DevOps/develop/aws
   mv cloudfront.tf.disabled cloudfront.tf
   terraform plan
   ```

2. If you still see the error, contact support:
   - AWS Console → Support → My Support Cases
   - Check for response from previous request

3. If approved, proceed with Step 2 above

---

## ✅ Final Checklist (When CloudFront is Ready)

Complete these tasks after AWS verifies your account:

1. [ ] Rename `cloudfront.tf.disabled` → `cloudfront.tf`
2. [ ] Run `terraform apply` to create CloudFront distribution
3. [ ] Update Cognito callback URLs to include CloudFront HTTPS URL
4. [ ] Update frontend Amplify config with CloudFront URL
5. [ ] Deploy frontend to S3
6. [ ] Create CloudFront invalidation
7. [ ] Test HTTPS access to CloudFront URL
8. [ ] Test Cognito OAuth flow with CloudFront
9. [ ] Test SPA routing on CloudFront
10. [ ] Update CI/CD pipeline with CloudFront URLs
11. [ ] Update DNS (if using custom domain)
12. [ ] Monitor CloudFront metrics in CloudWatch

---

## 🎓 Additional Resources

**AWS Documentation**:
- [CloudFront Getting Started](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html)
- [CloudFront with S3](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html)
- [CloudFront Security](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/SecurityAndPrivateContent.html)

**Terraform Documentation**:
- [aws_cloudfront_distribution](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution)
- [aws_cloudfront_origin_access_control](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_origin_access_control)

---

**Status**: Ready to enable CloudFront once AWS Support verifies account ✅

**Next Action**: Wait for AWS Support response, then follow Step 2 above.
