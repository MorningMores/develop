# 🚀 Concert Platform - Ready for Deployment

## Quick Start

Your backend is built, configured, and ready to deploy. Run this command:

```bash
/tmp/deploy-backend.sh
```

This single command will:
1. ✅ Launch a new EC2 instance
2. ✅ Download the updated backend JAR from S3
3. ✅ Start Docker MySQL locally
4. ✅ Start the backend service
5. ✅ Provide you with the instance IP address

**Estimated time**: 5-10 minutes

---

## What Was Done

### ✅ Code Changes
- Updated `main_backend/src/main/resources/application.properties` to use environment variables
- Backend now configurable to connect to any MySQL database via `SPRING_DATASOURCE_URL`

### ✅ Build
- Rebuilt backend JAR: `concert-backend-1.0.0.jar` (84.6 MB)
- Uploaded to S3: `s3://concert-dev-frontend-142fee22/backend-deploy/concert-backend-1.0.0.jar`

### ✅ Infrastructure
- MySQL upgraded to 8.4.6 on RDS
- API Gateway configured and working
- Frontend deployed and accessible
- Docker MySQL 8.4.6 configured as local database solution

### ✅ Documentation
- `BACKEND_DEPLOYMENT_FIX.md` - Detailed technical guide
- `BACKEND_DEPLOYMENT_STATUS.md` - Current status and troubleshooting
- `/tmp/deploy-backend.sh` - Automated deployment script

---

## The Problem & Solution

### Problem
- EC2 and RDS in different VPCs (VPC isolation)
- Backend couldn't connect to RDS (timeout during startup)
- SSH access was timing out

### Solution
- Configured backend to use Docker MySQL running locally on EC2
- Backend now connects to `localhost:3306` instead of remote RDS
- Automated deployment script handles full setup

---

## Architecture

```
Frontend (S3)
    ↓
API Gateway (HTTP proxy)
    ↓
EC2 Instance (t3.micro)
├── Backend Java Application (port 8080)
└── Docker MySQL (port 3306)
```

---

## Database Configuration

**Connection Details:**
- **Host**: `localhost` (from EC2 perspective)
- **Port**: `3306`
- **Database**: `concert`
- **User**: `admin`
- **Password**: `Concert2024!SecurePass`

**Environment Variable Defaults:**
- `SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/devop_db`
- `SPRING_DATASOURCE_USERNAME=root`
- `SPRING_DATASOURCE_PASSWORD=password`

---

## Deployment Instructions

### Method 1: Automated (Recommended) ✅
```bash
/tmp/deploy-backend.sh
```
**Pros**: One command, handles everything, fastest
**Time**: 5-10 minutes

### Method 2: Manual AWS CLI
See `BACKEND_DEPLOYMENT_FIX.md` for step-by-step instructions

### Method 3: AWS Console
1. EC2 → Launch Instances
2. Select AMI: `ami-087126591972bfe96`
3. Instance Type: `t3.micro`
4. Key Pair: `concert-key`
5. Security Groups: `sg-01d844b44878f2b16`
6. Network: Subnet `subnet-0cd8d035dcc0f09bb`
7. IAM Role: `ConcertEC2Profile`
8. User Data: Copy from `/tmp/backend-user-data.sh`

---

## After Deployment

### Step 1: Wait for Instance to Boot
- ~2-3 minutes for full deployment
- Check the provided IP address

### Step 2: Connect to Instance
```bash
ssh -i concert-key.pem ubuntu@<PUBLIC_IP>
```

### Step 3: Verify Deployment
```bash
# Check backend service
systemctl status concert-backend

# Check Docker MySQL
docker ps | grep concert-mysql

# Check backend logs
tail -50 /opt/concert/logs/application.log

# Test API locally
curl http://localhost:8080/api/auth/test
```

### Step 4: Test Through API Gateway
```bash
curl https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod/api/auth/test
```

---

## Verification Checklist

After deployment, verify:

- [ ] Instance is running in AWS console
- [ ] SSH connection works: `ssh ubuntu@<IP>`
- [ ] Backend service is active: `systemctl status concert-backend`
- [ ] Docker MySQL is running: `docker ps`
- [ ] Backend responds on port 8080: `curl http://<IP>:8080/api/auth/test`
- [ ] API Gateway routes work: `curl https://.../prod/api/auth/test`
- [ ] No connection errors in logs: `tail /opt/concert/logs/application.log`
- [ ] Frontend still accessible: `https://concert-dev-frontend-142fee22.s3.us-east-1.amazonaws.com/`

---

## Troubleshooting

### Instance won't start
```bash
# Check instance details
aws ec2 describe-instances --region us-east-1 \
  --filters "Name=tag:Name,Values=concert-backend-ec2" \
  --query 'Reservations[0].Instances[0].[State.Name,InstanceStatus.Status,SystemStatus.Status]'
```

### Backend not running
```bash
# SSH into instance and check
ssh ubuntu@<IP>
sudo systemctl status concert-backend
sudo journalctl -u concert-backend -n 50
```

### Database connection errors
```bash
# Check Docker MySQL
docker logs concert-mysql | tail -30

# Test connection manually
mysql -h localhost -u admin -pConcert2024!\!SecurePass concert -e "SELECT VERSION();"
```

### Logs location
- Backend: `/opt/concert/logs/application.log`
- Service: `/opt/concert/logs/service.log`
- Deployment: `/var/log/backend-deployment.log` (during initial setup)

---

## Files Created for Deployment

1. **Deployment Script**
   - Path: `/tmp/deploy-backend.sh`
   - Type: Automated execution script
   - Action: Launches instance with full setup

2. **Documentation**
   - `BACKEND_DEPLOYMENT_FIX.md` - Technical details
   - `BACKEND_DEPLOYMENT_STATUS.md` - Status and troubleshooting
   - This file: `DEPLOYMENT_READY.md` - Quick reference

3. **Source Code**
   - `main_backend/src/main/resources/application.properties` - Updated config
   - `main_backend/target/concert-backend-1.0.0.jar` - Built JAR

4. **S3 Artifacts**
   - `s3://concert-dev-frontend-142fee22/backend-deploy/concert-backend-1.0.0.jar` - JAR for deployment

---

## Success Criteria

Your deployment is successful when:

1. ✅ EC2 instance launched and running
2. ✅ Public IP address assigned
3. ✅ SSH connection works
4. ✅ Backend service is "active (running)"
5. ✅ Docker MySQL container is running
6. ✅ Backend API responds (non-timeout)
7. ✅ Frontend can communicate through API Gateway

---

## Next Steps (After Successful Deployment)

1. **Monitor**: Watch CloudWatch logs for any errors
2. **Test**: Create a test event through the frontend
3. **Upload**: Test image upload functionality to S3
4. **Long-term Fix**: Migrate RDS to EC2 VPC to eliminate Docker dependency

---

## Support References

- Backend EC2 instances: `concert-backend-ec2` tag
- Security Group: `concert-ec2-sg` (sg-01d844b44878f2b16)
- Database: Docker MySQL running on EC2 (localhost:3306)
- API Gateway: `t55pviree7` (https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod)
- Frontend: S3 bucket `concert-dev-frontend-142fee22`

---

## To Get Started:

```bash
/tmp/deploy-backend.sh
```

That's it! Let the script handle the rest.
