# SiteCraft API - Authentication Endpoints

## 🚀 Quick Start

### Running the API

```powershell
# Development Mode (uses localhost MySQL)
$env:ASPNETCORE_ENVIRONMENT="Development"
dotnet run --urls "http://localhost:5001"

# Or using Docker
cd ../../
docker-compose up --build -d backend
```

### Access Swagger
- Development: http://localhost:5001/swagger
- Docker: http://localhost:5263/swagger

---

## 🔐 Authentication Endpoints

### Base URL
```
http://localhost:5001/api/v1
```

### Public Endpoints

#### Register New User
```http
POST /auth/register
Content-Type: application/json
X-Tenant-Id: {tenant-guid}

{
  "email": "user@example.com",
  "password": "YourP@ssw0rd",
  "confirmPassword": "YourP@ssw0rd",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "random-base64-string",
    "expiresAt": "2026-02-10T15:30:00Z",
    "user": {
      "id": "guid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Member",
      "tenantId": "guid"
    }
  }
}
```

---

#### Login
```http
POST /auth/login
Content-Type: application/json
X-Tenant-Id: {tenant-guid}

{
  "email": "user@example.com",
  "password": "YourP@ssw0rd"
}
```

**Response:** Same as Register

---

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "previous-refresh-token"
}
```

---

### Protected Endpoints (Requires Bearer Token)

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "guid",
    "email": "user@example.com",
    "firstName": "",
    "lastName": "",
    "role": "Member",
    "tenantId": "guid"
  }
}
```

---

#### Logout
```http
POST /auth/logout
Authorization: Bearer {access-token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🧪 Testing with HTTP File

Use the provided test file for easy testing:

```powershell
# Open in VS Code with REST Client extension
code SiteCraft.Auth.http
```

Or use the tests directly in Swagger UI.

---

## 🔑 JWT Token Structure

```json
{
  "sub": "user-guid",
  "email": "user@example.com",
  "role": "Member",
  "tenant_id": "tenant-guid",
  "jti": "token-id",
  "exp": 1707588000,
  "iss": "SiteCraft",
  "aud": "SiteCraftClients"
}
```

---

## 🏢 Multi-Tenancy

All auth operations are tenant-scoped. Provide tenant context via:

1. **X-Tenant-Id Header** (Development - highest priority)
2. **JWT Token** (`tenant_id` claim)
3. **Subdomain** (Production: `tenant.sitecraft.com`)
4. **Custom Domain** (Production: `www.customdomain.com`)

---

## 🔒 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 digit
- At least 1 special character

**Example:** `MyP@ssw0rd123`

---

## ⚙️ Configuration

Located in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=mysql;Port=3306;Database=sitecraft_db;User=sitecraft_user;Password=sitecraft_pass;CharSet=utf8mb4;"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SECRET_KEY",
    "Issuer": "SiteCraft",
    "Audience": "SiteCraftClients",
    "ExpiryMinutes": 60
  }
}
```

For local development, use `appsettings.Development.json` with `Server=localhost`.

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

### MySQL Connection Issues
- Ensure MySQL is running: `docker ps | findstr mysql`
- Check connection string in `appsettings.Development.json`
- Run in Development mode: `$env:ASPNETCORE_ENVIRONMENT="Development"`

### Docker Issues
```powershell
# Restart containers
cd ../../
docker-compose restart

# Rebuild backend
docker-compose up --build -d backend
```

---

## 📚 Documentation

- Full Documentation: `../../plans/completed/Phase6_Task3_Authentication_System.md`
- Multi-Tenancy: `../../plans/completed/Phase6_Task2_MultiTenancy_Setup.md`
- HTTP Tests: `./SiteCraft.Auth.http`

---

**Last Updated:** February 10, 2026
