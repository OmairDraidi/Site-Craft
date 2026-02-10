# SiteCraft — Architecture Context (AI Summary)

> **Full documentation:** [plans/Architecture.md](../../plans/Architecture.md)

---

## Tech Stack

### Frontend
- **React 19** + **Vite** (build tool)
- **TypeScript** (type safety)
- **Tailwind CSS** (styling)
- **React Router** (tenant-based routing)
- **Zustand / Context API** (state management)
- **Axios** (API client)

### Backend
- **ASP.NET Core 8** (Web API)
- **Clean Architecture** (Domain → Application → Infrastructure → Presentation)
- **Entity Framework Core** (ORM)
- **FluentValidation** (input validation)
- **MediatR** (CQRS pattern)
- **Serilog** (structured logging)

### Database & Caching
- **MySQL 8** (primary database, multi-tenant with `TenantId` on all tables)
- **Redis 7** (caching, session management)

### AI & External Services
- **OpenAI GPT-4** (content generation, SEO suggestions)
- **Stripe** (billing & subscriptions)
- **SendGrid / SMTP** (email)
- **Azure Blob Storage / S3** (file storage)

### Deployment & DevOps
- **Docker + Docker Compose** (containerization)
- **VPS (Contabo/Hetzner)** (hosting — cost-effective)
- **Nginx** (reverse proxy, SSL via Let's Encrypt)
- **GitHub Actions** (CI/CD pipeline)

---

## Clean Architecture Layers

```
┌─────────────────────────────────────┐
│   Presentation (API Controllers)    │  ← HTTP Requests
├─────────────────────────────────────┤
│   Application (Use Cases / CQRS)    │  ← Business Logic
├─────────────────────────────────────┤
│   Domain (Entities, Interfaces)     │  ← Core Business Rules
├─────────────────────────────────────┤
│   Infrastructure (DB, External APIs)│  ← Data Access
└─────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Domain** | Core business entities & rules | `Tenant`, `User`, `Template`, `Page`, `ITenantRepository` |
| **Application** | Use cases, DTOs, CQRS commands/queries | `CreateTenantCommand`, `GetTemplatesQuery`, `AuthService` |
| **Infrastructure** | Database, external services, file storage | `ApplicationDbContext`, `OpenAIClient`, `StripeService` |
| **Presentation** | API controllers, middleware | `TenantController`, `AuthController`, `MultiTenantMiddleware` |

---

## Multi-Tenancy Strategy

### Approach: **Shared Database, Row-Level Isolation**

- **Every table** has a `TenantId` column (except global tables like `Tenants`, `SuperAdmins`)
- **Global Query Filter** in EF Core ensures all queries auto-filter by `TenantId`
- **Middleware** resolves tenant from subdomain (e.g., `acme.sitecraft.com` → `TenantId = 123`)
- **Custom domains** mapped via DNS + `DomainMappings` table

### Tenant Resolution Flow

```
Request → Middleware (extract subdomain/domain)
        → Resolve TenantId from DB
        → Store in HttpContext
        → All DB queries auto-filter by TenantId
```

---

## Frontend Structure (Proposed)

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Buttons, Inputs, Cards, etc.
│   │   ├── builder/      # Visual builder components
│   │   └── dashboard/    # Dashboard-specific components
│   ├── pages/            # Route pages (Dashboard, Templates, Builder, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API clients (axios wrappers)
│   ├── store/            # State management (Zustand)
│   ├── utils/            # Helper functions
│   ├── types/            # TypeScript types/interfaces
│   └── App.tsx           # Main app component + routing
├── public/               # Static assets
└── vite.config.ts        # Vite configuration
```

---

## Backend Structure (Proposed)

```
SiteCraft.Backend/
├── SiteCraft.Domain/           # Core entities, interfaces
│   ├── Entities/               # Tenant, User, Template, Page, etc.
│   ├── Interfaces/             # ITenantRepository, ITemplateService, etc.
│   └── Enums/                  # UserRole, SubscriptionTier, etc.
├── SiteCraft.Application/      # Use cases, DTOs, services
│   ├── Commands/               # CQRS commands (CreateTenant, etc.)
│   ├── Queries/                # CQRS queries (GetTemplates, etc.)
│   ├── DTOs/                   # Data transfer objects
│   └── Services/               # Business logic services
├── SiteCraft.Infrastructure/   # Data access, external APIs
│   ├── Data/                   # DbContext, Migrations, Repositories
│   ├── Integrations/           # OpenAI, Stripe, SendGrid clients
│   └── Storage/                # File storage (S3/Azure Blob)
└── SiteCraft.API/              # Web API (controllers, middleware)
    ├── Controllers/            # TenantController, AuthController, etc.
    ├── Middleware/             # MultiTenantMiddleware, ExceptionMiddleware
    └── Program.cs              # App startup & configuration
```

---

## Docker Services

```yaml
services:
  api:          # ASP.NET Core API
  frontend:     # React app (Nginx-served)
  mysql:        # MySQL 8 database
  redis:        # Redis cache
  worker:       # Background jobs (Hangfire)
  nginx:        # Reverse proxy (optional, for SSL)
```

---

## Multi-Tenant Database Rules

### ✅ Always Include `TenantId`

```csharp
public class Page : BaseEntity
{
    public int TenantId { get; set; }  // ← Required on all tenant-scoped tables
    public string Title { get; set; }
    public string Slug { get; set; }
    // ...
}
```

### ✅ Global Query Filter (EF Core)

```csharp
modelBuilder.Entity<Page>()
    .HasQueryFilter(p => p.TenantId == CurrentTenantId);
```

### ✅ Tenant Resolution Middleware

```csharp
var subdomain = context.Request.Host.Host.Split('.')[0];
var tenant = await _tenantService.GetBySubdomainAsync(subdomain);
context.Items["TenantId"] = tenant.Id;
```

---

## API Structure

**Base URL Pattern:**
```
https://api.sitecraft.com/api/v1/{resource}
```

**Authentication:**
- JWT tokens (Bearer scheme)
- Role-based access: `SuperAdmin`, `TenantAdmin`, `TenantUser`

**Key Endpoints:**
- `POST /api/v1/auth/register` — Register new tenant
- `POST /api/v1/auth/login` — Login (JWT)
- `GET /api/v1/templates` — Get templates (filtered by tenant)
- `POST /api/v1/pages` — Create page (auto-includes TenantId)
- `GET /api/v1/domains` — Manage custom domains

---

## CI/CD Pipeline (GitHub Actions)

1. **On Push to `main`:**
   - Run backend tests (xUnit)
   - Run frontend lint/tests
2. **Build Docker images:**
   - `sitecraft-api:latest`
   - `sitecraft-frontend:latest`
3. **Push to Docker Hub**
4. **Deploy to VPS:**
   - SSH to server
   - `docker-compose pull && docker-compose up -d`
   - Nginx handles SSL via Let's Encrypt

---

## Security & Performance

- **JWT expiration:** 1 hour (access token), 7 days (refresh token)
- **Rate limiting:** 100 req/min per IP
- **CORS:** Whitelisted tenant domains only
- **Redis caching:** Templates (30 min), user sessions (persistent)
- **Database indexing:** `TenantId`, `Slug`, `Email` columns
- **CDN:** Static assets served via Cloudflare (future)

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **ASP.NET Core** over Django | Better .NET ecosystem for enterprise SaaS, Clean Architecture support |
| **MySQL** over PostgreSQL | Familiarity, cost-effectiveness, sufficient for MVP |
| **VPS** over AWS | Lower cost for MVP, easier deployment |
| **Shared DB + Row-Level Isolation** | Simplest multi-tenancy, good for <1000 tenants |
| **React 19** over Next.js | More control, Vite's fast DX |

---

**Last Updated:** February 9, 2026  
**Phase:** Implementation Setup (Phase 6)
