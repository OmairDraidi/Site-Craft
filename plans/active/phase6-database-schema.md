# Phase 6: Database Schema Implementation

**Status:** 🔜 Planned  
**Phase:** Data Layer Setup  
**Start Date:** TBD (alongside environment setup)  
**Target Completion:** TBD  
**Owner:** Development Team

---

## Objective

Implement the complete **multi-tenant database schema** for SiteCraft based on the ERD from [Phase1_System_Analysis.md](../completed/Phase1_System_Analysis.md), including:
- All core entities (Tenants, Users, Templates, Pages, etc.)
- Multi-tenant row-level isolation (`TenantId` on all tables)
- Proper indexes for performance
- Foreign key relationships
- Seed data for development/testing

**Reference:** [ERD Diagram](../completed/Phase1_System_Analysis.md#L834-L920)

---

## Prerequisites

- ✅ MySQL 8 installed and running
- ✅ Entity Framework Core configured in Infrastructure layer
- ✅ `ApplicationDbContext` created

---

## Database Schema Overview

### Global Tables (No TenantId)
- `Tenants` — Tenant registration and metadata
- `SuperAdmins` — SuperAdmin users (platform owners)
- `SubscriptionPlans` — Available subscription tiers (Free, Starter, Pro, Enterprise)

### Tenant-Scoped Tables (Include TenantId)
- `Users` — Tenant users (TenantAdmin, TenantUser)
- `Templates` — Website templates
- `Pages` — Website pages
- `Components` — Page components/blocks
- `Domains` — Custom domain mappings
- `MediaFiles` — Uploaded files (images, videos, etc.)
- `Settings` — Tenant-specific settings
- `AuditLogs` — Action logs for compliance
- `Subscriptions` — Tenant billing/subscription records

---

## Tasks & Progress

### 1. Core Entities (Domain Layer) ✅❌

#### 1.1 Create Global Entities

**Tenant Entity**
- [ ] Create `Tenant.cs` in `SiteCraft.Domain/Entities/`:
  - Properties:
    - `Id` (int, PK)
    - `Name` (string, required, max 100)
    - `Subdomain` (string, unique, required, max 50)
    - `SubscriptionPlanId` (int, FK)
    - `IsActive` (bool, default true)
    - `SubscriptionExpiresAt` (DateTime?)
    - `CreatedAt` (DateTime)
    - `UpdatedAt` (DateTime?)
  - Navigation Properties:
    - `SubscriptionPlan` (SubscriptionPlan)
    - `Users` (ICollection<User>)
    - `Domains` (ICollection<Domain>)

**SuperAdmin Entity**
- [ ] Create `SuperAdmin.cs`:
  - Properties:
    - `Id` (int, PK)
    - `Email` (string, unique, required)
    - `PasswordHash` (string, required)
    - `FirstName` (string, required)
    - `LastName` (string, required)
    - `IsActive` (bool)
    - `CreatedAt` (DateTime)

**SubscriptionPlan Entity**
- [ ] Create `SubscriptionPlan.cs`:
  - Properties:
    - `Id` (int, PK)
    - `Name` (string, required) — "Free", "Starter", "Pro", "Enterprise"
    - `Price` (decimal)
    - `Currency` (string, default "USD")
    - `MaxPages` (int?)
    - `MaxUsers` (int?)
    - `MaxStorage` (int?) — in MB
    - `Features` (string, JSON) — JSON array of feature flags
    - `IsActive` (bool)

#### 1.2 Create Tenant-Scoped Entities

**User Entity** (already created in auth plan)
- [ ] Verify `User.cs` includes:
  - `TenantId` (int, FK, required)
  - `Email`, `PasswordHash`, `FirstName`, `LastName`, `Role`
  - Navigation: `Tenant`

**Template Entity**
- [ ] Create `Template.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int?, FK) — Null for global templates, set for tenant-custom templates
    - `Name` (string, required)
    - `Description` (string?)
    - `PreviewImageUrl` (string?)
    - `Category` (string) — "Business", "Portfolio", "E-commerce", etc.
    - `IsPublic` (bool) — True if available to all tenants
    - `TemplateData` (string, JSON) — JSON structure of the template
    - `CreatedAt` (DateTime)
    - `UpdatedAt` (DateTime?)

**Page Entity**
- [ ] Create `Page.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int, FK, required)
    - `Title` (string, required)
    - `Slug` (string, required, unique per tenant)
    - `MetaDescription` (string?)
    - `MetaKeywords` (string?)
    - `IsPublished` (bool, default false)
    - `PublishedAt` (DateTime?)
    - `PageData` (string, JSON) — JSON representation of page structure
    - `TemplateId` (int?, FK) — Optional template reference
    - `CreatedAt` (DateTime)
    - `UpdatedAt` (DateTime?)
  - Navigation:
    - `Tenant` (Tenant)
    - `Components` (ICollection<Component>)

**Component Entity**
- [ ] Create `Component.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int, FK, required)
    - `PageId` (int, FK, required)
    - `Type` (string, required) — "Hero", "Text", "Image", "Button", "Form", etc.
    - `Content` (string, JSON) — JSON config for the component
    - `Order` (int) — Display order on page
    - `IsVisible` (bool, default true)
    - `CreatedAt` (DateTime)
    - `UpdatedAt` (DateTime?)
  - Navigation:
    - `Page` (Page)

**Domain Entity**
- [ ] Create `Domain.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int, FK, required)
    - `DomainName` (string, unique, required) — e.g., "example.com"
    - `IsPrimary` (bool, default false) — One primary domain per tenant
    - `IsVerified` (bool, default false) — DNS verification status
    - `SslEnabled` (bool, default false)
    - `CreatedAt` (DateTime)
  - Navigation:
    - `Tenant` (Tenant)

**MediaFile Entity**
- [ ] Create `MediaFile.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int, FK, required)
    - `FileName` (string, required)
    - `FileUrl` (string, required) — S3/Azure Blob URL
    - `FileSize` (long) — in bytes
    - `MimeType` (string) — "image/png", "video/mp4", etc.
    - `UploadedBy` (int, FK) — UserId
    - `CreatedAt` (DateTime)
  - Navigation:
    - `Tenant` (Tenant)
    - `UploadedByUser` (User)

**Settings Entity**
- [ ] Create `Settings.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int, FK, required)
    - `Key` (string, required) — "SiteName", "Logo", "PrimaryColor", etc.
    - `Value` (string, required)
    - `UpdatedAt` (DateTime?)
  - Unique constraint: (`TenantId`, `Key`)

**AuditLog Entity** (optional, for tracking user actions)
- [ ] Create `AuditLog.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int, FK, required)
    - `UserId` (int, FK)
    - `Action` (string) — "PageCreated", "TemplateApplied", "UserAdded", etc.
    - `EntityType` (string) — "Page", "User", "Domain", etc.
    - `EntityId` (int?)
    - `Details` (string, JSON?) — Additional context
    - `IpAddress` (string?)
    - `CreatedAt` (DateTime)

**Subscription Entity**
- [ ] Create `Subscription.cs`:
  - Properties:
    - `Id` (int, PK)
    - `TenantId` (int, FK, required)
    - `SubscriptionPlanId` (int, FK, required)
    - `Status` (string) — "Active", "Cancelled", "Expired", "Trialing"
    - `StartDate` (DateTime)
    - `EndDate` (DateTime?)
    - `StripeSubscriptionId` (string?) — External payment provider ID
    - `CreatedAt` (DateTime)
    - `UpdatedAt` (DateTime?)
  - Navigation:
    - `Tenant` (Tenant)
    - `SubscriptionPlan` (SubscriptionPlan)

---

### 2. Entity Configurations (Infrastructure Layer) ✅❌

#### 2.1 Configure Relationships & Constraints

For each entity, create a configuration class in `Infrastructure/Data/Configurations/`:

**TenantConfiguration**
- [ ] Create `TenantConfiguration.cs`:
  - Table name: `Tenants`
  - Index: `Subdomain` (unique)
  - Relationship: `Tenant` → `SubscriptionPlan` (many-to-one)

**UserConfiguration**
- [ ] Create `UserConfiguration.cs`:
  - Table name: `Users`
  - Index: (`TenantId`, `Email`) — unique composite
  - Relationship: `User` → `Tenant` (many-to-one)

**TemplateConfiguration**
- [ ] Create `TemplateConfiguration.cs`:
  - Table name: `Templates`
  - Index: `TenantId`, `Category`
  - Allow `TenantId` to be null (for global templates)

**PageConfiguration**
- [ ] Create `PageConfiguration.cs`:
  - Table name: `Pages`
  - Index: (`TenantId`, `Slug`) — unique composite
  - Relationship: `Page` → `Tenant`, `Page` → `Template` (optional)

**ComponentConfiguration**
- [ ] Create `ComponentConfiguration.cs`:
  - Table name: `Components`
  - Index: (`PageId`, `Order`)
  - Relationship: `Component` → `Page` (many-to-one)

**DomainConfiguration**
- [ ] Create `DomainConfiguration.cs`:
  - Table name: `Domains`
  - Index: `DomainName` (unique)
  - Relationship: `Domain` → `Tenant`

**MediaFileConfiguration**
- [ ] Create `MediaFileConfiguration.cs`:
  - Table name: `MediaFiles`
  - Index: `TenantId`, `UploadedBy`
  - Relationship: `MediaFile` → `Tenant`, `MediaFile` → `User`

**SettingsConfiguration**
- [ ] Create `SettingsConfiguration.cs`:
  - Table name: `Settings`
  - Unique index: (`TenantId`, `Key`)

**AuditLogConfiguration**
- [ ] Create `AuditLogConfiguration.cs`:
  - Table name: `AuditLogs`
  - Index: `TenantId`, `UserId`, `CreatedAt`

**SubscriptionConfiguration**
- [ ] Create `SubscriptionConfiguration.cs`:
  - Table name: `Subscriptions`
  - Index: `TenantId`, `Status`
  - Relationship: `Subscription` → `Tenant`, `Subscription` → `SubscriptionPlan`

#### 2.2 Register Configurations in DbContext
- [ ] In `ApplicationDbContext.OnModelCreating()`, apply all configurations:
  ```csharp
  modelBuilder.ApplyConfiguration(new TenantConfiguration());
  modelBuilder.ApplyConfiguration(new UserConfiguration());
  // ... etc for all entities
  ```

---

### 3. Global Query Filters (Multi-Tenant Isolation) ✅❌

#### 3.1 Configure TenantId Filter
- [ ] In `ApplicationDbContext.OnModelCreating()`, add global query filters:
  ```csharp
  modelBuilder.Entity<User>()
      .HasQueryFilter(u => u.TenantId == CurrentTenantId);
  modelBuilder.Entity<Page>()
      .HasQueryFilter(p => p.TenantId == CurrentTenantId);
  // ... etc for all tenant-scoped entities
  ```
- [ ] Create property `CurrentTenantId` in `ApplicationDbContext`:
  - Get from `IHttpContextAccessor` (set by middleware)

#### 3.2 Bypass Filter for SuperAdmin
- [ ] Allow SuperAdmin queries to bypass filter using `.IgnoreQueryFilters()`

---

### 4. Migrations ✅❌

#### 4.1 Create Initial Migration
- [ ] Run: `dotnet ef migrations add InitialSchema --project SiteCraft.Infrastructure --startup-project SiteCraft.API`
- [ ] Review generated migration file
- [ ] Verify all tables, indexes, and foreign keys are correct

#### 4.2 Apply Migration
- [ ] Run: `dotnet ef database update --project SiteCraft.Infrastructure --startup-project SiteCraft.API`
- [ ] Connect to MySQL and verify tables created:
  ```sql
  SHOW TABLES;
  DESCRIBE Users;
  DESCRIBE Pages;
  ```

#### 4.3 Test Rollback (Optional)
- [ ] Run: `dotnet ef database update <previous-migration-name>`
- [ ] Verify rollback works
- [ ] Re-apply latest migration

---

### 5. Seed Data ✅❌

#### 5.1 Create Seed Data Script
- [ ] Create `DataSeeder.cs` in `Infrastructure/Data/`:
  - Method: `SeedAsync(ApplicationDbContext context)`

#### 5.2 Seed Subscription Plans
- [ ] Add records:
  - Free: $0, Max 5 pages, 1 user
  - Starter: $9, Max 20 pages, 3 users
  - Pro: $29, Max 100 pages, 10 users
  - Enterprise: $99, Unlimited pages/users

#### 5.3 Seed Test Tenant
- [ ] Add test tenant:
  - Name: "Test Company"
  - Subdomain: "testcompany"
  - SubscriptionPlan: Free

#### 5.4 Seed Test Users
- [ ] Add test TenantAdmin user:
  - Email: "admin@testcompany.com"
  - Password: "Test@1234" (hashed)
  - TenantId: (Test Company)
  - Role: TenantAdmin
- [ ] Add test TenantUser:
  - Email: "user@testcompany.com"
  - TenantId: (Test Company)
  - Role: TenantUser

#### 5.5 Seed Global Templates
- [ ] Add 2-3 sample templates:
  - Name: "Business Landing Page"
  - Category: "Business"
  - IsPublic: true
  - TenantId: null

#### 5.6 Call Seeder in Program.cs
- [ ] In `Program.cs`, after `app.Build()`:
  ```csharp
  using (var scope = app.Services.CreateScope())
  {
      var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
      await DataSeeder.SeedAsync(context);
  }
  ```
- [ ] Run app and verify seed data created

---

### 6. Repository Interfaces ✅❌

#### 6.1 Create Repository Interfaces in Domain
- [ ] `IUserRepository`
- [ ] `ITenantRepository`
- [ ] `ITemplateRepository`
- [ ] `IPageRepository`
- [ ] `IComponentRepository`
- [ ] `IDomainRepository`
- [ ] `IMediaFileRepository`
- [ ] `ISettingsRepository`
- [ ] `ISubscriptionRepository`

#### 6.2 Implement Repositories in Infrastructure
- [ ] Create implementations in `Infrastructure/Repositories/`:
  - Inherit from `BaseRepository<T>` (if using generic repository pattern)
  - Use EF Core for CRUD operations
  - Ensure all queries respect `TenantId` filter

---

### 7. Testing ✅❌

#### 7.1 Database Connection Test
- [ ] Write integration test:
  - Connect to database
  - Verify all tables exist
  - Verify indexes exist

#### 7.2 Multi-Tenant Isolation Test
- [ ] Create test:
  - Create 2 tenants with different users/pages
  - Query pages for Tenant A → Should only return Tenant A pages
  - Verify global query filter works

#### 7.3 Seed Data Test
- [ ] Verify seed data created:
  - Check subscription plans exist
  - Check test tenant exists
  - Check test users can login

#### 7.4 Migration Rollback Test
- [ ] Test: Apply migration → Rollback → Re-apply
- [ ] Verify no data loss or corruption

---

## Acceptance Criteria

- ✅ All tables created in MySQL database
- ✅ All foreign key relationships configured correctly
- ✅ Indexes created for performance (TenantId, Email, Slug, etc.)
- ✅ Global query filter applies `TenantId` automatically
- ✅ Seed data created successfully (plans, test tenant, test users)
- ✅ Multi-tenant isolation verified (tenants cannot see each other's data)
- ✅ Migrations can be applied and rolled back without errors
- ✅ All repositories implemented and tested

---

## Database Indexes Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| `Users` | (`TenantId`, `Email`) | Unique per tenant, fast login lookup |
| `Pages` | (`TenantId`, `Slug`) | Unique slugs per tenant, SEO URLs |
| `Templates` | (`TenantId`, `Category`) | Fast filtering by category |
| `Domains` | `DomainName` | Unique, fast domain resolution |
| `MediaFiles` | (`TenantId`, `UploadedBy`) | Fast user file queries |
| `Settings` | (`TenantId`, `Key`) | Unique settings per tenant |
| `AuditLogs` | (`TenantId`, `CreatedAt`) | Fast log queries with date range |

---

## Dependencies

**Blocks:**
- All feature development (requires schema to exist)

**Blocked By:**
- Environment setup (MySQL and EF Core must be configured)

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Migration failures | Medium | High | Test migrations in dev environment first, use version control |
| Data loss during rollback | Low | Critical | Always backup production database before migrations |
| Index performance issues | Low | Medium | Monitor query performance, add/remove indexes as needed |
| Multi-tenant filter bypass | Low | Critical | Comprehensive testing, code reviews |

---

## Notes

- Use **UTC timestamps** for all `DateTime` fields
- Implement **soft deletes** (add `DeletedAt` field) for audit purposes
- Consider **database backups** before every migration in production
- Use **EF Core migrations** not manual SQL scripts (for consistency)
- Add **database versioning** table to track schema changes

---

**Last Updated:** February 9, 2026  
**Related Plans:** [phase6-auth-system.md](./phase6-auth-system.md), [phase6-environment-setup.md](./phase6-environment-setup.md)
