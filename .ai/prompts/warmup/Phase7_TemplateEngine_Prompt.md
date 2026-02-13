# SiteCraft — Phase 7: Template Engine

@WarmUpPrompt.md
@SiteCraft_Feature_Reference.md (F03)

---

## السياق:

- **المرحلة الحالية:** Phase 7 - Template Engine  
- **آخر ما اشتغلت عليه:** Phase 7 Complete - All Features Implemented ✅
- **الحالة:** 
  - Phase 7.1 مكتمل ✅ (Database & Entities)
  - Phase 7.2 مكتمل ✅ (Repository & Service Layer)
  - Phase 7.3 مكتمل ✅ (API Endpoints)
  - Phase 7.4 مكتمل ✅ (Seed Data - 5 Default Templates)
  - Phase 7.5 مكتمل ✅ (Frontend Gallery - Search, Filter, Sort)
  - Phase 7.6 مكتمل ✅ (Apply Template Logic with Premium Checks)
  - Phase 7.7 مكتمل ✅ (Template Favorites System)
  - Phase 7.8 مكتمل ✅ (Device Preview Component)
  - Phase 7.9 مكتمل ✅ (Unit Tests - 11 Tests Passing)
  - **الحالة النهائية:** جميع ميزات Phase 7 مكتملة 🎉

---

## المهمة:

**F03: Template Engine (محرك القوالب)**

بناء نظام قوالب جاهزة يسمح للمستأجرين (Tenants) باختيار وتطبيق قوالب مصممة مسبقاً على مواقعهم.

### الميزات المطلوبة (من Feature Reference):

#### 🔴 **Core Features (أولوية أولى):**
1. **F03.1** — Template Gallery (معرض القوالب)
2. **F03.6** — Apply Template (تطبيق القالب)
3. **F03.10** — Template CRUD (إدارة القوالب للـ SuperAdmin)
4. **F03.11** — 5 Default Templates (قوالب افتراضية)

#### 🟡 **Secondary Features (أولوية ثانية):**
5. **F03.2** — Template Filtering (فلترة بالفئة)
6. **F03.3** — Template Search (بحث نصي)
7. **F03.4** — Template Sorting (ترتيب)
8. **F03.7** — Template Details Page (صفحة التفاصيل)
9. **F03.8** — Free/Premium Badge (تمييز المجاني/المدفوع)
10. **F03.9** — Template Favorites (حفظ المفضلة)

---

## المتطلبات:

### 1. **Backend (ASP.NET Core 8)**

**Database Schema:**
```csharp
public class Template
{
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }  // null = Global template
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }  // "Business", "Education", "Portfolio", "Services", "Store"
    public string PreviewImageUrl { get; set; }
    public bool IsPublic { get; set; }
    public bool IsPremium { get; set; }
    public string TemplateData { get; set; }  // JSON structure
    public int UsageCount { get; set; }  // Tracking popularity
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public Tenant? Tenant { get; set; }
}
```

**API Endpoints:**
```
GET    /api/v1/templates                    — قائمة القوالب (مع فلترة وبحث)
GET    /api/v1/templates/{id}               — تفاصيل قالب
POST   /api/v1/templates                    — إنشاء قالب (SuperAdmin only)
PUT    /api/v1/templates/{id}               — تعديل قالب (SuperAdmin only)
DELETE /api/v1/templates/{id}               — حذف قالب (SuperAdmin only)
POST   /api/v1/sites/apply-template/{id}   — تطبيق قالب على الموقع
POST   /api/v1/templates/{id}/favorite      — إضافة/إزالة من المفضلة
```

**Services:**
- `ITemplateService` + `TemplateService`
- `ITemplateRepository` + `TemplateRepository`
- Template validation logic
- Template JSON schema validation

### 2. **Frontend (React 19 + TypeScript)**

**Pages:**
- `/templates` — Template Gallery (شبكة القوالب مع Filters + Search)
- `/templates/{id}` — Template Details (صفحة تفاصيل مع Preview)

**Components:**
```
components/
  templates/
    TemplateCard.tsx         — بطاقة القالب (صورة + اسم + Category + Badge)
    TemplateGrid.tsx         — شبكة العرض
    TemplateFilters.tsx      — فلاتر (Category, Type, Premium/Free)
    TemplateSearch.tsx       — بحث نصي
    TemplatePreview.tsx      — معاينة حية (Desktop/Tablet/Mobile)
    TemplateDetailsModal.tsx — Modal تفاصيل القالب
    ApplyTemplateButton.tsx  — زر "تطبيق القالب"
```

**State Management (Zustand):**
```typescript
interface TemplateStore {
  templates: Template[];
  selectedTemplate: Template | null;
  filters: {
    category?: string;
    isPremium?: boolean;
    search?: string;
  };
  fetchTemplates: () => Promise<void>;
  applyTemplate: (templateId: string) => Promise<void>;
  toggleFavorite: (templateId: string) => Promise<void>;
}
```

### 3. **Business Rules**

- ❗ القوالب العامة (Global): `TenantId = null` ويمكن لجميع المستأجرين رؤيتها
- ❗ القوالب الخاصة: `TenantId != null` ويراها المستأجر صاحبها فقط
- ❗ تطبيق قالب يقوم بنسخ الـ `TemplateData` (JSON) إلى جدول `Sites` للمستأجر
- ❗ يجب التأكد من صحة الـ JSON قبل الحفظ
- ❗ القوالب الـ Premium تتطلب اشتراك "Pro" أو أعلى
- ❗ عند تطبيق قالب: إنشاء نسخة جديدة وليس override على البيانات الموجودة (إلا إذا كان الموقع فارغ)
- ❗ UsageCount يزيد بـ +1 عند كل تطبيق ناجح

---

## التوقعات:

### ✅ **Phase 7.1: Database & Entities (Backend)** — COMPLETED ✅
- [x] إنشاء entity `Template` في `SiteCraft.Domain/Entities/`
- [x] إضافة `DbSet<Template>` في `SiteCraftDbContext`
- [x] إنشاء EF Core Configuration (`TemplateConfiguration.cs`)
- [x] إنشاء Migration: `Add-Migration AddTemplateEntity`
- [x] تطبيق Migration: `Update-Database`

### ✅ **Phase 7.2: Repository & Service Layer (Backend)** — COMPLETED ✅
- [x] إنشاء `ITemplateRepository` + `TemplateRepository`
- [x] إنشاء `ITemplateService` + `TemplateService`
- [x] تسجيل الخدمات في DI Container (`Program.cs`)
- [x] إضافة DTOs في `SiteCraft.Application/DTOs/Templates/`
  - `TemplateDto`
  - `CreateTemplateRequest`
  - `UpdateTemplateRequest`
  - `TemplateFilterRequest`

### ✅ **Phase 7.3: API Endpoints (Backend)** — COMPLETED ✅
- [x] إنشاء `TemplatesController` في `SiteCraft.API/Controllers/`
- [x] تطبيق الـ endpoints المطلوبة (GET, POST, PUT, DELETE)
- [x] إضافة Authorization Policies:
  - القوالب العامة: أي مستخدم مسجل
  - إنشاء/تعديل/حذف: Owner/Admin only
- [x] Validation باستخدام FluentValidation
- [x] Error Handling + Logging (Serilog)
- [x] إنشاء CreateTemplateRequestValidator
- [x] إنشاء UpdateTemplateRequestValidator

### ✅ **Phase 7.4: Seed Data (Backend)** ✅ COMPLETED
- [x] إنشاء 5 قوالب افتراضية:
  1. **Academic Excellence** (Education - Free) — للمدارس والدورات ✅
  2. **Professional Services** (Services - Free) — للشركات الخدمية ✅
  3. **E-Commerce Starter** (Store - Premium) — متجر إلكتروني ✅
  4. **Creative Showcase** (Portfolio - Free) — معرض أعمال ✅
  5. **Personal Coach Pro** (Services - Premium) — للمدربين والاستشاريين ✅
- [x] إضافة Seeder في `Program.cs` مع Extension Method ✅
- [x] تحميل صور Preview من Unsplash (HD Images) ✅
- [x] JSON structures واقعية مع Hero, Features, Testimonials, Contact, Footer ✅
- **الملفات المضافة:**
  - `backend/src/SiteCraft.Infrastructure/Data/Extensions/TemplateSeeder.cs`
  - تحديث `backend/src/SiteCraft.API/Program.cs`

---

### 🎯 **Phase 7.5: Frontend Complete** (التالي - @Phase7_5_Frontend_Complete.md)
**الهدف:** بناء واجهة Template Gallery كاملة في Frontend

**المهام:**
- [ ] **Step 1:** Types & Interfaces (`template.types.ts`)
- [ ] **Step 2:** API Service Layer (`template.service.ts`)
- [ ] **Step 3:** State Management (`useTemplateStore.ts` - Zustand)
- [ ] **Step 4:** UI Components:
  - [ ] `TemplateCard.tsx` (Glassmorphism + Premium Badge)
  - [ ] `TemplateFilters.tsx` (Category, Search, Type filters)
  - [ ] `TemplateGrid.tsx` (Responsive grid + Empty states)
- [ ] **Step 5:** Main Page (`TemplatesPage.tsx`)
- [ ] **Step 6:** Routing (إضافة `/templates` route)
- [ ] **Step 7:** Integration Testing (Backend + Frontend)
- [ ] **Step 8:** Final Touches (Tailwind colors, env vars)

**ملف التفاصيل الكامل:** @Phase7_5_Frontend_Complete.md

---

### 🔮 **Phase 7.6: Template Details Page** (Future)
- [ ] صفحة `/templates/{id}` لعرض تفاصيل القالب
- [ ] Preview كبير مع Device Switcher
- [ ] "Apply Template" functionality
- [ ] Confirmation Dialog

### 🔮 **Phase 7.7: Apply Template** (Future)
- [ ] تطبيق Template على Site
- [ ] Success/Error notifications
- [ ] Redirect to Site Editor

### 🔮 **Phase 7.8: Testing & Optimization** (Future)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Final documentation update

---

## القواعد:

### 🏗️ **Architecture Rules**
- ✅ اتبع Clean Architecture (Entities → Repos → Services → Controllers)
- ✅ `Template` entity في `SiteCraft.Domain`
- ✅ Repository في `SiteCraft.Infrastructure`
- ✅ Service في `SiteCraft.Application`
- ✅ Controller في `SiteCraft.API`

### 🛡️ **Security Rules**
- ✅ Tenant Isolation: القوالب الخاصة محمية بـ `TenantId`
- ✅ Authorization: CRUD للـ SuperAdmin فقط
- ✅ Apply Template: للمستخدم المصادق فقط
- ✅ Validate TemplateData JSON قبل الحفظ لتفادي Injection

### 🎨 **UI/UX Rules**
- ✅ التزم بـ "Digital Luxury" Theme (Dark background `#111111`, Gold `#F6C453`)
- ✅ استخدم Glassmorphism على الـ Cards
- ✅ استخدم Skeleton Loaders أثناء التحميل
- ✅ استخدم Lucide Icons
- ✅ Responsive Design (Mobile-first)

### 🧪 **Testing & Quality**
- ✅ Error Handling شامل (Try-Catch + Logging)
- ✅ Validation باستخدام FluentValidation (Backend)
- ✅ Validation باستخدام Zod (Frontend)
- ✅ Unit tests للـ TemplateService
- ✅ استخدم Serilog لجميع العمليات المهمة

### 📊 **Logging & Monitoring**
- ✅ Log كل عملية Create/Update/Delete للقوالب
- ✅ Log كل عملية Apply Template
- ✅ Track UsageCount لكل قالب

---

## ملاحظات إضافية:

1. **Template JSON Structure Example:**
```json
{
  "version": "1.0",
  "pages": [
    {
      "slug": "home",
      "title": "Home",
      "sections": [
        {
          "type": "hero",
          "props": {
            "title": "Welcome to SiteCraft",
            "subtitle": "Build your dream site",
            "backgroundImage": "https://..."
          }
        }
      ]
    }
  ],
  "theme": {
    "primaryColor": "#F6C453",
    "secondaryColor": "#111111",
    "fontFamily": "Inter"
  }
}
```

2. **5 Default Templates Categories:**
   - **Educational**: Hero + Courses Grid + Testimonials + Footer
   - **Services**: Hero + Services Cards + About + Contact Form
   - **Store Lite**: Hero + Products Grid + Cart + Checkout
   - **Portfolio**: Hero + Projects Grid + About Me + Contact
   - **Coach**: Hero + Programs + Testimonials + Booking Form

3. **Premium vs Free Logic:**
   - Free templates: متاحة لجميع المستأجرين
   - Premium templates: تتطلب `SubscriptionPlanId >= Pro`
   - عند تطبيق Premium template من Free Tenant → عرض Upgrade modal

4. **Apply Template Behavior:**
   - إذا الموقع فارغ (firstTime = true): نسخ مباشرة
   - إذا الموقع موجود: عرض Confirmation dialog ("سيتم استبدال المحتوى الحالي")

---

## الأدوات المطلوبة:

### Backend:
- EF Core (Migrations)
- FluentValidation
- AutoMapper (للـ DTOs)
- Serilog

### Frontend:
- React Query (للـ caching)
- Zustand (للـ state)
- Zod (للـ validation)
- Tailwind CSS

---

**بالتوفيق! 🚀**

