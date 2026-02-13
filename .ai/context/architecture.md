# SiteCraft — Architecture Context (AI Summary)

> **Full documentation:** [plans/Architecture.md](../../plans/Architecture.md)

---

## Tech Stack

### Frontend
- **React 19** + **Vite** (build tool)
- **TypeScript** (type safety)
- **Tailwind CSS** (styling)
- **React Router 7** (routing)
- **Zustand** (state management)
- **TanStack React Query** (server state)
- **Axios** (API client)
- **React Hook Form + Zod** (forms & validation)
- **Lucide React** (icons)

### Backend
- **ASP.NET Core 8** (Web API)
- **Clean Architecture** (Domain → Application → Infrastructure → Presentation)
- **Entity Framework Core** (ORM)
- **FluentValidation** (input validation)
- **Serilog** (structured logging)
- **Swashbuckle** (Swagger/OpenAPI)

### Database & Caching
- **MySQL 8** (primary database, multi-tenant with `TenantId` on all tables)
- **Redis 7** (caching, session management)

### AI & External Services
- **OpenAI GPT-4** (content generation — planned)
- **Stripe** (billing — planned)
- **SendGrid / SMTP** (email — planned)

### Deployment & DevOps
- **Docker + Docker Compose** (containerization)
- **VPS (Contabo/Hetzner)** (hosting — cost-effective)
- **Nginx** (reverse proxy, SSL via Let's Encrypt)
- **GitHub Actions** (CI/CD pipeline — planned)

---

## Clean Architecture Layers

```
┌─────────────────────────────────────┐
│   Presentation (API Controllers)    │  ← HTTP Requests
├─────────────────────────────────────┤
│   Application (Services / DTOs)     │  ← Business Logic
├─────────────────────────────────────┤
│   Domain (Entities, Interfaces)     │  ← Core Business Rules
├─────────────────────────────────────┤
│   Infrastructure (DB, External APIs)│  ← Data Access
└─────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Domain** | Core business entities & rules | `Tenant`, `User`, `Template`, `Site`, `Project`, `ITenantEntity` |
| **Application** | Services, DTOs, interfaces | `ITemplateService`, `IProjectService`, `TemplateDto` |
| **Infrastructure** | Database, repositories, services | `SiteCraftDbContext`, `AuthService`, `TemplateService`, `ProjectService` |
| **Presentation** | API controllers, middleware | `AuthController`, `TemplatesController`, `ProjectsController` |

---

## Multi-Tenancy Strategy

### Approach: **Shared Database, Row-Level Isolation**

- **Every table** has a `TenantId` column (except global tables like `Tenants`, `Templates`)
- **Global Query Filter** in EF Core ensures all queries auto-filter by `TenantId`
- **Middleware** resolves tenant from header (`X-Tenant-Id`) or subdomain
- **Auto-set TenantId** on SaveChanges for new entities

### Tenant Resolution Flow

```
Request → TenantResolutionMiddleware
        → Extract from X-Tenant-Id header (dev) or subdomain (prod)
        → Resolve TenantId from DB
        → Store in TenantService (scoped)
        → All DB queries auto-filter by TenantId
```

---

## Frontend Structure (Current)

```
sitecraft-client/src/
├── components/       # Reusable UI components
│   ├── common/       # Buttons, Inputs, Cards, Layout
│   ├── templates/    # TemplateCard, TemplateGrid, DevicePreview
│   └── projects/     # ProjectCard, etc.
├── pages/            # Route pages
│   ├── DashboardPage.tsx
│   ├── TemplatesPage.tsx
│   └── projects/     # ProjectsPage, ProjectDetailsPage
├── services/         # API clients (axios wrappers)
│   ├── template.service.ts
│   └── project.service.ts
├── stores/           # Zustand state management
│   ├── useTemplateStore.ts
│   ├── useProjectStore.ts
│   └── useAuthStore.ts
├── types/            # TypeScript interfaces
├── lib/              # Utilities
└── App.tsx           # Main app + routing
```

---

## Backend Structure (Current)

```
backend/src/
├── SiteCraft.Domain/
│   ├── Entities/        # Tenant, User, Template, Site, Project, TemplateFavorite
│   ├── Interfaces/      # ITenantEntity, ITenantService, ISiteRepository, ITemplateRepository
│   └── Enums/           # UserRole, TenantStatus, SubscriptionPlan, ProjectStatus
├── SiteCraft.Application/
│   ├── DTOs/            # TemplateDto, ProjectDto, AuthDTOs
│   └── Interfaces/     # ITemplateService, IProjectService, IAuthService
├── SiteCraft.Infrastructure/
│   ├── Data/            # SiteCraftDbContext, Migrations, Configurations
│   ├── Repositories/    # SiteRepository, TemplateRepository
│   ├── Services/        # AuthService, TenantService, TemplateService, ProjectService
│   └── Middleware/      # TenantResolutionMiddleware
└── SiteCraft.API/
    ├── Controllers/     # AuthController, TemplatesController, ProjectsController
    └── Program.cs       # App startup & DI configuration
```

---

## Docker Services

```yaml
services:
  mysql:        # MySQL 8 database (port 3306)
  redis:        # Redis 7 cache (port 6379)
```

Backend runs directly via `dotnet run` on port 5000.  
Frontend runs via `npm run dev` on port 5173.

---

## API Structure

**Base URL:** `http://localhost:5000/api`

### Auth Endpoints
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login (JWT + refresh token)
- `POST /api/auth/refresh` — Refresh access token
- `GET /api/auth/me` — Get current user

### Template Endpoints
- `GET /api/v1/templates` — List templates (pagination)
- `GET /api/v1/templates/{id}` — Template details
- `POST /api/v1/templates` — Create (SuperAdmin)
- `PUT /api/v1/templates/{id}` — Update (SuperAdmin)
- `DELETE /api/v1/templates/{id}` — Delete (SuperAdmin)
- `POST /api/v1/templates/{id}/apply` — Apply to project
- `POST /api/v1/templates/{id}/favorite` — Toggle favorite
- `GET /api/v1/templates/favorites` — User favorites

### Project Endpoints
- `GET /api/v1/projects` — List projects
- `GET /api/v1/projects/{id}` — Project details
- `POST /api/v1/projects` — Create project
- `PUT /api/v1/projects/{id}` — Update project
- `DELETE /api/v1/projects/{id}` — Delete project
- `POST /api/v1/projects/{id}/apply-template` — Apply template

**Authentication:** JWT Bearer tokens  
**Roles:** SuperAdmin, TenantAdmin (Owner), TenantUser (Admin, Member)

---

## Security & Performance

- **JWT:** Access token (1 hour), Refresh token (30 days)
- **Password:** BCrypt hashing
- **Tenant isolation:** Global query filters + TenantId in JWT claims
- **CORS:** Whitelisted origins (localhost:5173)
- **Redis caching:** Templates, sessions
- **Database indexing:** TenantId, Email, Subdomain

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **ASP.NET Core** over Django | Better .NET ecosystem for enterprise SaaS |
| **MySQL** over PostgreSQL | Familiarity, cost-effectiveness |
| **VPS** over AWS | Lower cost for MVP |
| **Shared DB + Row-Level Isolation** | Simplest multi-tenancy for <1000 tenants |
| **React 19** over Next.js | More control, Vite's fast DX |
| **Zustand** over Redux | Simpler API, less boilerplate |

---

**Last Updated:** February 13, 2026  
**Phase:** Phase 8 Complete → Phase 9 (Visual Builder)
