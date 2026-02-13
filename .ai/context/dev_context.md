# dev_context.md — SiteCraft Development AI Context

## 1. Purpose
This file teaches AI agents how to write correct, consistent code for the **SiteCraft** platform by understanding:
- System architecture
- Tech stack
- Coding conventions
- Multi-tenant logic
- API patterns
- Folder structures

---

## 2. Technology Stack Summary

### Frontend (React)
- React 19
- Vite 6 (build tool)
- TypeScript 5.7
- React Router 7
- Tailwind CSS 3.4
- TanStack React Query 5
- Zustand 5 (state management)
- Axios (API client)
- React Hook Form + Zod (forms + validation)
- Lucide React (icons)

### Backend (ASP.NET Core)
- ASP.NET Core 8
- EF Core 8 (Pomelo.MySql provider)
- MySQL 8
- Redis 7
- BCrypt.Net (password hashing)
- Serilog (logging)
- Swashbuckle (Swagger)

### Deployment
- Docker + Docker Compose (MySQL + Redis containers)
- Backend: `dotnet run` on port 5000
- Frontend: `npm run dev` on port 5173
- VPS hosting planned (Contabo/Hetzner)

---

## 3. Architecture Summary
Follow Clean Architecture:

```
backend/src/
  SiteCraft.API            → Controllers, Middleware, Program.cs
  SiteCraft.Application    → DTOs, Interfaces, Service contracts
  SiteCraft.Domain         → Entities, Interfaces, Enums
  SiteCraft.Infrastructure → EF Core, Repositories, Services, Middleware
```

Frontend folder structure:

```
sitecraft-client/src/
  components/    → Reusable UI (common/, templates/, projects/)
  pages/         → Route pages (DashboardPage, TemplatesPage, projects/)
  services/      → API clients (template.service.ts, project.service.ts)
  stores/        → Zustand stores (useAuthStore, useTemplateStore, useProjectStore)
  types/         → TypeScript interfaces
  lib/           → Utilities
```

---

## 4. Multi-Tenant Rules

### Tenant Identification
AI must always assume:
- Every backend endpoint expects a tenant context
- Tenant ID is resolved via:
  - Header: `X-Tenant-Id` (development)
  - Subdomain: `demo.sitecraft.com` (production)
- Every DB query is auto-filtered by TenantId (Global Query Filter)

### Tenant Data Isolation
Uses:
- Shared Database
- TenantId column on all tenant-scoped tables
- Global Query Filter in EF Core
- Auto-set TenantId on SaveChanges

---

## 5. API Patterns

### REST format:
Endpoints:
```
/api/auth/login
/api/auth/register
/api/auth/refresh
/api/v1/templates
/api/v1/templates/{id}/apply
/api/v1/templates/{id}/favorite
/api/v1/projects
/api/v1/projects/{id}/apply-template
```

Responses:
```json
{
  "success": true,
  "message": "",
  "data": { ... }
}
```

Errors:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 6. Naming Conventions

### Frontend
- Components: PascalCase
- Hooks: useSomething()
- Zustand stores: useSomethingStore
- Files: kebab-case (services, types) or PascalCase (pages, components)
- Variables: camelCase

### Backend
- Classes: PascalCase
- Interfaces: IName
- DTOs: SomethingDto
- Db tables: PascalCase
- Columns: PascalCase (EF Core)

---

## 7. Code Generation Standards

### Frontend
- Use TanStack React Query for server state
- Use Zustand for UI/client state
- Forms = React Hook Form + Zod
- Axios instance with interceptors (auth token auto-attach)

### Backend
- Use Services inside Infrastructure layer (implements Application interfaces)
- Controllers must be thin (delegate to services)
- EF Core must be inside Infrastructure
- Validation via FluentValidation or data annotations
- JWT claims for userId and tenantId

---

## 8. Security
AI must enforce:
- JWT auth on all protected endpoints
- Tenant isolation (never leak cross-tenant data)
- BCrypt for password hashing
- Never expose secrets in code
- Never generate insecure patterns
