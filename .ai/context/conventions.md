# SiteCraft — Conventions (conventions.md)

## 1. Naming Conventions
### Frontend
- Components: PascalCase  
- Hooks: useSomething  
- Zustand stores: useSomethingStore  
- Pages: PascalCase (e.g., ProjectsPage.tsx)
- Services: kebab-case (e.g., template.service.ts)
- Types: kebab-case (e.g., template.types.ts)
- Variables: camelCase  
- Constants: UPPER_SNAKE_CASE  

### Backend
- Classes: PascalCase  
- Interfaces: IName  
- Methods: PascalCase  
- DTOs: PascalCaseDTO (e.g., TemplateDto, ProjectDto)
- Database tables: PascalCase  
- Columns: PascalCase (EF Core convention)

## 2. Folder Structure Rules

### Frontend
```
sitecraft-client/src/
  components/     # Reusable UI (common/, templates/, projects/)
  pages/          # Route-level pages
  services/       # API clients (axios)
  stores/         # Zustand state stores
  types/          # TypeScript interfaces
  lib/            # Utilities
  styles/         # Global styles
```

### Backend
```
backend/src/
  SiteCraft.API/            # Controllers, Program.cs
  SiteCraft.Application/    # DTOs, Interfaces
  SiteCraft.Domain/         # Entities, Enums, Interfaces
  SiteCraft.Infrastructure/ # Data, Repositories, Services, Middleware
```

## 3. API Conventions
- RESTful endpoints
- Versioning: /api/v1 (templates, projects) or /api (auth)
- Auth via JWT Bearer token
- Tenant included via header: X-Tenant-Id (dev) / subdomain (prod)
- Responses:
```json
{ "success": true, "data": ..., "message": "" }
```

## 4. Git Conventions
- main → production  
- develop → staging  
- feature/xyz  
- fix/xyz  

Commit messages:
```
feat: add domain binding
fix: resolve template loading
refactor: clean builder UI
docs: update architecture
```

## 5. UI/UX Conventions
- Dark mode first (black + gold)
- Glassmorphism effects on cards and panels
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
- Typography: Poppins (display) + Inter (body)
