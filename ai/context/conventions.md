# SiteCraft — Conventions (conventions.md)

## 1. Naming Conventions
### Frontend
- Components: PascalCase  
- Hooks: useSomething  
- Zustand stores: useSomethingStore  
- Pages: lowercase-with-dashes  
- API files: kebab-case  
- Variables: camelCase  
- Constants: UPPER_SNAKE_CASE  

### Backend
- Classes: PascalCase  
- Interfaces: IName  
- Methods: PascalCase  
- DTOs: PascalCase + DTO  
- Database tables: PascalCase  
- Columns: camelCase  

## 2. Folder Structure Rules

### Frontend
```
src/
  app/
  features/
  components/
  lib/
  store/
  styles/
```

### Backend
```
src/
  SiteCraft.Api/
  SiteCraft.Application/
  SiteCraft.Domain/
  SiteCraft.Infrastructure/
```

## 3. API Conventions
- RESTful endpoints
- Versioning: /api/v1
- Auth via JWT
- Tenant included via header: X-Tenant
- Responses:
```
{ success: true, data: ..., message: "" }
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
- Use shadcn/ui patterns
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
- Typography: Poppins (display) + Inter (body)
