# 🏗️ Complete Singapore Architecture Design
**Concert Platform - Production-Ready Infrastructure**

## 📊 Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        AWS ap-southeast-1 (Singapore)                       │
└────────────────────────────────────────────────────────────────────────────┘

                                   USERS
                                     │
                                     │ HTTPS
                                     ▼
                        ┌────────────────────────┐
                        │   Amazon CloudFront    │  (Pending verification)
                        │   (Global CDN)         │
                        └────────────────────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
        ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
        │  S3 Website    │  │ S3 Events      │  │ S3 Avatars     │
        │  Bucket        │  │ Pictures       │  │ Bucket         │
        └────────────────┘  └────────────────┘  └────────────────┘
                                     │
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │   API Gateway HTTP     │
                        │   (File Upload API)    │
                        └────────────────────────┘
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │   Lambda Function      │
                        │   (Presigned URLs)     │
                        └────────────────────────┘


┌────────────────────────────────────────────────────────────────────────────┐
│                         VPC: 10.0.0.0/16                                    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Public Subnet 1 (10.0.1.0/24)                      │  │
│  │                    AZ: ap-southeast-1a                                │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                       │  │
│  │   ┌──────────────────────────────────────────────────────┐          │  │
│  │   │         EC2: Backend Primary (t3.micro)              │          │  │
│  │   │  ┌────────────────────────────────────────┐          │          │  │
│  │   │  │  Spring Boot Application (Port 8080)   │          │          │  │
│  │   │  │  - Java 21 (Corretto)                 │          │          │  │
│  │   │  │  - Connects to: RDS, Redis, S3        │          │          │  │
│  │   │  │  - CloudWatch Logs                     │          │          │  │
│  │   │  └────────────────────────────────────────┘          │          │  │
│  │   │  Public IP: Elastic IP                               │          │  │
│  │   │  Instance Profile: backend-ec2-role                  │          │  │
│  │   └──────────────────────────────────────────────────────┘          │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Public Subnet 2 (10.0.2.0/24)                      │  │
│  │                    AZ: ap-southeast-1b                                │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                       │  │
│  │   ┌──────────────────────────────────────────────────────┐          │  │
│  │   │         EC2: Backend Secondary (t3.micro)            │          │  │
│  │   │  ┌────────────────────────────────────────┐          │          │  │
│  │   │  │  Spring Boot Application (Port 8080)   │          │          │  │
│  │   │  │  - Java 21 (Corretto)                 │          │          │  │
│  │   │  │  - Connects to: RDS, Redis, S3        │          │          │  │
│  │   │  │  - CloudWatch Logs                     │          │          │  │
│  │   │  └────────────────────────────────────────┘          │          │  │
│  │   │  Public IP: Elastic IP                               │          │  │
│  │   │  Instance Profile: backend-ec2-role                  │          │  │
│  │   └──────────────────────────────────────────────────────┘          │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Private Subnet 1 (10.0.11.0/24)                    │  │
│  │                    AZ: ap-southeast-1a                                │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                       │  │
│  │   ┌────────────────────┐       ┌────────────────────┐               │  │
│  │   │  RDS MySQL 8.0.39  │       │  ElastiCache Redis │               │  │
│  │   │  (db.t3.micro)     │       │  7.0 (t3.micro)    │               │  │
│  │   │  - 20 GB Storage   │       │  - Session Store   │               │  │
│  │   │  - Auto Backup     │       │  - Cache Layer     │               │  │
│  │   └────────────────────┘       └────────────────────┘               │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Private Subnet 2 (10.0.12.0/24)                    │  │
│  │                    AZ: ap-southeast-1b                                │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │                                                                       │  │
│  │   ┌────────────────────┐       ┌────────────────────┐               │  │
│  │   │  RDS Read Replica  │       │  ElastiCache       │               │  │
│  │   │  (Optional)        │       │  Replica Node      │               │  │
│  │   └────────────────────┘       └────────────────────┘               │  │
│  │                                                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘

                           ┌────────────────────────┐
                           │   Internet Gateway     │
                           └────────────────────────┘
                                      │
                                      ▼
                                  Internet
```

---

## 🔐 Security Architecture

### IAM Roles & Permissions:

```
EC2 Instance Role (backend-ec2-role):
├── Secrets Manager: Read RDS & Redis credentials
├── S3: PutObject, GetObject, DeleteObject (event-pictures, user-avatars)
├── CloudWatch: PutMetricData, CreateLogGroup, PutLogEvents
├── API Gateway: Execute API
└── DynamoDB: Full access to all tables

Lambda Role (lambda-presigned-url-role):
├── S3: GetObject, PutObject (event-pictures, user-avatars)
├── CloudWatch: Basic execution role
└── VPC: Execution role (if in VPC)
```

### Security Groups:

```
Backend EC2 Security Group:
Inbound:
  - Port 8080: 0.0.0.0/0 (HTTP - Spring Boot)
  - Port 443:  0.0.0.0/0 (HTTPS)
  - Port 22:   0.0.0.0/0 (SSH - restrict to your IP in production)
Outbound:
  - All traffic: 0.0.0.0/0

RDS Security Group:
Inbound:
  - Port 3306: Backend EC2 Security Group
Outbound:
  - None required

ElastiCache Security Group:
Inbound:
  - Port 6379: Backend EC2 Security Group
Outbound:
  - None required
```

---

## 📡 Data Flow

### 1. File Upload Flow:

```
User → EC2 Backend (Spring Boot) → Lambda (via API Gateway) 
→ S3 Presigned URL → User uploads directly to S3
→ CloudFront serves file (when verified)
```

### 2. Authentication Flow:

```
User → EC2 Backend → Validate credentials → Redis (session)
→ Return JWT token → Store in Redis (5 min cache)
```

### 3. Booking Flow:

```
User → EC2 Backend → Check RDS (availability)
→ Create booking → Store in DynamoDB (cache)
→ Update RDS → Send SNS notification
→ Queue email in SQS → Send via SES
```

---

## 🚀 Deployment Architecture

### EC2 Instances:

| Instance | AZ | Type | Purpose | IP |
|----------|----|----|---------|-----|
| backend-primary | ap-southeast-1a | t3.micro | Main backend | Elastic IP |
| backend-secondary | ap-southeast-1b | t3.micro | Failover/Load balance | Elastic IP |

### Software Stack (EC2):

```
OS: Amazon Linux 2023
Java: OpenJDK 21 (Corretto)
Framework: Spring Boot 3.4.0
Build: Maven
Deployment: Systemd service
Monitoring: CloudWatch Agent
```

### Auto-Start Configuration:

```bash
# Spring Boot runs as systemd service
sudo systemctl status concert-backend
sudo systemctl start concert-backend
sudo systemctl stop concert-backend
sudo systemctl restart concert-backend

# Logs
tail -f /opt/concert/logs/application.log
tail -f /opt/concert/logs/service.log
```

---

## 💰 Cost Breakdown (Monthly)

### Free Tier Services:

| Service | Quantity | Free Tier | Cost |
|---------|----------|-----------|------|
| EC2 t3.micro | 2 | 750 hrs/month | $0.00 |
| RDS db.t3.micro | 1 | 750 hrs/month | $0.00 |
| S3 Storage | <5 GB | 5 GB | $0.00 |
| S3 GET | <20k | 20k requests | $0.00 |
| S3 PUT | <2k | 2k requests | $0.00 |
| Lambda | <1M invocations | 1M invocations | $0.00 |
| API Gateway HTTP | <1M | 1M requests | $0.00 |
| CloudWatch Logs | <5 GB | 5 GB | $0.00 |
| DynamoDB | <25 GB | 25 GB + 25 WCU/RCU | $0.00 |

### Paid Services:

| Service | Cost |
|---------|------|
| ElastiCache t3.micro | ~$12/month |
| Elastic IPs (2) | $0.00 (attached) |
| Secrets Manager (2) | $0.80/month |
| **TOTAL** | **~$12.80/month** |

### Cost Optimization:

- Remove ElastiCache → Use DynamoDB for sessions → **$0.80/month**
- Use environment variables → Remove Secrets Manager → **$0.00/month**

---

## 📊 Monitoring & Alerting

### CloudWatch Metrics:

```
EC2 Metrics:
  - CPUUtilization
  - NetworkIn/NetworkOut
  - DiskReadOps/DiskWriteOps
  - StatusCheckFailed

Application Metrics (Custom):
  - Request count
  - Response time
  - Error rate
  - Active users

RDS Metrics:
  - DatabaseConnections
  - CPUUtilization
  - FreeStorageSpace

ElastiCache Metrics:
  - CurrConnections
  - CPUUtilization
  - Evictions
```

### CloudWatch Alarms:

```
Already deployed:
  ✅ concert-cloudfront-data-transfer-dev
  ✅ concert-cloudfront-requests-dev
  ✅ concert-rds-cpu-dev
  ✅ concert-rds-connections-dev
  ✅ concert-rds-storage-dev
  ✅ concert-redis-cpu-dev
  ✅ concert-redis-memory-dev
  ✅ concert-redis-connections-dev
  ✅ concert-redis-evictions-dev
```

---

## 🔧 EC2 Management Commands

### SSH Access:

```bash
# Primary instance
ssh -i concert-key.pem ec2-user@<PRIMARY_PUBLIC_IP>

# Secondary instance
ssh -i concert-key.pem ec2-user@<SECONDARY_PUBLIC_IP>
```

### Deploy Spring Boot JAR:

```bash
# 1. Upload JAR to EC2
scp -i concert-key.pem target/concert-backend.jar \
  ec2-user@<PUBLIC_IP>:/tmp/

# 2. SSH to instance
ssh -i concert-key.pem ec2-user@<PUBLIC_IP>

# 3. Deploy
sudo /opt/concert/deploy.sh

# 4. Check status
sudo systemctl status concert-backend
tail -f /opt/concert/logs/application.log
```

### Test S3 Upload:

```bash
# On EC2 instance
/opt/concert/test-s3-upload.sh

# Expected output:
# Testing S3 upload...
# API Endpoint: https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com
# Requesting presigned URL...
# Response: {"uploadUrl":"https://...","key":"events/...","fileUrl":"..."}
# Upload URL: https://concert-event-pictures-161326240347.s3...
# Key: events/123abc-test.txt
# Uploading file...
# Upload complete!
```

---

## 🧪 Testing Checklist

### 1. Infrastructure Health:

```bash
# Check EC2 status
aws ec2 describe-instances \
  --region ap-southeast-1 \
  --filters "Name=tag:Name,Values=*concert-backend*" \
  --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]'

# Check RDS status
aws rds describe-db-instances \
  --region ap-southeast-1 \
  --db-instance-identifier concert-mysql-dev \
  --query 'DBInstances[0].[DBInstanceStatus,Endpoint.Address]'

# Check ElastiCache status
aws elasticache describe-replication-groups \
  --region ap-southeast-1 \
  --replication-group-id concert-redis-dev \
  --query 'ReplicationGroups[0].Status'
```

### 2. Application Health:

```bash
# From local machine
curl http://<EC2_PUBLIC_IP>:8080/actuator/health

# Expected:
# {"status":"UP"}
```

### 3. S3 Upload Test:

```bash
# Get presigned URL
curl -X POST https://mdazlesd5f.execute-api.ap-southeast-1.amazonaws.com/dev/upload/event-picture \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.jpg", "contentType": "image/jpeg"}'

# Upload file
curl -X PUT "<presigned-url>" \
  -H "Content-Type: image/jpeg" \
  --upload-file test.jpg
```

### 4. Database Connection:

```bash
# SSH to EC2
mysql -h <RDS_ENDPOINT> -u admin -p concert_db

# Run test query
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

---

## 🔄 Disaster Recovery

### Backup Strategy:

```
RDS:
  - Automated backups: 30 days retention
  - Backup window: 02:00-03:00 SGT
  - Point-in-time recovery enabled

ElastiCache:
  - Daily snapshots at 01:00 SGT
  - 7 days retention

S3:
  - Versioning enabled (event-pictures)
  - Cross-region replication (optional)

EC2:
  - AMI snapshots: Monthly
  - User data script for quick rebuild
```

### Recovery Procedures:

```bash
# Restore RDS from backup
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier concert-mysql-dev \
  --target-db-instance-identifier concert-mysql-dev-restored \
  --restore-time 2025-10-31T12:00:00Z

# Restore ElastiCache from snapshot
aws elasticache create-replication-group \
  --replication-group-id concert-redis-restored \
  --snapshot-name concert-redis-snapshot-20251031

# Launch new EC2 from AMI
aws ec2 run-instances \
  --image-id ami-XXXXXXXXX \
  --instance-type t3.micro \
  --subnet-id subnet-XXXXXXXXX \
  --security-group-ids sg-XXXXXXXXX \
  --iam-instance-profile Name=concert-backend-ec2-profile
```

---

## 📈 Scaling Strategy

### Horizontal Scaling (Add more EC2):

```
Current: 2 EC2 instances
Scale to: 4 EC2 instances (Auto Scaling Group)
Load Balancer: Application Load Balancer
Target: Handle 10,000 concurrent users
```

### Vertical Scaling (Bigger instances):

```
Current: t3.micro (1 vCPU, 1 GB RAM)
Scale to: t3.small (2 vCPU, 2 GB RAM)
        or t3.medium (2 vCPU, 4 GB RAM)
```

### Database Scaling:

```
Read Scaling: Add RDS read replicas
Write Scaling: Upgrade to larger instance class
Caching: Use ElastiCache for frequent queries
```

---

## 🎯 Next Steps

### Immediate (Now):

1. ✅ Deploy EC2 infrastructure in Singapore
2. ✅ Test S3 upload from EC2
3. ⏳ Build Spring Boot JAR
4. ⏳ Deploy to EC2 instances
5. ⏳ Terminate old us-east-1 instances

### Short Term (This Week):

1. Set up Application Load Balancer
2. Configure Auto Scaling Group
3. Enable RDS Multi-AZ (if needed)
4. Contact AWS Support for CloudFront verification
5. Set up CI/CD pipeline (GitHub Actions)

### Long Term (This Month):

1. Implement CloudFront CDN (after verification)
2. Add WAF rules for security
3. Set up Route 53 for custom domain
4. Implement blue-green deployment
5. Add comprehensive monitoring dashboards

---

**📅 Architecture Version:** 1.0  
**🌏 Region:** ap-southeast-1 (Singapore)  
**💵 Monthly Cost:** ~$12.80 (optimizable to $0.00)  
**🎯 Status:** Ready to deploy
