# 🚨 URGENT: Deploy Backend NOW

## Problem
❌ Frontend is deployed but backend is NOT running
❌ Login/Register/Events/Bookings/Account pages all failing
❌ Error: "Load failed" - Cannot connect to backend

## Solution (2 minutes)

### Step 1: Open EC2 Instance Connect
Click this link:
```
https://ap-southeast-1.console.aws.amazon.com/ec2/home?region=ap-southeast-1#ConnectToInstance:instanceId=i-0ffd487469a6fa1aa
```

### Step 2: Click "Connect" Button
- Select "EC2 Instance Connect"
- Click the orange "Connect" button
- Browser terminal will open

### Step 3: Paste and Run This Command
✅ **EC2 IAM role now has ECR permissions! Ready to deploy.**

Copy the ENTIRE script below and paste into the terminal:

```bash
# Stop old containers
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Login to ECR (now has permissions!)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 161326240347.dkr.ecr.us-east-1.amazonaws.com

# Pull latest image
docker pull 161326240347.dkr.ecr.us-east-1.amazonaws.com/concert-api:latest

# Run backend
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

# Wait and check
sleep 15
docker ps
docker logs $(docker ps -q) --tail 20
```

### Step 4: Test
From your local machine:
```bash
curl http://52.221.197.39:8080/api/auth/test
```

Expected response:
```json
{"message":"Public endpoint accessible"}
```

## What's Fixed

Once backend is running, ALL pages will work:

✅ **Login Page** - POST /api/auth/login
✅ **Register Page** - POST /api/auth/register  
✅ **My Events** - GET /api/events/me
✅ **My Bookings** - GET /api/bookings/me
✅ **My Account** - GET /api/users/profile
✅ **Create Event** - POST /api/events
✅ **Event Details** - GET /api/events/{id}
✅ **Upload Pictures** - POST /api/events/{id}/photo

## Current Status

✅ Frontend: Deployed to CloudFront & S3
✅ RDS Database: Running
✅ S3 Buckets: Configured
✅ CloudFront CDN: Active
✅ Cognito: Ready
⏳ Backend: NEEDS DEPLOYMENT (you do this now)

## URLs

- Frontend: https://d3jivuimmea02r.cloudfront.net
- Backend API: http://52.221.197.39:8080 (starts after deployment)
- Images CDN: https://dzh397ixo71bk.cloudfront.net

---

**DO THIS NOW** → Takes 2 minutes → Fixes everything! 🚀
