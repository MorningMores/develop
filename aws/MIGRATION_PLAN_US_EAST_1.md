# 🧹 Migration Plan: Singapore → us-east-1

## 🎯 Objective
**Delete all Singapore infrastructure and use existing us-east-1 resources to reduce costs to $0/month**

---

## 💰 Cost Reduction

### Before:
- **Singapore (ap-southeast-1):** ~$12.80/month
  - ElastiCache Redis: $12.00/month
  - Secrets Manager: $0.80/month
- **us-east-1:** ~$15.00/month
  - 2 x EC2 t3.micro: $15.00/month
- **Total:** ~$27.80/month

### After:
- **us-east-1 only:** $0.00/month (100% free tier)
  - EC2 (2 x t3.micro): $0.00 (750 hours/month free tier)
  - S3 Storage (<5GB): $0.00 (5GB free tier)
  - Lambda (<1M invocations): $0.00 (1M requests free tier)
  - API Gateway (<1M calls): $0.00 (1M requests free tier)
  - CloudWatch Logs (<5GB): $0.00 (5GB free tier)

**Monthly Savings: $27.80 → $0.00 = 100% cost reduction! 🎉**

---

## 🚀 Quick Start

### One-Command Migration:
```bash
cd /Users/putinan/development/DevOps/develop/aws
./cleanup-and-move-us-east-1.sh
```

This script will:
1. ✅ Show current resources in both regions
2. ✅ Backup Terraform state
3. ✅ Destroy ALL Singapore resources (with confirmation)
4. ✅ Update Terraform configuration to us-east-1
5. ✅ Create minimal infrastructure (S3, Lambda, API Gateway)
6. ✅ Configure existing EC2 instances
7. ✅ Generate summary report

---

## 📋 Manual Steps (If Preferred)

### Step 1: Backup Current State

```bash
cd /Users/putinan/development/DevOps/develop/aws

# Create backup directory
mkdir -p backup-$(date +%Y%m%d)

# Backup Terraform state
cp terraform.tfstate backup-$(date +%Y%m%d)/

# Backup Terraform files
cp *.tf backup-$(date +%Y%m%d)/
```

### Step 2: Destroy Singapore Resources

```bash
cd /Users/putinan/development/DevOps/develop/aws

# Review what will be destroyed
terraform plan -destroy

# Destroy all resources
terraform destroy -auto-approve
```

This will delete:
- ✓ S3 buckets (3): event-pictures, user-avatars, website
- ✓ Lambda function: concert-generate-presigned-url
- ✓ API Gateway HTTP API
- ✓ RDS MySQL (if exists)
- ✓ ElastiCache Redis (if exists)
- ✓ CloudWatch alarms
- ✓ IAM roles and policies
- ✓ Secrets Manager secrets
- ✓ DynamoDB tables
- ✓ SNS topics
- ✓ SQS queues

### Step 3: Update Terraform Configuration

```bash
cd /Users/putinan/development/DevOps/develop/aws

# Update region in variables.tf
sed -i '' 's/default = "ap-southeast-1"/default = "us-east-1"/' variables.tf

# Update provider region
sed -i '' 's/region = "ap-southeast-1"/region = "us-east-1"/' provider.tf

# Verify changes
grep -n "us-east-1" variables.tf provider.tf
```

### Step 4: Remove Expensive Services

Comment out or delete these files to avoid costs:

```bash
# Disable RDS (save ~$15/month)
mv rds.tf rds.tf.disabled

# Disable ElastiCache (save ~$12/month)
mv elasticache.tf elasticache.tf.disabled

# Disable EC2 creation (use existing instances)
mv ec2_backend.tf ec2_backend.tf.disabled

# Keep only free tier services:
# - s3_file_storage.tf (free tier)
# - lambda_presigned_url.tf (free tier)
# - api_gateway.tf (free tier)
```

### Step 5: Deploy Minimal Infrastructure

```bash
cd /Users/putinan/development/DevOps/develop/aws

# Reinitialize for us-east-1
terraform init -reconfigure

# Plan minimal deployment
terraform plan -out=tfplan-minimal

# Apply
terraform apply tfplan-minimal
```

This creates:
- ✓ S3 buckets in us-east-1
- ✓ Lambda function for presigned URLs
- ✓ API Gateway for upload endpoints
- ✓ IAM roles for Lambda
- ✓ Basic CloudWatch logging

### Step 6: Configure Existing EC2 Instances

```bash
# Get existing EC2 instance IPs
aws ec2 describe-instances \
  --region us-east-1 \
  --filters "Name=tag:Name,Values=*concert*" "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress]' \
  --output table

# SSH to each instance
ssh -i concert-key.pem ec2-user@<PUBLIC_IP>

# Update Spring Boot configuration
sudo vi /opt/concert/config/application.properties

# Change:
# aws.region=us-east-1
# aws.s3.event-pictures-bucket=<new-bucket-name>
# aws.s3.user-avatars-bucket=<new-bucket-name>
# aws.api-gateway.endpoint=<new-api-gateway-endpoint>

# Remove RDS and Redis if not using:
# Comment out spring.datasource.* and spring.data.redis.*

# Restart application
sudo systemctl restart concert-backend
```

---

## 🧪 Testing After Migration

### Test 1: S3 Upload via Lambda

```bash
# Get API Gateway endpoint
API_ENDPOINT=$(cd /Users/putinan/development/DevOps/develop/aws && terraform output -raw api_gateway_endpoint)

# Request presigned URL
curl -X POST "$API_ENDPOINT/dev/upload/event-picture" \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.jpg", "contentType": "image/jpeg"}'

# Upload file using returned URL
curl -X PUT "<uploadUrl-from-response>" \
  -H "Content-Type: image/jpeg" \
  --upload-file test.jpg

# Verify in S3
BUCKET_NAME=$(cd /Users/putinan/development/DevOps/develop/aws && terraform output -raw event_pictures_bucket_name)
aws s3 ls "s3://$BUCKET_NAME/" --region us-east-1 --recursive
```

### Test 2: Application Health

```bash
# Get EC2 IP
EC2_IP=$(aws ec2 describe-instances \
  --region us-east-1 \
  --filters "Name=tag:Name,Values=*concert*" "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

# Test health endpoint
curl http://$EC2_IP:8080/actuator/health

# Expected: {"status":"UP"}
```

### Test 3: Verify Region

```bash
# Check S3 bucket region
aws s3api get-bucket-location --bucket <bucket-name>
# Expected: us-east-1

# Check Lambda region
aws lambda get-function \
  --region us-east-1 \
  --function-name concert-generate-presigned-url
# Should succeed

# Try Singapore (should fail)
aws lambda get-function \
  --region ap-southeast-1 \
  --function-name concert-generate-presigned-url
# Should return error (function not found)
```

---

## 🏗️ Final Architecture (us-east-1 only)

```
┌────────────────────────────────────────────────────────────────┐
│                      AWS us-east-1                              │
└────────────────────────────────────────────────────────────────┘

                         USERS
                           │
                           ▼
              ┌─────────────────────────┐
              │   Existing EC2 (2)      │
              │   t3.micro             │
              │   - Primary (us-east-1a)│
              │   - Secondary (1b)      │
              └─────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   API Gateway HTTP      │
              │   /upload/event-picture │
              │   /upload/avatar        │
              └─────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   Lambda Function       │
              │   (Presigned URLs)      │
              └─────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ S3 Event │   │ S3 User  │   │ S3 Website│
    │ Pictures │   │ Avatars  │   │ Assets    │
    └──────────┘   └──────────┘   └──────────┘

Cost: $0.00/month (100% free tier)
```

---

## 📦 What Gets Deleted

### Singapore Resources (ap-southeast-1):
- ❌ S3 buckets (will be recreated in us-east-1)
- ❌ Lambda function (will be recreated in us-east-1)
- ❌ API Gateway (will be recreated in us-east-1)
- ❌ RDS MySQL (~$15/month saved)
- ❌ ElastiCache Redis (~$12/month saved)
- ❌ CloudWatch alarms
- ❌ IAM roles (will be recreated)
- ❌ Secrets Manager secrets (~$0.80/month saved)
- ❌ DynamoDB tables (keep if free tier)
- ❌ CloudFront distributions (blocked anyway)

### What Stays:
- ✅ EC2 instances in us-east-1 (already running)
- ✅ Spring Boot application code
- ✅ Terraform configuration (updated to us-east-1)

---

## ⚠️ Important Notes

### Data Backup:
```bash
# Backup S3 data before destruction
aws s3 sync s3://concert-event-pictures-161326240347 ./s3-backup/event-pictures/ --region ap-southeast-1
aws s3 sync s3://concert-user-avatars-161326240347 ./s3-backup/user-avatars/ --region ap-southeast-1
aws s3 sync s3://concert-website-161326240347 ./s3-backup/website/ --region ap-southeast-1

# Restore to us-east-1 after deployment
aws s3 sync ./s3-backup/event-pictures/ s3://<new-bucket-name>/ --region us-east-1
```

### Database Backup (if using RDS):
```bash
# Create final snapshot before deletion
aws rds create-db-snapshot \
  --region ap-southeast-1 \
  --db-instance-identifier concert-mysql-dev \
  --db-snapshot-identifier concert-final-snapshot-$(date +%Y%m%d)

# Export to S3 (optional)
aws rds start-export-task \
  --export-task-identifier concert-export-$(date +%Y%m%d) \
  --source-arn arn:aws:rds:ap-southeast-1:...:snapshot:concert-final-snapshot-... \
  --s3-bucket-name concert-database-backup \
  --iam-role-arn arn:aws:iam::...:role/rds-export-role \
  --kms-key-id arn:aws:kms:...
```

### Redis Data (if needed):
```bash
# ElastiCache doesn't support export, so if you need the data:
# 1. Connect to Redis and export keys
redis-cli -h <redis-endpoint> -p 6379 --tls -a <auth-token> --scan > redis-keys.txt

# 2. Use DUMP/RESTORE for each key or accept data loss
```

---

## 🎯 Success Checklist

After migration:

- [ ] All Singapore resources destroyed
- [ ] Terraform state backed up
- [ ] Terraform configured for us-east-1
- [ ] S3 buckets created in us-east-1
- [ ] Lambda function deployed in us-east-1
- [ ] API Gateway working in us-east-1
- [ ] Existing EC2 instances configured
- [ ] IAM roles attached to EC2
- [ ] S3 upload test passes
- [ ] Application health check passes
- [ ] Cost reduced to $0/month
- [ ] All services in us-east-1 region

---

## 🔄 Rollback Plan (If Needed)

If something goes wrong:

```bash
cd /Users/putinan/development/DevOps/develop/aws

# Restore Terraform state from backup
cp backup-YYYYMMDD/terraform.tfstate ./

# Restore Terraform files
cp backup-YYYYMMDD/*.tf ./

# Reinitialize
terraform init -reconfigure

# Restore infrastructure
terraform apply
```

---

## 📞 Next Steps After Migration

1. **Test thoroughly:**
   - S3 uploads working
   - EC2 application running
   - API endpoints accessible

2. **Update documentation:**
   - Update README with new region
   - Update deployment scripts
   - Update monitoring dashboards

3. **Monitor costs:**
   - Check AWS Cost Explorer
   - Verify free tier usage
   - Set up billing alerts

4. **Optional optimizations:**
   - Add CloudFront (if account verified)
   - Set up Auto Scaling
   - Add Application Load Balancer

---

**Region:** us-east-1  
**Monthly Cost:** $0.00 (100% free tier)  
**Savings:** $27.80/month → $0/month 🎉
