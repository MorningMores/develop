# 🚀 Production Deployment Summary

## ✅ Deployed Services

### Frontend
- **CloudFront (HTTPS)**: https://d1hd7yyd12go0q.cloudfront.net
- **S3 Bucket**: concert-web-singapore-161326240347
- **Status**: ✅ Working! (Static site generated with index.html)

### Backend
- **API URL**: http://a5506e597994d4f62beee803a6829b1a-1147448115.ap-southeast-1.elb.amazonaws.com
- **EKS Cluster**: concert-cluster-v2 (2x t4g.medium nodes)
- **Pods**: 2 replicas running
- **Status**: ✅ Running

### Database
- **RDS Endpoint**: concert-prod-db.cpy08oyiq2n5.ap-southeast-1.rds.amazonaws.com
- **Type**: MySQL 8.0
- **Status**: ✅ Connected

### Storage
- **Frontend**: concert-web-singapore-161326240347
- **Event Images**: concert-event-pictures-singapore-161326240347
- **User Avatars**: concert-user-avatars-singapore-161326240347

## 💰 Cost Optimization

### Deleted Resources (Saved $35.6/month)
- ✅ NAT Gateway: -$32/month
- ✅ Unattached Elastic IP: -$3.6/month

### Monthly Cost Breakdown
- EKS (2x t4g.medium): ~$48
- RDS MySQL: ~$30
- S3 + CloudFront: ~$5
- Load Balancer: ~$18
- **Total: ~$100/month**

## 📦 Kubernetes Manifests

### Backend Deployment
```bash
kubectl apply -f k8s/backend-deployment.yaml
```

### GitHub Self-Hosted Runners
```bash
kubectl apply -f k8s/github-runner.yaml
```

## 🔧 Management Commands

### Update Frontend
```bash
cd main_frontend/concert1
npm run build
aws s3 sync .output/public s3://concert-web-singapore-161326240347 --delete
aws cloudfront create-invalidation --distribution-id E2TRLOXANORMT1 --paths "/*"
```

### Update Backend
```bash
cd main_backend
docker build -t concert-backend:latest .
docker tag concert-backend:latest 161326240347.dkr.ecr.ap-southeast-1.amazonaws.com/concert-backend:latest
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 161326240347.dkr.ecr.ap-southeast-1.amazonaws.com
docker push 161326240347.dkr.ecr.ap-southeast-1.amazonaws.com/concert-backend:latest
kubectl rollout restart deployment/concert-backend
```

### Check Status
```bash
# Backend pods
kubectl get pods -l app=concert-backend

# Backend logs
kubectl logs -l app=concert-backend --tail=50

# Services
kubectl get svc
```

## 🌐 URLs

- **Frontend**: https://d1hd7yyd12go0q.cloudfront.net
- **Backend API**: http://a5506e597994d4f62beee803a6829b1a-1147448115.ap-southeast-1.elb.amazonaws.com/api/events/json
- **Health Check**: http://a5506e597994d4f62beee803a6829b1a-1147448115.ap-southeast-1.elb.amazonaws.com/actuator/health

## 📊 Active CloudFront Distributions

- **E2TRLOXANORMT1**: Frontend (concert-web) - ✅ Active
- **E1KJ1O0NQAT0B9**: Old frontend - ⚠️ Can disable
- **E2YNZAOVMES56B**: Old backend - ⚠️ Can disable
- **E1AOTTQDI43845**: Images - ❌ Disabled
- **E3PR88512IBK75**: Old backend - ❌ Disabled

## ✅ Deployment Complete!

All services are running in Singapore (ap-southeast-1) region.
