# dev_context.md — SiteCraft Development AI Context

## 1. Purpose
This file teaches AI agents how to write correct, consistent code for the **SiteCraft** platform by understanding:
- System architecture
- Tech stack
- Coding conventions
- Multi-tenant logic
- API patterns
- Folder structures
- Naming conventions

---

## 2. Technology Stack Summary

### Frontend (React)
- React 19
- Vite (build tool)
- TypeScript
- React Router 7.6
- Tailwind CSS 3.4
- React Query 5.x
- Zustand
- Axios
- React Hook Form + Yup
- shadcn/ui
- Recharts

### Backend (ASP.NET Core)
- ASP.NET Core 8
- EF Core 8
- MySQL 8
- Redis 7
- Hangfire
- Azure Blob Storage / S3-compatible
- Serilog
- Swashbuckle

### Deployment
- Docker + Docker Compose
- VPS hosting (Contabo/Hetzner)
- Nginx reverse proxy with Let's Encrypt SSL
- GitHub Actions (CI/CD)

---

## 3. Architecture Summary
Follow Clean Architecture:

```
src/
  SiteCraft.Api            → Controllers, Middleware, Auth, Tenant Resolution
  SiteCraft.Application    → Services, DTOs, Validations, Use Cases
  SiteCraft.Domain         → Entities, Interfaces, Aggregates
  SiteCraft.Infrastructure → EF Core, MySQL, Redis, S3, Hangfire, Logging
```

Frontend folder structure:

```
src/
  app/
  features/
  components/
  lib/
  store/
  styles/
```

---

## 4. Multi-Tenant Rules

### Tenant Identification
AI must always assume:
- Every backend endpoint expects a tenant context
- Tenant ID is resolved via:
  - Host (subdomain)
  - Or header: `X-Tenant`
- Every DB query must be filtered by TenantId

### Tenant Data Isolation
Use:
- Shared Database
- TenantId column on all tenant-scoped tables

---

## 5. API Patterns

### REST format:
Endpoints:
```
/api/v1/auth/login
/api/v1/templates
/api/v1/sites
/api/v1/domains
/api/v1/billing
```

Responses:
```
{
  "success": true,
  "message": "",
  "data": { ... }
}
```

Errors:
```
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
- Files: kebab-case
- Variables: camelCase

### Backend
- Classes: PascalCase
- Interfaces: IName
- DTOs: SomethingDTO
- Db tables: PascalCase
- Columns: camelCase

---

## 7. Code Generation Standards

### Frontend
- Use React Query for server state
- Use Zustand for UI state
- Forms = React Hook Form + Yup
- Axios instance with interceptors

### Backend
- Use Services inside Application layer
- Controllers must be thin
- EF Core must be inside Infrastructure
- Validation via FluentValidation
- Background jobs in Hangfire

---

## 8. Security
AI must enforce:
- JWT auth
- Tenant isolation
- Avoid exposing secrets
- Never generate insecure code

