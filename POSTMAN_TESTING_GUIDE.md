## Concert Backend API - Quick Test Workflow

### 1. Registration Test
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "your_username",
  "email": "your_email@example.com", 
  "password": "password123"
}
```

### 2. Login Test  
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "your_email@example.com",
  "password": "password123"
}
```

### 3. Protected Endpoint Test
```
GET http://localhost:8080/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

### Expected Status Codes:
- ✅ Registration Success: 200 OK
- ✅ Login Success: 200 OK  
- ✅ Protected Access: 200 OK
- ❌ Invalid Credentials: 200 OK (with error message)
- ❌ Unauthorized: 401 Unauthorized

### Quick Curl Tests:
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "password123"}'

# Login  
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "test@example.com", "password": "password123"}'

# Protected endpoint (replace TOKEN with actual JWT)
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```
