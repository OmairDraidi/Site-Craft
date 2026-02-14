# 📚 SiteCraft API Documentation

**Base URL:** `http://localhost:5263`  
**API Version:** `v1`  
**Last Updated:** February 12, 2026

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
4. [Templates Endpoints](#-templates-endpoints)
5. [Projects Endpoints](#-projects-endpoints)
6. [Pages Endpoints](#-pages-endpoints)
7. [Response Format](#-response-format)
8. [Error Codes](#-error-codes)
9. [Frontend Integration Examples](#-frontend-integration-examples)

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

### 5. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@sitecraft.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "If this email exists, a password reset link has been sent."
}
```

**Notes:**
- Returns success message even if email doesn't exist (security best practice)
- Prevents email enumeration attacks
- Implementation sends email with reset token (to be completed in Phase 7)

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sitecraft.com"}'
```

---

### 6. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_here",
    "newPassword": "NewSecurePass123!",
    "confirmPassword": "NewSecurePass123!"
  }'
```

---

### 7. Get Current User (Me)

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

## 🎨 Templates Endpoints

### 1. Get All Templates (with Filters)

**Endpoint:** `GET /api/v1/templates`  
**� Public:** No Authentication Required

**Headers:**
```http
X-Tenant-Id: default
```

**Query Parameters:****
```
category     (optional) - Filter by category: Business, Education, Portfolio, Services, Store
isPremium    (optional) - Filter by premium status: true/false
searchTerm   (optional) - Search in name and description
```

**Example Request:**
```http
GET /api/v1/templates?category=Business&isPremium=false&searchTerm=modern
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Templates retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "tenantId": null,
      "name": "Modern Business",
      "description": "A sleek and professional template for businesses",
      "category": "Business",
      "previewImageUrl": "https://images.unsplash.com/photo-business-1",
      "isPublic": true,
      "isPremium": false,
      "templateData": "{...}",
      "usageCount": 45,
      "createdAt": "2026-02-11T10:00:00Z",
      "updatedAt": "2026-02-11T10:00:00Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5263/api/v1/templates?category=Business" \
  -H "X-Tenant-Id: default"
```

---

### 2. Get Template by ID

**Endpoint:** `GET /api/v1/templates/{id}`  
**� Public:** No Authentication Required

**Headers:**
```http
X-Tenant-Id: default
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Template retrieved successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "tenantId": null,
    "name": "Modern Business",
    "description": "A sleek and professional template for businesses",
    "category": "Business",
    "previewImageUrl": "https://images.unsplash.com/photo-business-1",
    "isPublic": true,
    "isPremium": false,
    "templateData": "{\"version\":\"1.0\",\"pages\":[...]}",
    "usageCount": 45,
    "createdAt": "2026-02-11T10:00:00Z",
    "updatedAt": "2026-02-11T10:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Template not found"
}
```

---

### 3. Create Template

**Endpoint:** `POST /api/v1/templates`  
**🔒 Protected:** Requires Owner or Admin Role

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_access_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Modern Business",
  "description": "A sleek and professional template for businesses",
  "category": "Business",
  "previewImageUrl": "https://images.unsplash.com/photo-business-1",
  "isPublic": true,
  "isPremium": false,
  "templateData": "{\"version\":\"1.0\",\"pages\":[{\"slug\":\"home\",\"title\":\"Home\",\"sections\":[{\"type\":\"hero\",\"props\":{\"title\":\"Welcome\",\"subtitle\":\"Build your dream site\"}}]}],\"theme\":{\"primaryColor\":\"#F6C453\",\"secondaryColor\":\"#111111\"}}"
}
```

**Validation Rules:**
- `name`: Required, max 200 characters
- `description`: Required, max 1000 characters
- `category`: Required, must be one of: Business, Education, Portfolio, Services, Store
- `previewImageUrl`: Required, must be valid URL
- `templateData`: Required, must be valid JSON

**Success Response (201):**
```json
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "tenantId": null,
    "name": "Modern Business",
    "description": "A sleek and professional template for businesses",
    "category": "Business",
    "previewImageUrl": "https://images.unsplash.com/photo-business-1",
    "isPublic": true,
    "isPremium": false,
    "templateData": "{...}",
    "usageCount": 0,
    "createdAt": "2026-02-11T10:00:00Z",
    "updatedAt": "2026-02-11T10:00:00Z"
  }
}
```

**Authorization Notes:**
- **Owner role:** Can create global templates (tenantId = null)
- **Admin role:** Can only create private templates for their tenant

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/templates \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Modern Business",
    "description": "A sleek and professional template",
    "category": "Business",
    "previewImageUrl": "https://images.unsplash.com/photo-1",
    "isPublic": true,
    "isPremium": false,
    "templateData": "{\"version\":\"1.0\"}"
  }'
```

---

### 4. Update Template

**Endpoint:** `PUT /api/v1/templates/{id}`  
**🔒 Protected:** Requires Owner or Admin Role

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_access_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Modern Business",
  "description": "An updated sleek and professional template",
  "category": "Business",
  "previewImageUrl": "https://images.unsplash.com/photo-business-2",
  "isPublic": true,
  "isPremium": false,
  "templateData": "{\"version\":\"1.1\",\"pages\":[...]}"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Template updated successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "tenantId": null,
    "name": "Updated Modern Business",
    "description": "An updated sleek and professional template",
    "category": "Business",
    "previewImageUrl": "https://images.unsplash.com/photo-business-2",
    "isPublic": true,
    "isPremium": false,
    "templateData": "{...}",
    "usageCount": 45,
    "createdAt": "2026-02-11T10:00:00Z",
    "updatedAt": "2026-02-11T12:30:00Z"
  }
}
```

**Authorization Notes:**
- **Owner role:** Can update all templates (global and private)
- **Admin role:** Can only update templates from their own tenant
- Attempting to update another tenant's template returns `403 Forbidden`

**Error Response (404):**
```json
{
  "success": false,
  "message": "Template not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Forbidden"
}
```

---

### 5. Delete Template

**Endpoint:** `DELETE /api/v1/templates/{id}`  
**🔒 Protected:** Requires Owner or Admin Role

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_access_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Template deleted successfully",
  "data": {}
}
```

**Authorization Notes:**
- **Owner role:** Can delete all templates (global and private)
- **Admin role:** Can only delete templates from their own tenant
- Attempting to delete another tenant's template returns `403 Forbidden`

**Error Response (404):**
```json
{
  "success": false,
  "message": "Template not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5263/api/v1/templates/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### 6. Apply Template to Site

**Endpoint:** `POST /api/v1/templates/{id}/apply`  
**🔒 Protected:** Requires Authentication

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_access_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Template applied successfully",
  "data": {}
}
```

**Business Logic:**
- Copies `templateData` JSON to the user's site
- Increments template `usageCount` by 1
- Validates user belongs to active tenant
- Premium templates require appropriate subscription (future enhancement)

**Error Response (404):**
```json
{
  "success": false,
  "message": "Template not found"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Failed to apply template"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/templates/3fa85f64-5717-4562-b3fc-2c963f66afa6/apply \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### Template Categories

The following categories are supported:

| Category | Description | Use Case |
|----------|-------------|----------|
| **Business** | Corporate and business websites | Companies, agencies, consultancies |
| **Education** | Educational institutions and courses | Schools, universities, online courses |
| **Portfolio** | Personal portfolios and showcases | Designers, photographers, artists |
| **Services** | Service-based businesses | Contractors, freelancers, service providers |
| **Store** | E-commerce and online stores | Product sales, online shops |

---

### Template JSON Structure

Templates use a standardized JSON structure:

```json
{
  "version": "1.0",
  "pages": [
    {
      "slug": "home",
      "title": "Home",
      "sections": [
        {
          "type": "hero",
          "props": {
            "title": "Welcome to SiteCraft",
            "subtitle": "Build your dream site",
            "backgroundImage": "https://..."
          }
        },
        {
          "type": "features",
          "props": {
            "items": [
              {
                "icon": "zap",
                "title": "Fast & Reliable",
                "description": "Lightning fast performance"
              }
            ]
          }
        }
      ]
    }
  ],
  "theme": {
    "primaryColor": "#F6C453",
    "secondaryColor": "#111111",
    "fontFamily": "Inter"
  }
}
```

---

### Default Templates (Seeded)

The application comes with **5 pre-built default templates** that are automatically seeded on first run:

| # | Template Name | Category | Type | Description |
|---|---------------|----------|------|-------------|
| 1 | **Academic Excellence** | Education | Free | Perfect for schools, universities, and online courses. Features course listings, faculty profiles, and student testimonials. |
| 2 | **Professional Services** | Services | Free | Ideal for consulting firms, agencies, and service providers. Showcases your expertise and builds trust. |
| 3 | **E-Commerce Starter** | Store | Premium | Simple and elegant online store template. Perfect for small businesses starting their e-commerce journey. |
| 4 | **Creative Showcase** | Portfolio | Free | Stunning portfolio template for designers, photographers, and creative professionals. Let your work speak. |
| 5 | **Personal Coach Pro** | Services | Premium | Designed for coaches, trainers, and consultants. Highlight your programs and convert visitors to clients. |

**Template Details:**

#### 1. Academic Excellence (Education - Free)
- **Sections:** Hero, Featured Courses (4 items), Student Testimonials (3), Contact Form, Footer
- **Color Scheme:** Primary Gold (#F6C453), Dark Background (#111111), Blue Accent (#3B82F6)
- **Preview Image:** `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80`
- **Use Cases:** Schools, universities, online course platforms, tutoring services

#### 2. Professional Services (Services - Free)
- **Sections:** Hero, Services Cards (4 offerings), About/Stats Section, Contact Form, Footer
- **Color Scheme:** Primary Gold (#F6C453), Dark Background (#111111), Blue Accent (#2563EB)
- **Preview Image:** `https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80`
- **Use Cases:** Consulting firms, agencies, professional services, B2B businesses

#### 3. E-Commerce Starter (Store - Premium)
- **Sections:** Hero, Featured Products Grid (4 products), Why Shop Features (4 items), Contact, Footer
- **Color Scheme:** Primary Gold (#F6C453), Dark Background (#111111), Green Accent (#10B981)
- **Preview Image:** `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80`
- **Use Cases:** Small online stores, boutique shops, product catalogs, retail businesses

#### 4. Creative Showcase (Portfolio - Free)
- **Sections:** Hero, Projects Grid (4 portfolio items), About Me/Skills, Contact/Social Links, Footer
- **Color Scheme:** Primary Gold (#F6C453), Dark Background (#111111), Purple Accent (#8B5CF6)
- **Preview Image:** `https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1920&q=80`
- **Use Cases:** Designers, photographers, artists, creative professionals, freelancers

#### 5. Personal Coach Pro (Services - Premium)
- **Sections:** Hero, Coaching Programs (4 packages), Client Testimonials (3), Booking Form, Contact, Footer
- **Color Scheme:** Primary Gold (#F6C453), Dark Background (#111111), Red Accent (#EF4444)
- **Preview Image:** `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80`
- **Use Cases:** Life coaches, fitness trainers, career coaches, consultants, mentors

**Note:** 
- Templates are seeded automatically on application startup (only once)
- All templates have `tenantId = null` (global templates)
- All templates have `isPublic = true`
- 3 Free templates + 2 Premium templates
- All use high-quality Unsplash images
- All follow the Digital Luxury design theme

---

## � Projects Endpoints

Projects allow users to organize their website building work. Each project belongs to a specific user and tenant.

### 1. Get All Projects (Current User)

**Endpoint:** `GET /api/v1/projects`

**Authentication:** ✅ Required

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "My Portfolio Website",
      "description": "Personal portfolio showcasing my design work",
      "createdAt": "2026-02-12T10:30:00Z",
      "updatedAt": "2026-02-12T14:20:00Z"
    },
    {
      "id": "7cb98f32-8821-4973-a2dc-3d851b9c71fa",
      "name": "Client Project - ABC Corp",
      "description": "Corporate website for ABC Corporation",
      "createdAt": "2026-02-11T09:15:00Z",
      "updatedAt": null
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5263/api/v1/projects \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### 2. Get Project by ID

**Endpoint:** `GET /api/v1/projects/{id}`

**Authentication:** ✅ Required

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "9b2c8f64-5717-4562-b3fc-2c963f66afa6",
    "userName": "John Doe",
    "name": "My Portfolio Website",
    "description": "Personal portfolio showcasing my design work",
    "createdAt": "2026-02-12T10:30:00Z",
    "updatedAt": "2026-02-12T14:20:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Project not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5263/api/v1/projects/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### 3. Create Project

**Endpoint:** `POST /api/v1/projects`

**Authentication:** ✅ Required

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My Awesome Website",
  "description": "A description of my project"
}
```

**Validation Rules:**
- `name`: Required, max 100 characters
- `description`: Optional, max 500 characters

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "9b2c8f64-5717-4562-b3fc-2c963f66afa6",
    "userName": "John Doe",
    "name": "My Awesome Website",
    "description": "A description of my project",
    "createdAt": "2026-02-12T15:30:00Z",
    "updatedAt": null
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Project name is required",
    "Project name must not exceed 100 characters"
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/projects \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome Website",
    "description": "A description of my project"
  }'
```

---

### 4. Update Project

**Endpoint:** `PUT /api/v1/projects/{id}`

**Authentication:** ✅ Required (must be project owner)

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "tenantId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "9b2c8f64-5717-4562-b3fc-2c963f66afa6",
    "userName": "John Doe",
    "name": "Updated Project Name",
    "description": "Updated description",
    "createdAt": "2026-02-12T10:30:00Z",
    "updatedAt": "2026-02-12T16:45:00Z"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "You do not have permission to update this project"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Project not found"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5263/api/v1/projects/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description"
  }'
```

---

### 5. Delete Project

**Endpoint:** `DELETE /api/v1/projects/{id}`

**Authentication:** ✅ Required (must be project owner)

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {}
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "You do not have permission to delete this project"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Project not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5263/api/v1/projects/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### Project Ownership & Permissions

- ✅ Users can only view their own projects
- ✅ Users can only update/delete projects they own
- ✅ Projects are tenant-scoped (multi-tenancy supported)
- ✅ `UpdatedAt` timestamp automatically set when project is modified

**TypeScript Example:**
```typescript
import { projectService } from '@/services/project.service';

// Get all user's projects
const projects = await projectService.getAllProjects();

// Create a new project
const newProject = await projectService.createProject({
  name: 'My New Website',
  description: 'Building something awesome'
});

// Update project
const updated = await projectService.updateProject(projectId, {
  name: 'Updated Name',
  description: 'New description'
});

// Delete project
await projectService.deleteProject(projectId);
```

---

## 📄 Pages Endpoints

Pages represent individual web pages within a site. Each page has a unique slug, SEO metadata, publish state, and JSON-based content structure (`PageData`) for the visual builder.

### 1. Get All Pages for a Site

**Endpoint:** `GET /api/v1/pages?siteId={siteId}`

**Authentication:** ✅ Required

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Query Parameters:**
```
siteId (required) - GUID of the site
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pages retrieved successfully",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "Home",
      "slug": "home",
      "isPublished": true,
      "publishedAt": "2026-02-14T10:00:00Z",
      "order": 0,
      "createdAt": "2026-02-14T09:00:00Z",
      "updatedAt": "2026-02-14T10:00:00Z"
    },
    {
      "id": "4fb85f64-5717-4562-b3fc-2c963f66afb7",
      "title": "About",
      "slug": "about",
      "isPublished": false,
      "publishedAt": null,
      "order": 1,
      "createdAt": "2026-02-14T09:30:00Z",
      "updatedAt": null
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Site ID is required"
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5263/api/v1/pages?siteId=3fa85f64-5717-4562-b3fc-2c963f66afa6" \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### 2. Get Page by ID

**Endpoint:** `GET /api/v1/pages/{id}`

**Authentication:** ✅ Required

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page retrieved successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "siteId": "2ea85f64-5717-4562-b3fc-2c963f66afa5",
    "templateId": "1da85f64-5717-4562-b3fc-2c963f66afa4",
    "title": "Home Page",
    "slug": "home",
    "metaDescription": "Welcome to our website",
    "metaKeywords": "home, welcome, landing",
    "isPublished": true,
    "publishedAt": "2026-02-14T10:00:00Z",
    "pageData": "{\"sections\":[{\"id\":\"hero-1\",\"type\":\"hero\",\"components\":[{\"type\":\"heading\",\"content\":\"Welcome\"}]}]}",
    "order": 0,
    "componentCount": 3,
    "createdAt": "2026-02-14T09:00:00Z",
    "updatedAt": "2026-02-14T10:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Page not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5263/api/v1/pages/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### 3. Create Page

**Endpoint:** `POST /api/v1/pages`

**Authentication:** ✅ Required

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Home Page",
  "siteId": "2ea85f64-5717-4562-b3fc-2c963f66afa5",
  "templateId": "1da85f64-5717-4562-b3fc-2c963f66afa4",
  "metaDescription": "Welcome to our website",
  "metaKeywords": "home, welcome, landing",
  "pageData": "{\"sections\":[{\"id\":\"hero-1\",\"type\":\"hero\",\"components\":[{\"type\":\"heading\",\"content\":\"Welcome to SiteCraft\"}]}]}"
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `siteId`: Required, must be a valid GUID
- `templateId`: Optional GUID
- `metaDescription`: Optional, max 300 characters
- `metaKeywords`: Optional, max 500 characters
- `pageData`: Optional, defaults to `{"sections":[]}`

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Page created successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "siteId": "2ea85f64-5717-4562-b3fc-2c963f66afa5",
    "templateId": "1da85f64-5717-4562-b3fc-2c963f66afa4",
    "title": "Home Page",
    "slug": "home-page",
    "metaDescription": "Welcome to our website",
    "metaKeywords": "home, welcome, landing",
    "isPublished": false,
    "publishedAt": null,
    "pageData": "{\"sections\":[...]}",
    "order": 0,
    "componentCount": 0,
    "createdAt": "2026-02-14T10:00:00Z",
    "updatedAt": null
  }
}
```

**Slug Generation:**
- Automatically generated from title
- Converted to lowercase
- Spaces replaced with hyphens
- Special characters removed
- Uniqueness enforced per site (appends `-2`, `-3`, etc. if duplicate)

**Error Response (404):**
```json
{
  "success": false,
  "message": "Site with ID {siteId} not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You do not have permission to create pages for this site"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/pages \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Home Page",
    "siteId": "2ea85f64-5717-4562-b3fc-2c963f66afa5",
    "metaDescription": "Welcome to our website"
  }'
```

---

### 4. Update Page

**Endpoint:** `PUT /api/v1/pages/{id}`

**Authentication:** ✅ Required (must be site owner)

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Home Page",
  "metaDescription": "Updated welcome page description",
  "metaKeywords": "home, welcome, updated",
  "pageData": "{\"sections\":[{\"id\":\"hero-1\",\"type\":\"hero\",\"components\":[{\"type\":\"heading\",\"content\":\"Welcome to SiteCraft - Updated\"}]}]}"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page updated successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "siteId": "2ea85f64-5717-4562-b3fc-2c963f66afa5",
    "templateId": "1da85f64-5717-4562-b3fc-2c963f66afa4",
    "title": "Updated Home Page",
    "slug": "updated-home-page",
    "metaDescription": "Updated welcome page description",
    "metaKeywords": "home, welcome, updated",
    "isPublished": false,
    "publishedAt": null,
    "pageData": "{\"sections\":[...]}",
    "order": 0,
    "componentCount": 1,
    "createdAt": "2026-02-14T10:00:00Z",
    "updatedAt": "2026-02-14T11:30:00Z"
  }
}
```

**Slug Behavior:**
- If title changes, slug is automatically regenerated
- Uniqueness is maintained (excludes current page from duplicate check)

**Error Response (404):**
```json
{
  "success": false,
  "message": "Page with ID {id} not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You do not have permission to update this page"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5263/api/v1/pages/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Home Page",
    "metaDescription": "Updated description",
    "pageData": "{\"sections\":[]}"
  }'
```

---

### 5. Delete Page

**Endpoint:** `DELETE /api/v1/pages/{id}`

**Authentication:** ✅ Required (must be site owner)

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page deleted successfully",
  "data": null
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Page not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You do not have permission to delete this page"
}
```

**Notes:**
- Deleting a page also cascades to delete all associated components
- Published pages can be deleted (consider adding a confirmation in UI)

**cURL Example:**
```bash
curl -X DELETE http://localhost:5263/api/v1/pages/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### 6. Publish Page

**Endpoint:** `POST /api/v1/pages/{id}/publish`

**Authentication:** ✅ Required (must be site owner)

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page published successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "siteId": "2ea85f64-5717-4562-b3fc-2c963f66afa5",
    "title": "Home Page",
    "slug": "home-page",
    "isPublished": true,
    "publishedAt": "2026-02-14T12:00:00Z",
    "pageData": "{\"sections\":[...]}",
    "order": 0,
    "componentCount": 3,
    "createdAt": "2026-02-14T10:00:00Z",
    "updatedAt": "2026-02-14T12:00:00Z"
  }
}
```

**Behavior:**
- Sets `isPublished = true`
- Sets `publishedAt = DateTime.UtcNow`
- Updates `updatedAt` timestamp
- Page becomes publicly visible (frontend implementation required)

**Error Response (404):**
```json
{
  "success": false,
  "message": "Page with ID {id} not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You do not have permission to publish this page"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/pages/3fa85f64-5717-4562-b3fc-2c963f66afa6/publish \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### 7. Unpublish Page

**Endpoint:** `POST /api/v1/pages/{id}/unpublish`

**Authentication:** ✅ Required (must be site owner)

**Headers:**
```http
X-Tenant-Id: default
Authorization: Bearer your_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page unpublished successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "siteId": "2ea85f64-5717-4562-b3fc-2c963f66afa5",
    "title": "Home Page",
    "slug": "home-page",
    "isPublished": false,
    "publishedAt": null,
    "pageData": "{\"sections\":[...]}",
    "order": 0,
    "componentCount": 3,
    "createdAt": "2026-02-14T10:00:00Z",
    "updatedAt": "2026-02-14T13:00:00Z"
  }
}
```

**Behavior:**
- Sets `isPublished = false`
- Sets `publishedAt = null`
- Updates `updatedAt` timestamp
- Page becomes draft (not publicly visible)

**Error Response (404):**
```json
{
  "success": false,
  "message": "Page with ID {id} not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You do not have permission to unpublish this page"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5263/api/v1/pages/3fa85f64-5717-4562-b3fc-2c963f66afa6/unpublish \
  -H "X-Tenant-Id: default" \
  -H "Authorization: Bearer your_token_here"
```

---

### Page Ownership & Permissions

- ✅ Pages are owned through their parent Site
- ✅ Only the site owner can create/update/delete/publish pages
- ✅ Pages are tenant-scoped (multi-tenancy supported)
- ✅ Slug uniqueness is enforced per site (not per tenant)
- ✅ `UpdatedAt` timestamp automatically set when page is modified

### PageData JSON Structure

The `pageData` field stores the complete page structure as JSON:

```json
{
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0,
      "visible": true,
      "components": [
        {
          "id": "heading-1",
          "type": "heading",
          "content": "Welcome to SiteCraft",
          "styles": {
            "fontSize": "48px",
            "fontWeight": "bold",
            "color": "#111111"
          }
        },
        {
          "id": "button-1",
          "type": "button",
          "content": "Get Started",
          "styles": {
            "backgroundColor": "#F6C453",
            "color": "#111111",
            "padding": "12px 24px"
          }
        }
      ]
    }
  ]
}
```

### Component Types

Supported component types in `pageData`:
- `heading` - Text headings (H1-H6)
- `text` - Paragraph text
- `button` - Call-to-action buttons
- `image` - Images with alt text
- `video` - Embedded videos
- `form` - Contact/lead forms
- `icon` - Icon elements

### TypeScript Example

```typescript
import { pageService } from '@/services/page.service';

// Get all pages for a site
const pages = await pageService.getPagesBySite(siteId);

// Create a new page
const newPage = await pageService.createPage({
  title: 'Home Page',
  siteId: siteId,
  metaDescription: 'Welcome page',
  pageData: JSON.stringify({ sections: [] })
});

// Update page content (save from builder)
const updated = await pageService.updatePage(pageId, {
  title: 'Updated Home',
  metaDescription: 'New description',
  pageData: JSON.stringify(builderData)
});

// Publish page
await pageService.publishPage(pageId);

// Unpublish page
await pageService.unpublishPage(pageId);

// Delete page
await pageService.deletePage(pageId);
```

---

## �📦 Response Format

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
- **Password Requirements (Login/Register):** Minimum 6 characters
- **Password Requirements (Reset):** Minimum 8 characters with complexity rules
- **Password Reset Token:** Valid for 1 hour
- **Rate Limiting:** 10 requests/minute, 30 requests/5 minutes, 100 requests/hour on auth endpoints
- **CORS:** Configured for `localhost:5173`, `localhost:5174`, `localhost:3000`
- **Page Slugs:** Auto-generated from title, unique per site (not per tenant)
- **PageData Format:** JSON string stored in database, parsed by frontend builder
- **Page Ownership:** Validated through site ownership (user must own the site)

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
