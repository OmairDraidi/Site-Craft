# 📚 SiteCraft API Documentation

**Base URL:** `http://localhost:5263`  
**API Version:** `v1`  
**Last Updated:** February 10, 2026

---

## 🔐 Authentication Overview

### Required Headers

| Header | Required | Description | Example |
|--------|----------|-------------|---------|
| `X-Tenant-Id` | ✅ Yes (most endpoints) | Tenant identifier for multi-tenancy | `default` / `demo` / `companyb` |
| `Authorization` | ⚠️ Protected routes only | Bearer token for authentication | `Bearer eyJhbGciOiJIUzI1Ni...` |
| `Content-Type` | ✅ Yes (POST/PUT) | Request content type | `application/json` |

---

## 📋 Table of Contents

1. [Authentication Endpoints](#-authentication-endpoints)
2. [Users Endpoints](#-users-endpoints)
3. [Tenants Endpoints](#-tenants-endpoints)
4. [Response Format](#-response-format)
5. [Error Codes](#-error-codes)
6. [Frontend Integration Examples](#-frontend-integration-examples)

---

## 🔑 Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /api/v1/auth/register`

**Headers:**
```http
X-Tenant-Id: default
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@sitecraft.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2026-02-10T18:45:00Z",
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "admin@sitecraft.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Owner",
      "tenantId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Tenant not found. Please provide X-Tenant-Id header."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/auth/register \
  -H "X-Tenant-Id: default" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitecraft.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`

**Headers:**
```http
X-Tenant-Id: default
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@sitecraft.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2026-02-10T18:45:00Z",
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "admin@sitecraft.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Owner",
      "tenantId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/auth/login \
  -H "X-Tenant-Id: default" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sitecraft.com",
    "password": "SecurePass123!"
  }'
```

---

### 3. Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token_here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token_here",
    "refreshToken": "new_refresh_token_here",
    "expiresAt": "2026-02-10T19:45:00Z",
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "admin@sitecraft.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Owner",
      "tenantId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

---

### 4. Logout

**Endpoint:** `POST /api/v1/auth/logout`  
**🔒 Protected:** Requires Authentication

**Headers:**
```http
Authorization: Bearer your_access_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

---

### 5. Get Current User (Me)

**Endpoint:** `GET /api/v1/auth/me`  
**🔒 Protected:** Requires Authentication

**Headers:**
```http
Authorization: Bearer your_access_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "admin@sitecraft.com",
    "firstName": "",
    "lastName": "",
    "role": "Owner",
    "tenantId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## 👥 Users Endpoints

### 1. Get All Users

**Endpoint:** `GET /api/v1/users`

**Headers:**
```http
X-Tenant-Id: default
```

**Success Response (200):**
```json
{
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "count": 2,
  "users": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "tenantId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@sitecraft.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Owner",
      "isActive": true,
      "createdAt": "2026-02-10T12:00:00Z"
    }
  ]
}
```

---

### 2. Seed Demo User

**Endpoint:** `POST /api/v1/users/seed-demo-user`

**Headers:**
```http
X-Tenant-Id: default
```

**Success Response (200):**
```json
{
  "message": "Demo user created successfully",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "admin@default.com",
  "tenantId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 🏢 Tenants Endpoints

### 1. Get Current Tenant

**Endpoint:** `GET /api/v1/tenants/current`

**Headers:**
```http
X-Tenant-Id: default
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Default Tenant",
  "subdomain": "default",
  "customDomain": null,
  "status": "Active",
  "createdAt": "2026-02-10T10:00:00Z"
}
```

---

### 2. Get All Tenants

**Endpoint:** `GET /api/v1/tenants`

**Success Response (200):**
```json
{
  "count": 3,
  "tenants": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Default Tenant",
      "subdomain": "default",
      "status": "Active",
      "createdAt": "2026-02-10T10:00:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Demo Company",
      "subdomain": "demo",
      "status": "Active",
      "createdAt": "2026-02-10T11:00:00Z"
    }
  ]
}
```

---

### 3. Seed Demo Tenant

**Endpoint:** `POST /api/v1/tenants/seed-demo`

**Success Response (200):**
```json
{
  "message": "Demo tenant created successfully",
  "tenantId": "660e8400-e29b-41d4-a716-446655440001",
  "subdomain": "demo",
  "instructions": "Use header 'X-Tenant-Id: demo' to test multi-tenancy"
}
```

---

## 📦 Response Format

### Standard Success Response
```typescript
{
  success: true,
  message: string,
  data?: T  // Generic data type
}
```

### Standard Error Response
```typescript
{
  success: false,
  message: string,
  errors?: string[]  // Optional validation errors
}
```

---

## ⚠️ Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| **400** | Bad Request | Missing `X-Tenant-Id`, invalid request body |
| **401** | Unauthorized | Invalid credentials, expired token |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **500** | Internal Server Error | Server-side error |

---

## 💻 Frontend Integration Examples

### React/TypeScript Example

#### 1. API Service Setup

```typescript
// services/api.client.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5263';
const DEFAULT_TENANT_ID = 'default';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-Id': DEFAULT_TENANT_ID,
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sitecraft_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 2. Auth Service Example

```typescript
// services/auth.service.ts
import { apiClient } from './api.client';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string;
  };
}

export class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/auth/register', data);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/api/v1/auth/logout');
    localStorage.removeItem('sitecraft_token');
    localStorage.removeItem('sitecraft_user');
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/api/v1/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  }

  async getCurrentUser() {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data.data;
  }
}

export const authService = new AuthService();
```

#### 3. Using the Service in React Component

```typescript
// components/LoginForm.tsx
import { useState } from 'react';
import { authService } from '../services/auth.service';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await authService.login({ email, password });
      
      // Save token
      localStorage.setItem('sitecraft_token', response.accessToken);
      localStorage.setItem('sitecraft_user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 🔄 Multi-Tenancy Usage

### Switching Between Tenants

```typescript
// Change tenant context
apiClient.defaults.headers['X-Tenant-Id'] = 'demo';

// Or per-request
await apiClient.get('/api/v1/users', {
  headers: {
    'X-Tenant-Id': 'companyb'
  }
});
```

### Available Tenants

- `default` - Default tenant
- `demo` - Demo company tenant
- `companyb` - Second demo tenant

---

## 🧪 Testing with Swagger

**Swagger UI:** `http://localhost:5263/swagger`

1. Click **"Authorize"** button
2. Enter: `Bearer your_token_here`
3. Add `X-Tenant-Id` header to each request

---

## 📝 Notes

- **JWT Token Expiry:** 60 minutes (configurable in `appsettings.json`)
- **Refresh Token:** Use before access token expires
- **Multi-Tenancy:** Always provide `X-Tenant-Id` header
- **Password Requirements:** Minimum 6 characters (update validation as needed)
- **CORS:** Configured for `localhost:5173`, `localhost:5174`, `localhost:3000`

---

## 🚨 Common Issues & Solutions

### Issue: "Tenant not found"
**Solution:** Add `X-Tenant-Id: default` header to your request

### Issue: "ERR_CONNECTION_REFUSED"
**Solution:** Verify backend is running on port 5263

### Issue: "401 Unauthorized"
**Solution:** Check if token is valid and included in `Authorization` header

### Issue: CORS Error
**Solution:** Ensure your frontend port is added to `CorsOrigins` in `appsettings.json`

---

## 🔗 Related Files

- **Backend Config:** `backend/src/SiteCraft.API/appsettings.json`
- **Frontend Config:** `sitecraft-client/src/config/api.config.ts`
- **Auth Service:** `sitecraft-client/src/services/auth.service.ts`
- **API Client:** `sitecraft-client/src/services/api.client.ts`

---

**Happy Coding! 🚀**
