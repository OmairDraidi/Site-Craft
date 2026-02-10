# Phase 6: Environment Setup & Database Schema

**Status:** � In Progress (3/7 tasks complete)  
**Phase:** Implementation Phase  
**Start Date:** February 9, 2026  
**Last Updated:** February 10, 2026  
**Owner:** Development Team

---

## ✅ Completed Tasks (Updated: Feb 10, 2026)

- ✅ **Task 1:** Backend Environment Setup (100%)
- ✅ **Task 2:** Multi-Tenancy System (100%) - See `plans/completed/Phase6_Task2_MultiTenancy_Setup.md`
- ✅ **Task 3:** Authentication System (100%) - See `plans/completed/Phase6_Task3_Authentication_System.md`
  - ⚠️ MySQL connection issue pending fix

---

## Objective

Set up the complete development environment for SiteCraft, including:
- Backend project structure (ASP.NET Core 8 + Clean Architecture)
- Frontend project setup (React 19 + Vite + TypeScript)
- Database initialization (MySQL 8 with multi-tenant schema)
- Docker environment for local development
- Redis caching layer
- Development tooling & CI/CD foundation

---

## Prerequisites

- [ ] .NET 8 SDK installed
- [ ] Node.js 20+ installed
- [ ] MySQL 8 installed (or use Docker)
- [ ] Docker & Docker Compose installed
- [ ] Git configured
- [ ] IDE ready (VS Code or Rider)

---

## Tasks & Progress

### 1. Backend Setup (ASP.NET Core 8) ✅❌

#### 1.1 Project Structure
- [ ] Create solution: `SiteCraft.sln`
- [ ] Create `SiteCraft.Domain` project (Class Library)
- [ ] Create `SiteCraft.Application` project (Class Library)
- [ ] Create `SiteCraft.Infrastructure` project (Class Library)
- [ ] Create `SiteCraft.API` project (Web API)
- [ ] Configure project dependencies:
  - API → Application, Infrastructure
  - Application → Domain
  - Infrastructure → Domain
- [ ] Add solution folders: `src/`, `tests/`

#### 1.2 Install NuGet Packages

**Domain:**
- [ ] No external dependencies (pure business logic)

**Application:**
- [ ] `Microsoft.Extensions.DependencyInjection.Abstractions`
- [ ] `FluentValidation`
- [ ] `MediatR`

**Infrastructure:**
- [ ] `Microsoft.EntityFrameworkCore`
- [ ] `Pomelo.EntityFrameworkCore.MySql` (MySQL driver)
- [ ] `Microsoft.EntityFrameworkCore.Design`
- [ ] `StackExchange.Redis`
- [ ] `Serilog.AspNetCore`
- [ ] `Serilog.Sinks.Console`
- [ ] `Serilog.Sinks.File`

**API:**
- [ ] `Swashbuckle.AspNetCore` (Swagger)
- [ ] `Microsoft.AspNetCore.Authentication.JwtBearer`
- [ ] `Microsoft.AspNetCore.Cors`

#### 1.3 Folder Structure Setup

```
SiteCraft.Backend/
├── SiteCraft.Domain/
│   ├── Entities/
│   ├── Enums/
│   ├── Interfaces/
│   └── ValueObjects/
├── SiteCraft.Application/
│   ├── Commands/
│   ├── Queries/
│   ├── DTOs/
│   ├── Services/
│   └── Validators/
├── SiteCraft.Infrastructure/
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   ├── Configurations/
│   │   └── Migrations/
│   ├── Repositories/
│   ├── Integrations/
│   └── Services/
└── SiteCraft.API/
    ├── Controllers/
    ├── Middleware/
    ├── Filters/
    └── Program.cs
```

- [ ] Create all folders according to structure above
- [ ] Add `.gitkeep` files to empty folders

#### 1.4 Configuration Files
- [ ] Create `appsettings.json` with:
  - Connection strings (MySQL, Redis)
  - JWT settings
  - CORS origins
  - Logging configuration
- [ ] Create `appsettings.Development.json`
- [ ] Add `appsettings*.json` patterns to `.gitignore` (except template)

---

### 2. Frontend Setup (React 19 + Vite + TypeScript) ✅❌

#### 2.1 Project Initialization
- [ ] Run `npm create vite@latest sitecraft-frontend -- --template react-ts`
- [ ] Navigate to project: `cd sitecraft-frontend`
- [ ] Install dependencies: `npm install`

#### 2.2 Install Core Dependencies
- [ ] `react-router-dom` (routing)
- [ ] `@tanstack/react-query` (server state)
- [ ] `zustand` (client state)
- [ ] `axios` (HTTP client)
- [ ] `react-hook-form` (forms)
- [ ] `yup` (validation)
- [ ] `tailwindcss` + `postcss` + `autoprefixer`
- [ ] `@headlessui/react` or `shadcn/ui` (components)

#### 2.3 Install Dev Dependencies
- [ ] `@types/node`
- [ ] `eslint` + `@typescript-eslint/parser`
- [ ] `prettier`
- [ ] `vite-tsconfig-paths`

#### 2.4 Configure Tailwind CSS
- [ ] Run `npx tailwindcss init -p`
- [ ] Update `tailwind.config.js` with:
  - Content paths: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
  - Custom colors: `gold: '#F6C453'`, `dark: '#0A0A0A'`
  - Custom fonts: Poppins, Inter
- [ ] Add Tailwind directives to `src/index.css`

#### 2.5 Folder Structure Setup

```
sitecraft-frontend/
├── src/
│   ├── components/
│   │   ├── common/      # Buttons, Inputs, Cards
│   │   ├── builder/     # Visual builder components
│   │   └── dashboard/   # Dashboard-specific
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API clients
│   ├── store/           # Zustand stores
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── public/
└── vite.config.ts
```

- [ ] Create all folders
- [ ] Set up path aliases in `vite.config.ts`

#### 2.6 Configuration Files
- [ ] Create `.env.local` with API base URL
- [ ] Create `.eslintrc.json`
- [ ] Create `.prettierrc`
- [ ] Update `vite.config.ts` with port 3000

---

### 3. Database Setup (MySQL 8) ✅❌

#### 3.1 Local MySQL Installation
- [ ] Install MySQL 8 (or use Docker image)
- [ ] Create database: `sitecraft_dev`
- [ ] Create user: `sitecraft_user` with password
- [ ] Grant permissions to user

#### 3.2 Entity Framework Core Setup
- [ ] Create `ApplicationDbContext` in Infrastructure
- [ ] Configure DbSets for initial entities:
  - `Tenants`
  - `Users`
  - (more entities in Phase 6-Database-Schema plan)
- [ ] Configure global query filters for `TenantId`
- [ ] Add connection string to `appsettings.json`

#### 3.3 Initial Migration
- [ ] Install EF Core CLI tools: `dotnet tool install --global dotnet-ef`
- [ ] Create initial migration: `dotnet ef migrations add InitialCreate`
- [ ] Review generated migration code
- [ ] Apply migration: `dotnet ef database update`
- [ ] Verify tables created in MySQL

---

### 4. Redis Setup ✅❌

#### 4.1 Redis Installation
- [ ] Install Redis locally OR use Docker image
- [ ] Start Redis service
- [ ] Test connection: `redis-cli ping` (should return PONG)

#### 4.2 Redis Configuration
- [ ] Create `IRedisService` interface in Domain
- [ ] Create `RedisService` implementation in Infrastructure
- [ ] Add Redis connection string to `appsettings.json`
- [ ] Register `IRedisService` in DI container
- [ ] Test basic set/get operations

---

### 5. Docker Environment ✅❌

#### 5.1 Backend Dockerfile
- [ ] Create `Dockerfile` in backend root:
  - Multi-stage build (build + runtime)
  - Base image: `mcr.microsoft.com/dotnet/aspnet:8.0`
  - Build image: `mcr.microsoft.com/dotnet/sdk:8.0`
- [ ] Create `.dockerignore` file

#### 5.2 Frontend Dockerfile
- [ ] Create `Dockerfile` in frontend root:
  - Multi-stage build (build + nginx serve)
  - Build stage: Node 20 Alpine
  - Runtime: Nginx Alpine
- [ ] Create `.dockerignore` file

#### 5.3 Docker Compose Setup
- [ ] Create `docker-compose.yml` in project root:
  - `api` service (backend)
  - `frontend` service
  - `mysql` service (MySQL 8)
  - `redis` service (Redis 7)
  - Define networks
  - Define volumes for MySQL data persistence
- [ ] Create `docker-compose.override.yml` for dev-specific config
- [ ] Add `.env` file for Docker environment variables

#### 5.4 Docker Testing
- [ ] Build images: `docker-compose build`
- [ ] Start services: `docker-compose up -d`
- [ ] Verify all containers running: `docker-compose ps`
- [ ] Test API endpoint: `http://localhost:5000/api/health`
- [ ] Test frontend: `http://localhost:3000`
- [ ] Stop services: `docker-compose down`

---

### 6. Development Tooling ✅❌

#### 6.1 Git Setup
- [ ] Verify `.gitignore` includes:
  - `node_modules/`
  - `bin/`, `obj/`
  - `dist/`, `build/`
  - `.env`, `.env.local`
  - `appsettings.Development.json`
- [ ] Initialize git repository (if not done)
- [ ] Create initial commit

#### 6.2 IDE Configuration
- [ ] Configure VS Code extensions:
  - C# Dev Kit
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Docker
- [ ] Create `.vscode/settings.json` with:
  - Format on save
  - Auto import organization
  - Prettier as default formatter

#### 6.3 Scripts & Shortcuts
- [ ] Add npm scripts to `package.json`:
  - `dev`: Start dev server
  - `build`: Production build
  - `lint`: Run ESLint
  - `format`: Run Prettier
- [ ] Create `scripts/` folder in backend:
  - `run-migrations.sh` (apply migrations)
  - `seed-database.sh` (seed test data)

---

### 7. CI/CD Foundation ✅❌

#### 7.1 GitHub Actions Workflow
- [ ] Create `.github/workflows/ci.yml`:
  - Trigger on push to `main` and `develop`
  - Jobs:
    - Backend tests (dotnet test)
    - Frontend lint & build
    - Build Docker images
- [ ] Test workflow locally with `act` (optional)
- [ ] Push to GitHub and verify workflow runs

#### 7.2 Environment Variables in GitHub
- [ ] Add secrets to GitHub repo:
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
  - `DB_CONNECTION_STRING` (for tests)

---

### 8. Health Checks & Smoke Tests ✅❌

#### 8.1 Backend Health Endpoint
- [ ] Create `HealthController` in API
- [ ] Add `/api/health` endpoint:
  - Check database connection
  - Check Redis connection
  - Return JSON with status
- [ ] Test endpoint locally

#### 8.2 Frontend Health Check
- [ ] Create `src/services/api.ts` with base Axios instance
- [ ] Add health check call to verify backend connectivity
- [ ] Display connection status on a test page

---

## Acceptance Criteria

- ✅ Backend API runs at `http://localhost:5000`
- ✅ Frontend runs at `http://localhost:3000`
- ✅ MySQL database created with initial schema
- ✅ Redis running and accessible
- ✅ Docker Compose starts all services successfully
- ✅ Health check endpoints return 200 OK
- ✅ No errors in console (backend or frontend)
- ✅ Git repository initialized with proper `.gitignore`
- ✅ CI/CD pipeline runs without errors

---

## Dependencies

**Blocks:**
- Phase 7: Authentication System (needs this environment)
- Phase 8: Feature implementation (needs database + API)

**Blocked By:**
- None (can start immediately)

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Docker networking issues | Medium | Medium | Test locally before Docker, use host networking for dev |
| MySQL connection errors | Low | High | Document connection string format, use Docker MySQL image |
| EF Core migration conflicts | Medium | Medium | Always review migrations before applying, keep migrations small |
| Vite build errors | Low | Low | Follow official Vite docs, use stable versions |

---

## Notes

- Use **Docker for local development** to ensure consistency
- Keep **appsettings.Development.json** out of version control
- Document all **environment variables** in `.env.example`
- Test on **Windows and Linux** (via WSL or Docker)
- Commit frequently with **clear commit messages**

---

**Last Updated:** February 9, 2026  
**Next Plan:** [phase6-auth-system.md](./phase6-auth-system.md)
