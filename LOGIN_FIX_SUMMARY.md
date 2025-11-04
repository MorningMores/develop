# Login Issue - Root Cause & Fix Summary

**Date**: November 3, 2025  
**Status**: 🟡 Partially Fixed - Frontend issue resolved, Backend needs verification

---

## 🔍 Issues Found & Fixed

### Issue 1: Missing `useApi` Composable ✅ FIXED

**Problem**: Login component was trying to use a non-existent `useApi()` composable.

```typescript
// ❌ This was happening:
import { useApi } from "~/composables/useApi";  // File didn't exist!
const { apiFetch } = useApi()
```

**Root Cause**: The composable file was not created.

**Solution Implemented**:
- ✅ Created `/Users/putinan/development/DevOps/develop/main_frontend/concert1/app/composables/useApi.ts`
- ✅ Implemented `apiFetch` function that calls server routes via `$fetch`
- ✅ Rebuilt frontend: `npm run build` ✅ Success
- ✅ Redeployed to S3: `aws s3 sync` ✅ Success

### Issue 2: Backend Not Responding ❌ INVESTIGATION NEEDED

**Problem**: API Gateway returns `500 Internal Server Error`

```
HTTP Status: 500
Response: {"message":"Internal Server Error"}
```

**Evidence**:
- EC2 instance is running: `i-0580615ba39548431` at `54.163.142.116`
- Cannot SSH to instance (permission denied)
- Backend service status unknown

---

## ✅ What's Working Now

1. **Frontend Components**: 
   - ✅ `useApi` composable created and working
   - ✅ Login component can now call the API
   - ✅ Register component can now call the API
   - ✅ Frontend redeployed to S3

2. **Frontend Deployment**:
   - ✅ Deployed to: `https://concert-dev-frontend-142fee22.s3.us-east-1.amazonaws.com/`
   - ✅ Build successful: 2.75 MB (706 KB gzip)

3. **Backend JAR**:
   - ✅ Uploaded to S3: `s3://concert-dev-frontend-142fee22/backend-deploy/concert-backend-1.0.0.jar`

---

## 🚨 What's NOT Working

### Backend Service Status: UNKNOWN

The backend may not be running or is throwing errors. Need to verify:

1. Is the backend service running on the EC2 instance?
2. Is Docker MySQL running on the instance?
3. Are there any error logs in the backend application?

---

## 📋 Next Steps to Get Login Working

### Option A: Quick Test (Recommended)

Test if backend is running at all:

```bash
# Try to reach backend directly through API Gateway
curl -X GET "https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod/api/auth/test"
```

Expected response: `"Auth API is working!"`

Current result: `500 Internal Server Error`

---

### Option B: Check Backend Instance (Requires SSH)

If you can access the instance:

```bash
# SSH to instance
ssh -i concert-key.pem ubuntu@54.163.142.116

# Check backend service
systemctl status concert-backend

# Check Docker MySQL
docker ps | grep concert-mysql

# Check logs
journalctl -u concert-backend -n 50
tail -50 /opt/concert/logs/application.log
```

---

### Option C: Restart Backend via AWS Systems Manager

If SSH doesn't work, use AWS Systems Manager:

```bash
aws ssm send-command \
  --region us-east-1 \
  --instance-ids i-0580615ba39548431 \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=["systemctl restart concert-backend"]'
```

---

### Option D: Launch Fresh Backend Instance

If the current instance is corrupted:

```bash
/tmp/deploy-backend.sh
```

This will:
1. Launch new EC2 instance
2. Download JAR from S3
3. Start Docker MySQL
4. Start backend service

---

## 🔗 API Endpoints to Test

Once backend is running, test these:

```bash
# Test auth API health
curl https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod/api/auth/test

# Test login
curl -X POST https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"abc","password":"12345678"}'

# Expected response (success):
# {"token":"...", "username":"abc", "email":"..."}

# Expected response (invalid credentials):
# {"message":"Invalid username or password"}
```

---

## 📝 Code Changes Made

### File: `main_frontend/concert1/app/composables/useApi.ts`

**Created new file** with content:

```typescript
export const useApi = () => {
  const apiFetch = async (url: string, options: any = {}) => {
    try {
      const response = await $fetch(url, {
        method: options.method || 'GET',
        body: options.body ? JSON.stringify(options.body) : undefined,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  return { apiFetch };
};
```

---

## 🎯 Login Flow (How It Works)

```
Frontend Component (Login.vue)
         ↓
   useApi() composable
         ↓
   POST /api/auth/login (to Nuxt server route)
         ↓
   Nuxt Server Route (server/api/auth/login.post.ts)
         ↓
   Axios POST to backend (http://localhost:8080/api/auth/login)
         ↓
   Spring Boot Backend (AuthController.login)
         ↓
   AuthService.login() 
         ↓
   Returns: { token, username, email } or { message: "error" }
         ↓
   Frontend saves token to localStorage
         ↓
   Redirects to home or account page
```

---

## ⚠️ Critical Issue Summary

| Issue | Status | Impact |
|-------|--------|--------|
| `useApi` missing | ✅ FIXED | Frontend couldn't make API calls |
| Backend 500 error | ❌ NEEDS FIX | Login endpoint failing |
| Backend service status | ❓ UNKNOWN | Critical - need to verify it's running |
| Docker MySQL status | ❓ UNKNOWN | Database might not be accessible |

---

## 📞 What To Do Right Now

**Choose one of these actions**:

1. **If you can SSH to 54.163.142.116**: 
   - Check `systemctl status concert-backend`
   - Check `docker ps`
   - Review logs

2. **If you cannot SSH**:
   - Try the test endpoint: `curl https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod/api/auth/test`
   - If that fails, launch new instance: `/tmp/deploy-backend.sh`

3. **Quick Verification**:
   - Try logging in with frontend: Go to S3 frontend URL and attempt login
   - Watch browser console for error details
   - Report the exact error message

---

## 📚 Related Files

- Backend controller: `main_backend/src/main/java/com/concert/controller/AuthController.java`
- Backend service: `main_backend/src/main/java/com/concert/service/AuthService.java`
- Frontend login: `main_frontend/concert1/app/components/Login.vue`
- Server route: `main_frontend/concert1/server/api/auth/login.post.ts`
- New composable: `main_frontend/concert1/app/composables/useApi.ts` ✨ NEW

---

## 🔄 Backend Endpoint Details

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "usernameOrEmail": "string",
  "password": "string"
}

Success Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "abc",
  "email": "abc@example.com"
}

Error Response (400/500):
{
  "message": "Invalid username or password" | "Login failed: ..."
}
```

---

## ✅ Frontend Deployment Status

- **Build**: ✅ Success
- **Deployment**: ✅ Synced to S3
- **Frontend URL**: `https://concert-dev-frontend-142fee22.s3.us-east-1.amazonaws.com/`
- **Files Deployed**: 100+ files, 2.75 MB total
- **useApi Composable**: ✅ Created and included in build

---

**Last Updated**: November 3, 2025 - 2:30 PM
**Deployed by**: Automated frontend rebuild
