# 🚀 SiteCraft Setup Guide - Phase 6

**Status:** ✅ Environment Setup Complete

## 📋 What's Been Set Up

### ✅ Backend (ASP.NET Core 8)
- Clean Architecture structure (4 layers + 2 test projects)
- NuGet packages installed:
  - Pomelo.EntityFrameworkCore.MySql (9.0)
  - StackExchange.Redis (2.7.27)
  - Microsoft.AspNetCore.Authentication.JwtBearer (8.0.11)
  - Serilog.AspNetCore (10.0)
  - FluentValidation.AspNetCore (11.3.1)
- `Program.cs` configured with:
  - JWT Authentication
  - MySQL DbContext
  - Redis Caching
  - CORS
  - Swagger/OpenAPI
  - Serilog logging
- `appsettings.Development.json` with all configurations
- Basic `SiteCraftDbContext` created

### ✅ Frontend (React 19 + Vite)
- Vite project structure
- Dependencies configured:
  - React 19 + TypeScript
  - React Router v7
  - Axios
  - Zustand
  - TanStack Query
  - React Hook Form + Zod
  - Tailwind CSS + Sass
  - Lucide React icons
- Configuration files:
  - `vite.config.ts` (with API proxy)
  - `tsconfig.json`
  - `tailwind.config.js`
  - `.env.development`
- Basic `App.tsx` with API test UI

### ✅ Docker (MySQL + Redis)
- `docker-compose.yml` configured for:
  - **MySQL 8.0** (port 3306)
  - **Redis 7** (port 6379)
  - Health checks
  - Data persistence volumes

---

## 🏁 Quick Start

### 1. Start Docker Containers

```bash
cd backend
docker-compose up -d
```

Verify:
```bash
docker ps
```

You should see `sitecraft_mysql` and `sitecraft_redis` running.

### 2. Run Backend

```bash
cd backend/src/SiteCraft.API
dotnet run
```

Backend endpoints:
- **API:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger
- **Health:** http://localhost:5000/api/health

### 3. Run Frontend

```bash
cd sitecraft-client
npm run dev
```

Frontend:
- **URL:** http://localhost:5173

### 4. Test Integration

1. Open http://localhost:5173
2. Click "Test Backend Connection"
3. Should receive response from `http://localhost:5000/api/hello`

---

## 📦 Project Structure

```
Project with iman/
├── backend/
│   ├── src/
│   │   ├── SiteCraft.Domain/          (Entities, Interfaces)
│   │   ├── SiteCraft.Application/     (Services, DTOs, Validators)
│   │   ├── SiteCraft.Infrastructure/  (EF Core, Repos, Redis)
│   │   └── SiteCraft.API/             (Controllers, Middleware)
│   ├── tests/
│   │   ├── SiteCraft.UnitTests/
│   │   └── SiteCraft.IntegrationTests/
│   ├── docker-compose.yml
│   └── SiteCraft.sln
│
└── sitecraft-client/
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    └── package.json
```

---

## 🔧 Configuration Summary

### Backend (`appsettings.Development.json`)

| Setting | Value |
|---------|-------|
| **Database** | `localhost:3306` |
| **DB Name** | `sitecraft_db` |
| **DB User** | `sitecraft_user` |
| **DB Password** | `sitecraft_pass` |
| **Redis** | `localhost:6379` |
| **JWT Secret** | ⚠️ Change in production |
| **CORS** | `http://localhost:5173` |

### Frontend (`.env.development`)

| Setting | Value |
|---------|-------|
| **API Base URL** | `http://localhost:5000/api/v1` |
| **App Name** | `SiteCraft` |

---

## ✅ Verification Checklist

### Backend
- [ ] `dotnet build` succeeds without errors
- [ ] MySQL container is running (`docker ps`)
- [ ] Redis container is running (`docker ps`)
- [ ] API starts on port 5000
- [ ] Swagger UI accessible at `/swagger`
- [ ] Health endpoint returns `200 OK`

### Frontend
- [ ] `npm install` completes successfully
- [ ] `npm run dev` starts without errors
- [ ] App loads at `http://localhost:5173`
- [ ] "Test Backend Connection" button works
- [ ] Receives valid JSON response from API

---

## 🐛 Common Issues

### ❌ Backend Build Error: `AddStackExchangeRedisCache not found`
**Solution:** Package was added - run `dotnet restore`

### ❌ Docker containers won't start
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Restart
docker-compose up -d
```

### ❌ Frontend npm install fails
```bash
cd sitecraft-client
rm -rf node_modules package-lock.json
npm install
```

### ❌ Port 3306 already in use
Stop existing MySQL:
```bash
# Windows
net stop MySQL80

# Or change port in docker-compose.yml
ports:
  - "3307:3306"  # Use 3307 instead
```

---

## 📝 Next Steps (Phase 6 Tasks)

### Task 2: Multi-Tenancy Setup
- [ ] Add Tenant entity
- [ ] Implement tenant resolution middleware
- [ ] Update DbContext for per-tenant data filtering

### Task 3: Authentication System
- [ ] Create User, Role entities
- [ ] Implement JWT token generation service
- [ ] Add Register/Login endpoints
- [ ] Create auth middleware

### Task 4: Database Schema
- [ ] Define all domain entities
- [ ] Create EF Core configurations
- [ ] Setup relationships (User → Tenant, Site → User, etc.)

### Task 5: Migrations
- [ ] Create initial migration
- [ ] Apply migration to database
- [ ] Seed initial data

---

## 🛠️ Development Commands

### Backend
```bash
# Build
dotnet build

# Run (hot reload)
dotnet watch run --project src/SiteCraft.API

# Create migration
dotnet ef migrations add InitialCreate --project src/SiteCraft.Infrastructure --startup-project src/SiteCraft.API

# Apply migrations
dotnet ef database update --project src/SiteCraft.Infrastructure --startup-project src/SiteCraft.API

# Run tests
dotnet test
```

### Frontend
```bash
# Dev server
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Docker
```bash
# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

---

## 📚 Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)

---

**Setup Completed:** 2026-02-10
**Ready for Development:** ✅
