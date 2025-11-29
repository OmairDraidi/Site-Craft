# SiteCraft – Architecture & Tech Stack (Architecture.md)

## 1. Overview

**SiteCraft** هو نظام SaaS لبناء مواقع جاهزة (multi-tenant website builder) يعمل بنموذج:
- **منصة إدارة (Admin Panel / Tenant Dashboard)** لكل عميل (Tenant)
- **موقع عام (Public Site)** لكل Tenant (subdomain أو custom domain)
- **نظام قوالب (Templates + Builder)** لتخصيص واجهات المواقع
- **لوحة مركزية لإدارة المنصة** (Platform Owner)

هذه الوثيقة تشرح:
- الـ **Tech Stack المعتمد**
- الـ **High-Level Architecture**
- تفاصيل **Multi-Tenant Design**
- تنظيم **الـ Backend & Frontend**
- **Docker Structure**
- **CI/CD Pipeline** المقترحة

> الهدف: تكون هذه الوثيقة مرجع أساسي عند البدء في التطوير الفعلي.

---

## 2. Tech Stack

### 2.1 Frontend Stack (Admin + Builder + User Portal)

| Technology         | Version | Purpose                    |
|--------------------|---------|----------------------------|
| **React**          | 19.1.0  | إطار العمل الرئيسي للواجهة |
| **JavaScript ES6+**| Latest  | لغة البرمجة               |
| **React Router**   | 7.6.0   | التوجيه بين الصفحات       |
| **Tailwind CSS**   | 3.4.17  | نظام التنسيق (Utility CSS) |
| **React Query**    | 5.81.5  | إدارة البيانات و الـ Server State |
| **React Hook Form**| 7.56.4  | إدارة النماذج             |
| **Yup**            | 1.6.1   | التحقق من بيانات النماذج   |
| **Axios**          | 1.9.0   | HTTP client لطلب الـ APIs |
| **Zustand**        | Latest  | إدارة الـ UI/Local State   |
| **Recharts**       | Latest  | الرسوم البيانية (Dashboards) |
| **shadcn/ui**      | Latest  | مكوّنات جاهزة (UI Library) |

> يمكن لاحقاً إضافة Vite أو Next.js كأداة bundler/SSR، لكن حالياً التركيز على React SPA مع إمكانية التطوير لاحقاً.

---

### 2.2 Backend Stack (Core API & Services)

| Technology                       | Version | Purpose                        |
|----------------------------------|---------|--------------------------------|
| **ASP.NET Core**                 | 8.x     | إطار العمل الرئيسي للـ Backend |
| **C#**                           | 12      | لغة البرمجة                    |
| **Entity Framework Core**        | 8.x     | ORM للوصول للبيانات           |
| **Pomelo.EntityFrameworkCore.MySql** | Latest | MySQL Provider لـ EF Core      |
| **MySQL**                        | 8.0     | قاعدة البيانات الرئيسية        |
| **Redis**                        | 7.x     | Caching & Queues               |
| **AWS S3 SDK**                   | Latest  | تخزين الملفات (Media, Assets) |
| **Hangfire**                     | Latest  | Background Jobs (Emails, Tasks)|
| **FluentValidation**             | Latest  | Data Validation على مستوى الـ API |
| **MailKit**                      | Latest  | إرسال الإيميلات                |
| **Serilog**                      | Latest  | Logging منظم + Sinks متعددة    |
| **Swashbuckle (Swagger)**        | Latest  | توثيق الـ API (Swagger UI)     |

---

## 3. High-Level Architecture

شكل معماري عام (Textual Diagram):

```text
[ Client Browser ] 
      ↓
[ React SPA (Admin + Builder + Portal) ]
      ↓ HTTP(S) / JSON (REST API)
[ ASP.NET Core API ]
      ↓
[ MySQL (Multi-tenant DB) ]
[ Redis Cache / Queues ]
[ AWS S3 – File Storage ]
[ Hangfire – Background Jobs ]
```

على مستوى الـ tenants:

```text
Tenant 1 → tenant1.sitecraft.app → React Frontend → ASP.NET API → DB (Tenant-scoped)
Tenant 2 → tenant2.sitecraft.app → React Frontend → ASP.NET API → DB (Tenant-scoped)
...
Platform Owner → app.sitecraft.app/admin → Global Admin UI
```

---

## 4. Multi-Tenant Architecture

### 4.1 Tenant Model

كل عميل (Tenant) لديه:

- إعدادات خاصة به (branding, domain, modules enabled)
- Users (admins, editors)
- Sites/Templates
- محتوى (Pages, Blocks, Posts, Courses… إلخ حسب الموديولات)

#### الجداول الأساسية (مستوى الـ Data Model – اختصار):

- `Tenants`
  - Id
  - Name
  - Slug (tenant-key)
  - Subdomain (e.g. `tenant1`)
  - CustomDomain (optional)
  - IsActive, Plan, CreatedAt

- `TenantUsers`
  - Id
  - TenantId
  - UserId
  - Role (Owner, Admin, Editor)

- `Users`
  - Id
  - Email
  - PasswordHash
  - Global roles (optional)

- `Sites / Pages / Templates / Modules` مرتبطة بـ `TenantId`

### 4.2 Shared DB vs Separate DB

**الاختيار المبدئي المقترح:**
- **Shared Database + TenantId على كل جدول رئيسي**

المزايا:
- أسهل بالنشر والصيانة
- أقل تكلفة بنيوية
- دعم أسهل للـ reporting & analytics

المبدأ:

كل جدول رئيسي يحتوي على:
- `TenantId` (FK → Tenants)
- كل Queries في الـ Backend **مفلترة دائمًا** بالـ TenantId المستخلص من الـ Subdomain / Token.

> لاحقاً يمكن دعم **Hybrid Model** (بعض الـ VIP Tenants لهم DB خاصة)، لكن ليس في الـ MVP.

### 4.3 Tenant Resolution (Subdomain Routing)

1. المستخدم يزورها: `https://tenant1.sitecraft.app`
2. **Reverse proxy / Frontend** يقرأ الـ Host → يستخرج `tenant1`
3. الـ Frontend يرسل لكل طلب API Header مثل:
   - `X-Tenant: tenant1`
4. الـ ASP.NET Core Middleware:
   - يقرأ `X-Tenant` أو الـ Host
   - يبحث عن Tenant في DB
   - يخزن **TenantContext** في HttpContext
5. كل Services/Repositories تستعمل TenantContext لفلترة البيانات.

> نفس المنطق يدعم **Custom Domain**:  
> `https://my-brand.com` → يربطها بـ Tenant معين في جدول Domains.

---

## 5. Backend Architecture (ASP.NET Core)

### 5.1 Layered / Clean Architecture

مقترح هيكل المشروع:

```text
src/
  SiteCraft.Api            → ASP.NET Core Web API (Controllers, Endpoints)
  SiteCraft.Application    → Business Logic (Services, DTOs, Validation)
  SiteCraft.Domain         → Entities, Aggregates, Interfaces
  SiteCraft.Infrastructure → EF Core, MySQL, Redis, S3, Hangfire, Mail, Logging
```

- **SiteCraft.Domain**
  - Entities: Tenant, User, Site, Page, Template, Domain, Subscription, Invoice…
  - Interfaces: IRepository, ITenantContext, IEmailSender, IFileStorage…

- **SiteCraft.Application**
  - Use Cases / Services: TenantService, TemplateService, DomainService, BillingService…
  - DTOs, Commands/Queries
  - Validation عبر FluentValidation

- **SiteCraft.Infrastructure**
  - EF Core DbContext
  - MySQL Migrations
  - Redis Client
  - Hangfire integration
  - AWS S3 Client
  - Serilog configuration

- **SiteCraft.Api**
  - Controllers / Minimal APIs
  - Authentication (JWT)
  - Tenant middleware
  - Swagger (Swashbuckle)

### 5.2 API Design

بعض الأمثلة على الـ Endpoints (REST):

- `/api/auth/login`
- `/api/auth/register`
- `/api/tenants`
- `/api/tenants/{tenantId}/settings`
- `/api/templates`
- `/api/templates/{id}`
- `/api/sites`
- `/api/domains`
- `/api/billing/subscribe`
- `/api/users`
- `/api/modules`

> يفضّل استخدام **Versioning** للأهم: `/api/v1/...`

### 5.3 Authentication & Authorization

- **JWT Tokens** لكل مستخدم
- **Roles & Permissions** على مستوى Tenant:
  - Owner
  - Admin
  - Editor
- Claims تحتوي: UserId + TenantIds المتاحة

---

## 6. Frontend Architecture (React)

### 6.1 Folder Structure (Proposed)

```text
src/
  app/
    routes/        → React Router routes
    layouts/       → Layouts (AdminLayout, PublicLayout)
  features/
    auth/
    dashboard/
    templates/
    builder/
    domains/
    billing/
    settings/
  components/
    ui/            → shadcn/ui based
    forms/
    charts/
    layout/
  lib/
    api/           → Axios instances, interceptors
    hooks/
    utils/
  store/           → Zustand stores
  styles/
    globals.css
```

### 6.2 State Management

- **React Query** → Server state (data from API)
- **Zustand** → UI state (modals, sidebars, wizard steps…)
- **React Hook Form + Yup** → إدارة النماذج

### 6.3 Theming

- Dark theme افتراضي (Tailwind + CSS Variables)
- Primary color: Gold (`#F6C453`)
- Backgrounds: gradients بين `#0A0A0A` و `#121212`

---

## 7. File Storage & Media

- استخدام **AWS S3** (أو بديل compatible S3)
- مسارات مثل:
  - `sitecraft/{tenantId}/media/...`
- رفع الملفات عبر ASP.NET Core API → S3
- تخزين الـ URL فقط في MySQL

حالات الاستخدام:
- شعارات
- صور القوالب
- خلفيات
- ملفات المستخدم (حسب الميزات)

---

## 8. Caching & Queues (Redis)

### 8.1 Caching

- Caching لبيانات:
  - Tenant settings
  - Templates list
  - Public site pages (optional for anonymous users)

- مفاتيح مثل:
  - `tenant:{tenantId}:settings`
  - `tenant:{tenantId}:templates`
  - `site:{domain}:page:{slug}`

### 8.2 Queues / Background Jobs

- استخدام Redis + Hangfire لـ:
  - إرسال الإيميلات (Welcome, Billing, Domain Verified…)
  - عمليات ثقيلة (Generate template preview, snapshots)
  - Sync tasks (Analytics, Reports)

---

## 9. Docker & Deployment

### 9.1 Docker Services (Proposal)

استخدام `docker-compose` مع الخدمات التالية:

- `frontend` → React app (served via Nginx أو Static hosting)
- `api`      → ASP.NET Core API
- `mysql`    → MySQL 8
- `redis`    → Redis 7
- `worker`   → Hangfire / Background worker (ASP.NET Core console)
- `nginx`    → Reverse proxy (اختياري حسب الاستضافة)
- (S3 خارجي – لا يحتاج container)

### 9.2 Example docker-compose (Skeleton)

```yaml
version: "3.9"
services:
  api:
    image: sitecraft-api:latest
    build: ./backend
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    depends_on:
      - mysql
      - redis

  frontend:
    image: sitecraft-frontend:latest
    build: ./frontend

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: sitecraft

  redis:
    image: redis:7

  worker:
    image: sitecraft-worker:latest
    build: ./backend
    command: ["dotnet", "SiteCraft.Worker.dll"]
    depends_on:
      - redis
```

> في الإنتاج يمكن استخدام:  
> Docker + VPS (مثل Contabo/Hetzner) أو Kubernetes لاحقاً.

---

## 10. CI/CD Pipeline (Proposal)

### 10.1 GitHub Actions (مثال عالي المستوى)

Pipeline للمشروع (Monorepo أو Repos منفصلة):

1. **On Push to main / develop:**
   - تشغيل Unit Tests للـ Backend
   - تشغيل Lint/Tests للـ Frontend
2. **Build Docker images:**
   - `sitecraft-api`
   - `sitecraft-frontend`
3. **Push to Registry:**
   - Docker Hub / GitHub Container Registry
4. **Deploy:**
   - SSH إلى السيرفر وتشغيل `docker-compose pull && docker-compose up -d`
   - أو استخدام Platform مثل: Render / Railway / AWS ECS / Azure App Service

### 10.2 Environments

- `dev` → لأجل التطوير
- `staging` → لاختبار النسخ الجديدة
- `prod` → الإنتاج

كل واحد بمجموعته الخاصة من:
- connection strings
- API keys
- S3 buckets

---

## 11. Logging & Monitoring

- **Serilog** لكتابة الـ Logs إلى:
  - Console
  - File
  - (اختياري) Seq أو ELK أو Application Insights
- Logging مهم لأحداث مثل:
  - Failed logins
  - Domain binding issues
  - Billing errors

يمكن أيضاً:
- Health Checks endpoints: `/health`
- Uptime monitoring خارجي (UptimeRobot، إلخ)

---

## 12. Next Steps

1. تثبيت الـ Stack في ملف README/PRD أيضاً (تلخيص فقط)
2. إنشاء Skeleton حقيقي للمجلدات:
   - `backend/`
   - `frontend/`
3. إعداد docker-compose بسيط محلي
4. بناء أول endpoints + صفحة Dashboard ابتدائية
5. ربط Multi-tenant resolution (Subdomain → Tenant)

هذه الوثيقة تعتبر:
> **المرجع الرسمي للمعمارية التقنية لـ SiteCraft (Architecture.md)**  
وتقدر تضيف عليها أي تعديلات مستقبلية حسب الحاجة.
