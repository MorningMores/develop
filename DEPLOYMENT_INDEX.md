# Concert Platform - Complete Deployment Index

## 📋 Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Deployed | S3 + CloudFront, accessible via REST endpoint |
| API Gateway | ✅ Configured | HTTP API proxy, routing to backend |
| MySQL | ✅ Upgraded | RDS version 8.4.6 available |
| Backend Code | ✅ Ready | Built JAR available in S3 |
| Backend Infra | ⏳ Pending | Ready for automated deployment |
| Docker MySQL | ✅ Configured | Local database workaround, 8.4.6 |

---

## 🚀 Quick Start

**TO DEPLOY THE BACKEND RIGHT NOW:**

```bash
/tmp/deploy-backend.sh
```

This will:
1. Launch a new EC2 instance
2. Download the backend JAR from S3
3. Start Docker MySQL
4. Deploy and start the backend service
5. Give you the public IP to SSH into

**Time**: ~5-10 minutes

---

## 📁 Key Documentation

1. **START HERE** → `DEPLOYMENT_READY.md`
   - Quick reference guide
   - Deployment instructions
   - Verification checklist

2. **Technical Details** → `BACKEND_DEPLOYMENT_FIX.md`
   - Root cause analysis
   - Configuration details
   - All deployment options
   - Troubleshooting guide

3. **Current Status** → `BACKEND_DEPLOYMENT_STATUS.md`
   - Infrastructure state
   - Problem analysis
   - Solution explanation
   - Architecture diagram

---

## 🔧 What Was Done

### Code Changes
```
main_backend/src/main/resources/application.properties
- Added environment variable support for database configuration
- Allows SPRING_DATASOURCE_URL override
- Defaults to localhost:3306 for Docker MySQL
```

### Build
```
✅ Rebuilt: concert-backend-1.0.0.jar (84.6 MB)
✅ Uploaded: s3://concert-dev-frontend-142fee22/backend-deploy/
✅ Ready: for automated or manual deployment
```

### Infrastructure
```
✅ Frontend: S3 REST endpoint working
✅ API Gateway: Configured and proxying
✅ MySQL: RDS upgraded to 8.4.6
✅ Docker: MySQL 8.4.6 ready on EC2
```

---

## 📊 Architecture

```
Internet
  ↓
┌─────────────────────────────────────┐
│  Frontend (S3)                      │
│  https://...s3.us-east-1.amazonaws  │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  API Gateway                        │
│  https://t55pviree7.execute-api...  │
│  /prod/api/*  →  backend:8080/api/* │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  EC2 t3.micro                       │
│  ├─ Backend Java (port 8080)        │
│  └─ Docker MySQL (port 3306)        │
│     Database: concert               │
│     User: admin / Concert2024!...   │
└─────────────────────────────────────┘
```

---

## 🔑 Key Configuration

### Backend Database Connection
```
Default:  jdbc:mysql://localhost:3306/devop_db
Variable: SPRING_DATASOURCE_URL (environment)
Location: /opt/concert/backend/concert-backend.jar
Service:  /etc/systemd/system/concert-backend.service
```

### Docker MySQL
```
Container: concert-mysql
Image:     mysql:8.4.6
Port:      3306
Database:  concert
User:      admin
Password:  Concert2024!SecurePass
Restart:   unless-stopped
```

### AWS Resources
```
Region:           us-east-1
Instance Type:    t3.micro
ImageID:          ami-087126591972bfe96
KeyName:          concert-key
SecurityGroup:    sg-01d844b44878f2b16 (concert-ec2-sg)
Subnet:           subnet-0cd8d035dcc0f09bb
IAM Profile:      ConcertEC2Profile
```

---

## 📝 Deployment Options

### Option 1: Automated Script (RECOMMENDED) ✅
```bash
/tmp/deploy-backend.sh
```
- One command deploys everything
- Fastest method
- Most reliable

### Option 2: AWS CLI Commands
See `BACKEND_DEPLOYMENT_FIX.md` Option C

### Option 3: AWS Console
See `BACKEND_DEPLOYMENT_FIX.md` Option B

### Option 4: SSM/SSH Manual
See `BACKEND_DEPLOYMENT_FIX.md` Option A

---

## ✅ Verification Steps

After deployment, run:

```bash
# 1. Check instance running
aws ec2 describe-instances --region us-east-1 \
  --filters "Name=tag:Name,Values=concert-backend-ec2" \
  --query 'Reservations[0].Instances[0].[PublicIpAddress,State.Name]'

# 2. SSH into instance
ssh -i concert-key.pem ubuntu://<PUBLIC_IP>

# 3. Inside instance - check services
systemctl status concert-backend
docker ps | grep concert-mysql

# 4. Test backend API
curl http://localhost:8080/api/auth/test

# 5. Test through API Gateway
curl https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod/api/auth/test
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Instance won't launch | Check IAM role, security group, subnet |
| Backend not responding | Check service: `systemctl status concert-backend` |
| Database connection error | Check MySQL: `docker logs concert-mysql` |
| SSH timeout | Use `deploy-backend.sh` or check security group rules |
| JAR not found | Verify S3 upload: `aws s3 ls s3://concert-dev-frontend-142fee22/backend-deploy/` |

Detailed troubleshooting: See `BACKEND_DEPLOYMENT_STATUS.md`

---

## 📂 File Locations

### In Your Workspace
- Config: `main_backend/src/main/resources/application.properties`
- JAR: `main_backend/target/concert-backend-1.0.0.jar`
- Docs: Various `.md` files in workspace root

### In S3
- JAR: `s3://concert-dev-frontend-142fee22/backend-deploy/concert-backend-1.0.0.jar`
- Frontend: `s3://concert-dev-frontend-142fee22/`

### On EC2 (After Deployment)
- Backend JAR: `/opt/concert/backend/concert-backend.jar`
- Service: `/etc/systemd/system/concert-backend.service`
- Logs: `/opt/concert/logs/` directory
- Docker: `concert-mysql` container

### Local Machine
- Script: `/tmp/deploy-backend.sh`
- Docs: `/Users/putinan/development/DevOps/develop/*.md`

---

## 🎯 Success Criteria

Deployment is successful when:

- ✅ EC2 instance launched and running
- ✅ Instance has public IP address assigned
- ✅ Can SSH into instance
- ✅ Backend service is "active (running)"
- ✅ Docker MySQL container running
- ✅ Backend responds to `curl http://<IP>:8080/api/auth/test`
- ✅ API Gateway returns successful response
- ✅ Frontend can communicate with backend

---

## 📞 Quick Reference

| What | Command |
|------|---------|
| Deploy | `/tmp/deploy-backend.sh` |
| Check Status | `aws ec2 describe-instances --region us-east-1 --filters "Name=tag:Name,Values=concert-backend-ec2"` |
| SSH to Instance | `ssh -i concert-key.pem ubuntu@<IP>` |
| View Logs | `tail -50 /opt/concert/logs/application.log` |
| Test Backend | `curl http://<IP>:8080/api/auth/test` |
| API Gateway URL | `https://t55pviree7.execute-api.us-east-1.amazonaws.com/prod` |
| Frontend URL | `https://concert-dev-frontend-142fee22.s3.us-east-1.amazonaws.com/` |

---

## 🚀 NEXT ACTION

```bash
/tmp/deploy-backend.sh
```

Run this command now to deploy the backend!

---

## 📚 Related Documentation

- `DEPLOYMENT_READY.md` - Quick start guide
- `BACKEND_DEPLOYMENT_FIX.md` - Technical reference
- `BACKEND_DEPLOYMENT_STATUS.md` - Status and troubleshooting
- `AWS_SERVICES_DEPLOYMENT_GUIDE.md` - Infrastructure setup
- `README.md` - Project overview

---

Last Updated: November 3, 2025
Status: ✅ Ready for Deployment
