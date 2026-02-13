# SiteCraft — Feature Reference (المرجع الشامل للميزات)

> هذا الملف هو **المرجع الوحيد والنهائي** لجميع ميزات مشروع SiteCraft.
> كل ميزة موثقة مع: الوصف، المكونات، الأولوية، والحالة.
> 
> **آخر تحديث:** فبراير 10, 2026

---

## فهرس سريع

| # | الموديول | عدد الميزات | الأولوية |
|---|---------|------------|---------|
| F01 | [Multi-Tenancy](#f01-multi-tenancy-نظام-تعدد-المستأجرين) | 10 | 🔴 حرج |
| F02 | [Authentication & Authorization](#f02-authentication--authorization-المصادقة-والصلاحيات) | 14 | 🔴 حرج |
| F03 | [Template Engine](#f03-template-engine-محرك-القوالب) | 12 | 🟠 أساسي |
| F04 | [Site Builder (Page Builder)](#f04-site-builder-منشئ-الصفحات) | 15 | 🟠 أساسي |
| F05 | [Site Customization & Branding](#f05-site-customization--branding-تخصيص-الموقع) | 8 | 🟠 أساسي |
| F06 | [Courses Module](#f06-courses-module-نظام-الدورات) | 13 | 🟡 مهم |
| F07 | [Blog Module](#f07-blog-module-نظام-المدونة) | 9 | 🟡 مهم |
| F08 | [Store Module (Store Lite)](#f08-store-module-المتجر-البسيط) | 7 | 🟡 مهم |
| F09 | [Booking Module](#f09-booking-module-نظام-الحجوزات) | 7 | 🟡 مهم |
| F10 | [Orders & Payments](#f10-orders--payments-الطلبات-والمدفوعات) | 10 | 🔴 حرج |
| F11 | [Billing & Subscriptions](#f11-billing--subscriptions-الفوترة-والاشتراكات) | 14 | 🔴 حرج |
| F12 | [Domain Management](#f12-domain-management-إدارة-النطاقات) | 8 | 🟠 أساسي |
| F13 | [User Management](#f13-user-management-إدارة-المستخدمين) | 8 | 🟠 أساسي |
| F14 | [Analytics & Dashboard](#f14-analytics--dashboard-التحليلات-ولوحة-التحكم) | 14 | 🟡 مهم |
| F15 | [Super Admin Panel](#f15-super-admin-panel-لوحة-المدير-العام) | 10 | 🔴 حرج |
| F16 | [Settings System](#f16-settings-system-نظام-الإعدادات) | 8 | 🟡 مهم |
| F17 | [File Storage & Media](#f17-file-storage--media-التخزين-والوسائط) | 6 | 🟠 أساسي |
| F18 | [Module Activation System](#f18-module-activation-system-نظام-تفعيل-الموديولات) | 5 | 🟠 أساسي |
| F19 | [AI Features](#f19-ai-features-ميزات-الذكاء-الاصطناعي) | 5 | 🟢 مستقبلي |
| F20 | [Marketing Website](#f20-marketing-website-الموقع-التسويقي) | 6 | 🟡 مهم |
| F21 | [Notifications & Email](#f21-notifications--email-الإشعارات-والبريد) | 6 | 🟡 مهم |
| F22 | [Background Jobs](#f22-background-jobs-المهام-الخلفية) | 5 | 🟠 أساسي |
| **المجموع** | | **~200** | |

---

## مفتاح الرموز

**الأولوية:**
- 🔴 **حرج (Critical)** — بدونه المشروع لا يعمل
- 🟠 **أساسي (Core)** — ميزة أساسية في الـ MVP
- 🟡 **مهم (Important)** — Phase 2-3، يضيف قيمة كبيرة
- 🟢 **مستقبلي (Future)** — Nice-to-have بعد الإطلاق

**حالة التنفيذ:**
- ⬜ لم يبدأ
- 🔲 قيد التخطيط
- 🔳 قيد التنفيذ
- ✅ مكتمل

**مسؤولية البناء (حسب Feature Criticality Matrix):**
- 🤖 AI — يمكن بناؤه بالكامل بالـ AI
- 👀 AI+Review — AI يبني + مراجعة بشرية
- ✏️ AI Draft — AI يكتب مسودة + إنسان يحسّن
- 👤 Human-Led — الإنسان يقود، AI يساعد فقط

---

## F01: Multi-Tenancy (نظام تعدد المستأجرين)

> **الوصف:** البنية التحتية لعزل بيانات كل مستأجر (Tenant) وضمان أمان البيانات بين المستأجرين.
> **الأولوية:** 🔴 حرج | **المرحلة:** Phase 6

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F01.1 | **Shared DB + Row-Level Isolation** | قاعدة بيانات مشتركة مع عمود `TenantId` على كل جدول tenant-scoped | ✅ | — | ✅ | 👤 Human | ⬜ |
| F01.2 | **Global Query Filters** | فلتر تلقائي في EF Core يضيف `WHERE TenantId = X` على كل استعلام | ✅ | — | — | 👤 Human | ⬜ |
| F01.3 | **Tenant Resolution Middleware** | استخراج الـ Tenant من الـ subdomain أو header `X-Tenant` | ✅ | — | — | 👤 Human | ⬜ |
| F01.4 | **Subdomain Routing** | كل مستأجر له subdomain خاص (مثل `acme.sitecraft.com`) | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F01.5 | **Custom Domain Mapping** | ربط دومين خاص بالمستأجر (مثل `my-brand.com` → Tenant) | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F01.6 | **Tenant Lifecycle** | دورة حياة: Pending → Active → Suspended → Cancelled | ✅ | — | ✅ | 👀 AI+Review | ⬜ |
| F01.7 | **Tenant Creation** | إنشاء مستأجر جديد عند أول تسجيل (auto-provision) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F01.8 | **Tenant Suspension** | تعليق/إعادة تفعيل المستأجر من SuperAdmin | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F01.9 | **Resource Quotas** | حدود لكل خطة (عدد صفحات، مستخدمين، تخزين) مع تنبيه عند 80% | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F01.10 | **Redis Tenant Cache** | تخزين بيانات المستأجر في Redis لتسريع الـ Resolution | ✅ | — | — | 🤖 AI | ⬜ |

**API Endpoints:**
```
POST   /api/v1/tenants              — إنشاء مستأجر
GET    /api/v1/tenants              — قائمة المستأجرين (SuperAdmin)
GET    /api/v1/tenants/{id}         — تفاصيل مستأجر
PUT    /api/v1/tenants/{id}         — تعديل مستأجر
DELETE /api/v1/tenants/{id}         — حذف مستأجر
POST   /api/v1/tenants/{id}/suspend — تعليق مستأجر
POST   /api/v1/tenants/{id}/activate — تفعيل مستأجر
```

**Database Entities:**
- `Tenant` (Global): Id, Name, Subdomain, SubscriptionPlanId, IsActive, SubscriptionExpiresAt, CreatedAt, UpdatedAt

**Business Rules:**
- ❗ كل جدول tenant-scoped يجب أن يحتوي على `TenantId`
- ❗ لا يمكن لأي استعلام تجاوز فلتر الـ TenantId إلا SuperAdmin
- ❗ الـ Subdomain يجب أن يكون فريد عالمياً
- ❗ عند حذف tenant: بيانات محتفظ بها 30 يوم ثم تُحذف نهائياً

---

## F02: Authentication & Authorization (المصادقة والصلاحيات)

> **الوصف:** نظام تسجيل دخول/خروج آمن مع JWT وصلاحيات مبنية على الأدوار.
> **الأولوية:** 🔴 حرج | **المرحلة:** Phase 6
> **User Stories:** US-001

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F02.1 | **User Registration** | تسجيل بإيميل وكلمة مرور + إنشاء tenant إذا أول مستخدم | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F02.2 | **Email Verification** | إرسال رابط تأكيد على الإيميل بعد التسجيل | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F02.3 | **Login (JWT)** | تسجيل دخول → JWT token (access + refresh) | ✅ | ✅ | — | ✏️ AI Draft | ⬜ |
| F02.4 | **Logout** | إبطال الـ token وحذفه من المتصفح | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F02.5 | **Forgot Password** | إرسال رابط إعادة تعيين كلمة المرور | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F02.6 | **Reset Password** | صفحة إعادة تعيين كلمة المرور بعد النقر على الرابط | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F02.7 | **Get Current User (/me)** | جلب بيانات المستخدم الحالي من الـ Token | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F02.8 | **Token Refresh** | تجديد الـ JWT تلقائياً عند انتهاء صلاحيته | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F02.9 | **Role-Based Access (RBAC)** | 4 أدوار: SuperAdmin, TenantAdmin, Staff, EndUser | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F02.10 | **Protected Routes** | منع الوصول للصفحات المحمية بدون JWT صالح + redirect to login | — | ✅ | — | 👀 AI+Review | ⬜ |
| F02.11 | **Password Hashing (BCrypt)** | تشفير كلمات المرور بـ BCrypt/PBKDF2 | ✅ | — | — | ✏️ AI Draft | ⬜ |
| F02.12 | **Rate Limiting (Login)** | حد 5 محاولات تسجيل دخول / دقيقة لمنع brute force | ✅ | — | — | 👀 AI+Review | ⬜ |
| F02.13 | **2FA (Two-Factor Auth)** | مصادقة ثنائية عبر TOTP — مستقبلي | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F02.14 | **OAuth2 (Google, Microsoft)** | تسجيل دخول عبر طرف ثالث — مستقبلي | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |

**API Endpoints:**
```
POST   /api/v1/auth/register        — تسجيل
POST   /api/v1/auth/login           — تسجيل دخول
POST   /api/v1/auth/refresh         — تجديد token
POST   /api/v1/auth/logout          — تسجيل خروج
POST   /api/v1/auth/forgot-password — نسيت كلمة المرور
POST   /api/v1/auth/reset-password  — إعادة تعيين كلمة المرور
GET    /api/v1/auth/verify-email    — تأكيد الإيميل
GET    /api/v1/auth/me              — بيانات المستخدم الحالي
```

**Database Entities:**
- `User` (Tenant-scoped): Id, TenantId, Email, PasswordHash, FirstName, LastName, Role, IsActive, EmailVerified, CreatedAt, UpdatedAt
- `SuperAdmin` (Global): Id, Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt
- `RefreshToken` (User-scoped): Id, UserId, Token, ExpiresAt, CreatedAt

**UI Pages:**
- `/login` — تسجيل دخول (إيميل + كلمة مرور + "نسيت كلمة المرور" + "إنشاء حساب")
- `/register` — تسجيل (إيميل + كلمة مرور + تأكيد + اسم أول/أخير + subdomain)
- `/forgot-password` — إدخال الإيميل
- `/reset-password` — إدخال كلمة مرور جديدة

**Security Rules:**
- ❗ كلمة مرور: 8+ حروف، حرف كبير، رقم واحد على الأقل
- ❗ JWT: Secret key 256-bit، مدة Access Token = 60 دقيقة، Refresh = 7 أيام
- ❗ HTTPS إجباري في Production
- ❗ CORS: فقط origins موثوقة
- ❗ لا توجد بيانات حساسة في JWT payload

---

## F03: Template Engine (محرك القوالب)

> **الوصف:** نظام قوالب جاهزة يمكن للمستأجرين اختيارها وتطبيقها على مواقعهم.
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 7
> **User Stories:** US-002

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F03.1 | **Template Gallery** | عرض شبكة قوالب مع صور معاينة | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F03.2 | **Template Filtering** | فلترة بالفئة (Business, Education, Portfolio...)، النوع، المجال | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F03.3 | **Template Search** | بحث نصي في القوالب بالاسم والوصف | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F03.4 | **Template Sorting** | ترتيب: الأكثر شعبية / الأحدث / الأكثر استخداماً | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F03.5 | **Template Preview** | معاينة حية للقالب قبل الاختيار (Desktop/Tablet/Mobile) | — | ✅ | — | 🤖 AI | ⬜ |
| F03.6 | **Apply Template** | تطبيق قالب على الموقع بنقرة واحدة | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F03.7 | **Template Details Page** | صفحة تفاصيل القالب (وصف، ميزات، tags، قوالب مشابهة) | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F03.8 | **Free / Premium Badge** | تمييز القوالب المجانية عن المدفوعة | — | ✅ | ✅ | 🤖 AI | ⬜ |
| F03.9 | **Template Favorites** | حفظ القوالب المفضلة (قلب) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F03.10 | **Template CRUD (Admin)** | SuperAdmin يدير القوالب (إنشاء/تعديل/حذف) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F03.11 | **5 Default Templates** | Educational, Services, Store Lite, Portfolio, Coach | — | — | ✅ | 🤖 AI | ⬜ |
| F03.12 | **Template Marketplace** | سوق قوالب مفتوح — مستقبلي | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |

**API Endpoints:**
```
GET    /api/v1/templates              — قائمة القوالب
GET    /api/v1/templates/{id}         — تفاصيل قالب
POST   /api/v1/site/apply-template    — تطبيق قالب على الموقع
POST   /api/v1/templates              — إنشاء قالب (SuperAdmin)
PUT    /api/v1/templates/{id}         — تعديل قالب (SuperAdmin)
DELETE /api/v1/templates/{id}         — حذف قالب (SuperAdmin)
```

**Database Entities:**
- `Template`: Id, TenantId (null = global), Name, Description, PreviewImageUrl, Category, IsPublic, TemplateData (JSON), CreatedAt, UpdatedAt

**UI Pages:**
- `/templates` — معرض القوالب (شبكة + فلاتر + بحث)
- `/templates/{id}` — تفاصيل القالب

---

## F04: Site Builder (منشئ الصفحات)

> **الوصف:** محرر مرئي بالسحب والإفلات لبناء صفحات الموقع.
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 7-8
> **User Stories:** US-011, US-012

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F04.1 | **Drag-and-Drop Canvas** | منطقة تحرير مرئية مع خطوط شبكة ومقابض تغيير الحجم | — | ✅ | — | 👀 AI+Review | ⬜ |
| F04.2 | **Elements Sidebar** | قائمة عناصر: Text, Image, Button, Video, Form, Icon | — | ✅ | — | 🤖 AI | ⬜ |
| F04.3 | **Sections Sidebar** | أقسام جاهزة: Hero, Features, Pricing, Testimonial, Footer | — | ✅ | — | 🤖 AI | ⬜ |
| F04.4 | **Properties Panel** | لوحة خصائص على اليمين: Typography, Colors, Borders, Shadows, Layout, Animations | — | ✅ | — | 🤖 AI | ⬜ |
| F04.5 | **Block Reordering** | إعادة ترتيب الكتل بالسحب والإفلات | — | ✅ | — | 🤖 AI | ⬜ |
| F04.6 | **Undo / Redo** | تراجع وإعادة (Ctrl+Z / Ctrl+Y) | — | ✅ | — | 👀 AI+Review | ⬜ |
| F04.7 | **Responsive Preview** | معاينة على Desktop / Tablet / Mobile | — | ✅ | — | 🤖 AI | ⬜ |
| F04.8 | **Publish / Preview** | نشر الصفحة أو معاينتها قبل النشر | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F04.9 | **Save Page as JSON** | حفظ هيكل الصفحة كـ JSON في قاعدة البيانات | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F04.10 | **Page CRUD** | إنشاء/تعديل/حذف صفحات | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F04.11 | **Page Slug Generation** | توليد slug فريد لكل صفحة (لكل tenant) | ✅ | — | ✅ | 👀 AI+Review | ⬜ |
| F04.12 | **SEO Metadata** | حقول meta: Title, Description, Keywords لكل صفحة | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F04.13 | **Draft / Published States** | حفظ كمسودة أو نشر مباشر | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F04.14 | **Section Visibility Toggle** | إظهار/إخفاء أقسام الصفحة | — | ✅ | ✅ | 🤖 AI | ⬜ |
| F04.15 | **Alignment Guides** | خطوط محاذاة ذكية عند السحب | — | ✅ | — | 🤖 AI | ⬜ |

**Navigation Builder (US-012):**
| ID | الميزة | الوصف | المسؤولية | الحالة |
|----|--------|-------|-----------|--------|
| F04.NAV.1 | **Create Menu** | إنشاء قائمة بإسم مخصص | 🤖 AI | ⬜ |
| F04.NAV.2 | **Add Menu Items** | إضافة روابط (صفحات، دورات، روابط خارجية) | 🤖 AI | ⬜ |
| F04.NAV.3 | **Nested Items (Dropdowns)** | عناصر متداخلة للقوائم المنسدلة | 👀 AI+Review | ⬜ |
| F04.NAV.4 | **Drag-and-Drop Reorder** | إعادة ترتيب العناصر بالسحب | 🤖 AI | ⬜ |
| F04.NAV.5 | **Assign to Location** | تعيين القائمة لمكان (Header أو Footer) | 🤖 AI | ⬜ |

**API Endpoints:**
```
GET    /api/v1/pages             — قائمة الصفحات
POST   /api/v1/pages             — إنشاء صفحة
GET    /api/v1/pages/{id}        — تفاصيل صفحة
PUT    /api/v1/pages/{id}        — تعديل صفحة
DELETE /api/v1/pages/{id}        — حذف صفحة
POST   /api/v1/pages/{id}/publish   — نشر صفحة
POST   /api/v1/pages/{id}/unpublish — إلغاء نشر
```

**Database Entities:**
- `Page` (Tenant-scoped): Id, TenantId, Title, Slug, MetaDescription, MetaKeywords, IsPublished, PublishedAt, PageData (JSON), TemplateId, CreatedAt, UpdatedAt
- `Component` (Tenant-scoped): Id, TenantId, PageId, Type, Content (JSON), Order, IsVisible, CreatedAt, UpdatedAt
- `Menu` (Site-scoped): Id, SiteId, Name, Location
- `MenuItem` (Menu-scoped): Id, MenuId, Label, Url, ParentId, Order, Target

**UI Pages:**
- `/builder/{pageId}` — محرر الصفحات (3 أعمدة: Elements | Canvas | Properties)

---

## F05: Site Customization & Branding (تخصيص الموقع)

> **الوصف:** تخصيص هوية الموقع: الشعار، الألوان، الخطوط، إعدادات الموقع العامة.
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 7
> **User Stories:** US-003, US-004

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F05.1 | **Logo Upload** | رفع شعار (PNG, JPG, SVG، حد 2MB) مع drag-and-drop | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F05.2 | **Color Picker** | اختيار لون رئيسي وثانوي | — | ✅ | ✅ | 🤖 AI | ⬜ |
| F05.3 | **Font Selector** | اختيار من 10+ مجموعات خطوط (عنوان + محتوى) | — | ✅ | ✅ | 🤖 AI | ⬜ |
| F05.4 | **Favicon Upload** | رفع أيقونة الموقع | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F05.5 | **Live Preview** | معاينة حية لتغييرات الهوية قبل الحفظ | — | ✅ | — | 🤖 AI | ⬜ |
| F05.6 | **Site Title & Tagline** | عنوان الموقع والشعار النصي | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F05.7 | **Social Media Links** | روابط Facebook, Twitter, Instagram, LinkedIn | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F05.8 | **Contact Information** | بريد، هاتف، عنوان — يظهر في Footer | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |

**API Endpoints:**
```
GET    /api/v1/site           — إعدادات الموقع
PUT    /api/v1/site           — تحديث إعدادات الموقع
PUT    /api/v1/site/branding  — تحديث الهوية البصرية
```

---

## F06: Courses Module (نظام الدورات)

> **الوصف:** نظام إدارة دورات تعليمية مع دروس وفيديوهات وتتبع تقدم الطلاب.
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 8
> **User Stories:** US-005, US-006

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F06.1 | **Course CRUD** | إنشاء/تعديل/حذف دورة (عنوان، وصف، صورة، سعر، مستوى، مدة) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F06.2 | **Course Thumbnail** | رفع صورة مصغرة للدورة | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F06.3 | **Course Pricing** | تحديد سعر وعملة (أو مجاني) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F06.4 | **Course Level** | تحديد المستوى: Beginner, Intermediate, Advanced | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F06.5 | **Course Draft/Publish** | حفظ كمسودة أو نشر | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F06.6 | **Lesson CRUD** | إنشاء/تعديل/حذف دروس داخل الدورة | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F06.7 | **Lesson Reordering** | إعادة ترتيب الدروس بالسحب والإفلات | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F06.8 | **Free Preview Lessons** | تحديد دروس مجانية للمعاينة | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F06.9 | **Video Integration** | دعم YouTube, Vimeo, وملفات مرفوعة (S3) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F06.10 | **Rich Text Editor** | محرر نصوص غني للمحتوى الدراسي | — | ✅ | — | 🤖 AI | ⬜ |
| F06.11 | **Student Enrollment** | تسجيل طالب في دورة (مجاني أو بعد الدفع) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F06.12 | **Progress Tracking** | تتبع تقدم الطالب (نسبة %, آخر درس، حالة) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F06.13 | **Course Completion** | إكمال الدورة + شهادة (مستقبلي) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |

**API Endpoints:**
```
GET    /api/v1/courses                  — قائمة الدورات
POST   /api/v1/courses                  — إنشاء دورة
GET    /api/v1/courses/{id}             — تفاصيل دورة
PUT    /api/v1/courses/{id}             — تعديل دورة
DELETE /api/v1/courses/{id}             — حذف دورة
POST   /api/v1/courses/{id}/publish     — نشر
POST   /api/v1/courses/{id}/unpublish   — إلغاء نشر
GET    /api/v1/courses/{id}/lessons     — دروس الدورة
POST   /api/v1/courses/{id}/lessons     — إضافة درس
PUT    /api/v1/lessons/{id}             — تعديل درس
DELETE /api/v1/lessons/{id}             — حذف درس
POST   /api/v1/lessons/reorder          — إعادة ترتيب
POST   /api/v1/courses/{id}/enroll      — تسجيل طالب
GET    /api/v1/enrollments              — تسجيلاتي
PUT    /api/v1/enrollments/{id}/progress — تحديث التقدم
POST   /api/v1/enrollments/{id}/complete — إكمال
```

**Database Entities:**
- `Course` (Tenant-scoped): Id, TenantId, Title, Description, ShortDescription, ThumbnailUrl, Price, Currency, Level, Duration, Status, InstructorId, CreatedAt, UpdatedAt
- `Lesson` (Course-scoped): Id, CourseId, Title, Content, VideoUrl, VideoType, Duration, Order, IsFreePreview, CreatedAt
- `Enrollment` (User+Course): Id, UserId, CourseId, Progress, Status, LastAccessedAt, CompletedAt, CreatedAt

---

## F07: Blog Module (نظام المدونة)

> **الوصف:** نظام مدونة متكامل مع مقالات، تصنيفات، وسوم، وجدولة نشر.
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 8
> **User Stories:** US-007

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F07.1 | **Blog Post CRUD** | إنشاء/تعديل/حذف مقالات (عنوان، محتوى، مقتطف) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F07.2 | **Featured Image** | صورة رئيسية للمقال | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F07.3 | **Categories** | تصنيف المقالات في فئات | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F07.4 | **Tags (SEO)** | وسوم لتحسين محركات البحث | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F07.5 | **Scheduled Publishing** | جدولة نشر مقال في وقت محدد | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F07.6 | **Preview Before Publish** | معاينة المقال قبل النشر | — | ✅ | — | 🤖 AI | ⬜ |
| F07.7 | **Author Card** | بطاقة الكاتب في نهاية المقال | — | ✅ | — | 🤖 AI | ⬜ |
| F07.8 | **Related Articles** | مقالات ذات صلة في نهاية المقال | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F07.9 | **RSS Feed** | تغذية RSS تلقائية | ✅ | — | — | 🤖 AI | ⬜ |

**API Endpoints:**
```
GET    /api/v1/blog/posts        — قائمة المقالات
POST   /api/v1/blog/posts        — إنشاء مقال
GET    /api/v1/blog/posts/{id}   — تفاصيل مقال
PUT    /api/v1/blog/posts/{id}   — تعديل مقال
DELETE /api/v1/blog/posts/{id}   — حذف مقال
GET    /api/v1/blog/categories   — قائمة التصنيفات
POST   /api/v1/blog/categories   — إنشاء تصنيف
```

**Database Entities:**
- `BlogPost` (Tenant-scoped): Id, TenantId, Title, Content, Excerpt, FeaturedImageUrl, AuthorId, CategoryId, Tags (JSON), Status, PublishedAt, ScheduledAt, CreatedAt, UpdatedAt
- `BlogCategory` (Tenant-scoped): Id, TenantId, Name, Slug, Description

---

## F08: Store Module (المتجر البسيط)

> **الوصف:** متجر بسيط لبيع المنتجات الرقمية والفيزيائية.
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 9
> **User Stories:** US-008

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F08.1 | **Product CRUD** | إنشاء/تعديل/حذف منتج (اسم، وصف، SKU) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F08.2 | **Product Pricing** | سعر وعملة | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F08.3 | **Product Images** | رفع صور متعددة للمنتج | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F08.4 | **Inventory Management** | إدارة المخزون (كمية، حالة) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F08.5 | **Product Categories** | تصنيفات للمنتجات | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F08.6 | **Product Status** | حالة: Active / Inactive | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F08.7 | **Product Filtering** | فلترة بالتصنيف والسعر والحالة | ✅ | ✅ | — | 🤖 AI | ⬜ |

**API Endpoints:**
```
GET    /api/v1/store/products        — قائمة المنتجات
POST   /api/v1/store/products        — إنشاء منتج
GET    /api/v1/store/products/{id}   — تفاصيل منتج
PUT    /api/v1/store/products/{id}   — تعديل منتج
DELETE /api/v1/store/products/{id}   — حذف منتج
GET    /api/v1/store/categories      — تصنيفات المتجر
```

**Database Entities:**
- `Product` (Tenant-scoped): Id, TenantId, Name, Description, SKU, Price, Currency, Stock, CategoryId, Status, Images (JSON), CreatedAt, UpdatedAt
- `ProductCategory` (Tenant-scoped): Id, TenantId, Name, Slug

---

## F09: Booking Module (نظام الحجوزات)

> **الوصف:** نظام حجز مواعيد مع slots زمنية وتأكيدات.
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 9
> **User Stories:** US-009

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F09.1 | **Booking Slot CRUD** | إنشاء/تعديل/حذف slot (عنوان، وصف، وقت، سعة) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F09.2 | **Slot Pricing** | تحديد سعر لكل slot | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F09.3 | **Recurring Slots** | تكرار يومي/أسبوعي | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F09.4 | **Block Dates** | حجب تواريخ محددة | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F09.5 | **Capacity Management** | عدد الأماكن المتاحة لكل slot | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F09.6 | **Booking Creation** | حجز مكان من قبل المستخدم النهائي | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F09.7 | **Booking Confirmation Email** | إرسال تأكيد بالبريد الإلكتروني | ✅ | — | — | 🤖 AI | ⬜ |

**API Endpoints:**
```
GET    /api/v1/bookings/slots        — قائمة الـ slots
POST   /api/v1/bookings/slots        — إنشاء slot
GET    /api/v1/bookings/slots/{id}   — تفاصيل slot
PUT    /api/v1/bookings/slots/{id}   — تعديل slot
DELETE /api/v1/bookings/slots/{id}   — حذف slot
POST   /api/v1/bookings              — إنشاء حجز
GET    /api/v1/bookings              — قائمة الحجوزات
```

**Database Entities:**
- `BookingSlot` (Tenant-scoped): Id, TenantId, Title, Description, StartTime, EndTime, Price, Capacity, IsRecurring, RecurringPattern, CreatedAt
- `Booking` (Tenant-scoped): Id, TenantId, SlotId, UserId, Status, CreatedAt

---

## F10: Orders & Payments (الطلبات والمدفوعات)

> **الوصف:** نظام معالجة الطلبات والمدفوعات للدورات والمنتجات والحجوزات.
> **الأولوية:** 🔴 حرج | **المرحلة:** Phase 9
> **User Stories:** US-010

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F10.1 | **Order Creation** | إنشاء طلب (دورة، منتج، حجز) | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F10.2 | **Order Lifecycle** | Pending → Paid → Completed / Cancelled / Refunded | ✅ | — | ✅ | ✏️ AI Draft | ⬜ |
| F10.3 | **Stripe Integration** | معالجة المدفوعات عبر Stripe | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F10.4 | **PayPal Integration** | بديل للدفع عبر PayPal — مستقبلي | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F10.5 | **Payment Form (PCI)** | نموذج دفع آمن (Stripe Elements) | — | ✅ | — | 👤 Human | ⬜ |
| F10.6 | **Payment Webhooks** | استقبال الإشعارات من Stripe (نجاح/فشل) | ✅ | — | ✅ | 👤 Human | ⬜ |
| F10.7 | **Order Confirmation Email** | إرسال تأكيد الطلب بالبريد | ✅ | — | — | 🤖 AI | ⬜ |
| F10.8 | **Payment Receipt** | إيصال الدفع (PDF) | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F10.9 | **Refund Capability** | إمكانية الاسترداد من قبل Admin | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F10.10 | **Auto Access Grant** | منح الوصول تلقائياً بعد الدفع (تسجيل في دورة، إلخ) | ✅ | — | ✅ | ✏️ AI Draft | ⬜ |

**API Endpoints:**
```
POST   /api/v1/orders                — إنشاء طلب
GET    /api/v1/orders                — قائمة الطلبات
GET    /api/v1/orders/{id}           — تفاصيل طلب
POST   /api/v1/orders/{id}/cancel    — إلغاء طلب
POST   /api/v1/payments/process      — معالجة الدفع
POST   /api/v1/payments/webhook      — Webhook (Stripe/PayPal)
GET    /api/v1/payments/{id}         — تفاصيل الدفع
POST   /api/v1/payments/{id}/refund  — استرداد
```

**Database Entities:**
- `Order` (Tenant-scoped): Id, TenantId, UserId, OrderNumber, SubTotal, Tax, Total, Status, CreatedAt
- `OrderItem` (Order-scoped): Id, OrderId, ItemType, ItemId, Quantity, UnitPrice, Total
- `Payment` (Order-scoped): Id, OrderId, StripePaymentId, Amount, Currency, Status, Method, CreatedAt

**Business Rules:**
- ❗ لا استرداد بعد إكمال 50% من الدورة (إلا بتدخل Admin)
- ❗ فترة سماح 7 أيام لفشل الدفع قبل التعليق
- ❗ محاولة إعادة الدفع تلقائياً 3 مرات

---

## F11: Billing & Subscriptions (الفوترة والاشتراكات)

> **الوصف:** نظام اشتراكات المستأجرين مع خطط مختلفة وتتبع الاستخدام.
> **الأولوية:** 🔴 حرج | **المرحلة:** Phase 9-10

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F11.1 | **Subscription Plans** | 5 خطط: Free ($0), Starter ($9), Pro ($19), Business ($39), Enterprise ($99) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F11.2 | **Plan Comparison** | جدول مقارنة الخطط | — | ✅ | — | 🤖 AI | ⬜ |
| F11.3 | **Monthly/Yearly Toggle** | التبديل بين شهري وسنوي (خصم للسنوي) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F11.4 | **Subscribe to Plan** | اشتراك في خطة عبر Stripe | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F11.5 | **Upgrade/Downgrade** | ترقية أو تنزيل الخطة | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F11.6 | **14-Day Free Trial** | فترة تجريبية مجانية 14 يوم | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F11.7 | **Subscription Lifecycle** | Trial → Active → Expired → Cancelled → Renewed | ✅ | — | ✅ | ✏️ AI Draft | ⬜ |
| F11.8 | **7-Day Grace Period** | فترة سماح 7 أيام عند انتهاء الاشتراك | ✅ | — | ✅ | 👀 AI+Review | ⬜ |
| F11.9 | **Auto-Renewal** | تجديد تلقائي مع خيار الإلغاء | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F11.10 | **Current Plan Display** | عرض الخطة الحالية مع الاستخدام | — | ✅ | — | 🤖 AI | ⬜ |
| F11.11 | **Payment Methods** | إدارة بطاقات الدفع | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F11.12 | **Invoice History** | قائمة الفواتير السابقة | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F11.13 | **Download Invoice** | تحميل فاتورة PDF | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F11.14 | **Usage Tracking** | تتبع استخدام الموارد (صفحات، تخزين، مستخدمين) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |

**API Endpoints:**
```
GET    /api/v1/billing/plans           — الخطط المتاحة
POST   /api/v1/billing/subscribe       — اشتراك
PUT    /api/v1/billing/upgrade         — ترقية
PUT    /api/v1/billing/downgrade       — تنزيل
POST   /api/v1/billing/cancel          — إلغاء
GET    /api/v1/billing/invoices        — الفواتير
GET    /api/v1/billing/usage           — الاستخدام
```

**Database Entities:**
- `SubscriptionPlan` (Global): Id, Name, Price, Currency, MaxPages, MaxUsers, MaxStorage, Features (JSON), IsActive
- `Subscription` (Tenant-scoped): Id, TenantId, SubscriptionPlanId, Status, StartDate, EndDate, StripeSubscriptionId, CreatedAt, UpdatedAt

---

## F12: Domain Management (إدارة النطاقات)

> **الوصف:** إدارة النطاقات المخصصة لكل مستأجر مع DNS و SSL.
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 10

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F12.1 | **Subdomain Auto-Assignment** | كل مستأجر يحصل على subdomain تلقائي (e.g., `acme.sitecraft.com`) | ✅ | — | ✅ | 👀 AI+Review | ⬜ |
| F12.2 | **Custom Domain Input** | إدخال نطاق مخصص (e.g., `my-brand.com`) | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F12.3 | **DNS Instructions** | عرض تعليمات DNS (A Record, CNAME) للمستخدم | — | ✅ | — | 🤖 AI | ⬜ |
| F12.4 | **Domain Verification** | التحقق من إعدادات DNS (Active / Verifying / Error) | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F12.5 | **SSL Certificate** | شهادة SSL تلقائية عبر Let's Encrypt | ✅ | — | ✅ | 👤 Human | ⬜ |
| F12.6 | **Primary Domain Flag** | تحديد نطاق رئيسي واحد لكل مستأجر | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F12.7 | **Connected Domains List** | جدول بجميع النطاقات المربوطة | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F12.8 | **Domain Deletion** | حذف نطاق مع نافذة تأكيد | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |

**Database Entities:**
- `Domain` (Tenant-scoped): Id, TenantId, DomainName, IsPrimary, IsVerified, SslEnabled, CreatedAt

---

## F13: User Management (إدارة المستخدمين)

> **الوصف:** إدارة مستخدمي المستأجر مع الأدوار والصلاحيات.
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 8

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F13.1 | **Users Table** | جدول المستخدمين (صورة، اسم، إيميل، دور، حالة) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F13.2 | **Search & Filter** | بحث بالاسم/إيميل + فلتر بالدور والحالة | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F13.3 | **Add User** | إضافة مستخدم جديد للمستأجر (دعوة بالإيميل) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F13.4 | **Edit User** | تعديل بيانات المستخدم (slide-over panel) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F13.5 | **Role Assignment** | تغيير دور المستخدم (Admin, Editor, User) + حماية من escalation | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F13.6 | **User Status** | تغيير الحالة: Active / Pending / Suspended | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F13.7 | **Delete User** | حذف مستخدم مع إعادة تعيين محتواه للمالك | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F13.8 | **Activity Logs** | سجل أنشطة المستخدم (audit trail) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |

**API Endpoints:**
```
GET    /api/v1/users             — قائمة مستخدمي المستأجر
POST   /api/v1/users             — إضافة مستخدم
GET    /api/v1/users/{id}        — تفاصيل مستخدم
PUT    /api/v1/users/{id}        — تعديل مستخدم
DELETE /api/v1/users/{id}        — حذف مستخدم
PUT    /api/v1/users/{id}/role   — تغيير دور
```

**Business Rules:**
- ❗ عند حذف مدرّس → دوراته تُنقل لمالك المستأجر
- ❗ لا يمكن لمستخدم ترقية نفسه
- ❗ عدد المستخدمين محدود حسب الخطة

---

## F14: Analytics & Dashboard (التحليلات ولوحة التحكم)

> **الوصف:** لوحة تحكم مع تحليلات الأداء والزيارات والإيرادات.
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 10
> **User Stories:** US-013

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F14.1 | **Stat Cards** | بطاقات: إجمالي الزوار، التسجيلات، الطلبات، الإيرادات | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F14.2 | **Visitors Chart** | مخطط خطي للزوار (7 أيام / 30 يوم / كل الوقت) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F14.3 | **Revenue Chart** | مخطط أعمدة للإيرادات | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F14.4 | **Top Courses/Products** | أعلى المحتويات أداءً | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F14.5 | **Traffic Sources** | مخطط دائري لمصادر الزيارات | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F14.6 | **Site Health Score** | نقاط صحة الموقع (SEO, Performance, Security) | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F14.7 | **Quick Actions** | أزرار سريعة: إنشاء دورة، منشور جديد، إضافة منتج | — | ✅ | — | 🤖 AI | ⬜ |
| F14.8 | **Recent Activity Feed** | آخر الأحداث (تسجيلات، طلبات، تعليقات) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F14.9 | **Page View Tracking** | تتبع مشاهدات الصفحات | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F14.10 | **Export CSV** | تصدير البيانات كـ CSV | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F14.11 | **Export PDF** | تصدير تقرير PDF | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F14.12 | **Scheduled Reports** | تقارير دورية (أسبوعية/شهرية/ربع سنوية) بالبريد | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F14.13 | **KPI Metrics** | MRR, ARR, ARPU, LTV, CAC, Churn Rate | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F14.14 | **Real-Time (WebSockets)** | تحليلات فورية — مستقبلي | ✅ | ✅ | — | 👀 AI+Review | ⬜ |

**API Endpoints:**
```
GET    /api/v1/analytics/dashboard  — لوحة التحكم
GET    /api/v1/analytics/visitors   — بيانات الزوار
GET    /api/v1/analytics/revenue    — بيانات الإيرادات
GET    /api/v1/analytics/courses    — أداء الدورات
GET    /api/v1/analytics/export     — تصدير البيانات
```

**UI Pages:**
- `/dashboard` — لوحة التحكم الرئيسية

---

## F15: Super Admin Panel (لوحة المدير العام)

> **الوصف:** لوحة تحكم لإدارة المنصة بالكامل (المستأجرين، الخطط، القوالب، النظام).
> **الأولوية:** 🔴 حرج | **المرحلة:** Phase 8-10

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F15.1 | **Tenant List** | قائمة كل المستأجرين قابلة للبحث والفلترة | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F15.2 | **Tenant Details** | تفاصيل مستأجر + استخدامه + حالته | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F15.3 | **Suspend/Activate Tenant** | تعليق أو تفعيل مستأجر | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F15.4 | **Delete Tenant** | حذف مستأجر مع تأكيد | ✅ | ✅ | ✅ | 👤 Human | ⬜ |
| F15.5 | **Platform Stats** | إجمالي المستأجرين، MRR، اشتراكات جديدة، معدل المغادرة | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F15.6 | **Revenue by Plan** | إيرادات حسب الخطة | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F15.7 | **Tenant Growth Chart** | مخطط نمو المستأجرين (12 شهر) | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F15.8 | **Module Adoption** | معدل تفعيل كل موديول | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F15.9 | **System Health** | مقاييس صحة النظام (CPU, Memory, DB, Response time) | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F15.10 | **Template Management** | إدارة القوالب العامة (إنشاء/تعديل/حذف) | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |

**UI Pages:**
- `/admin/dashboard` — لوحة تحكم المدير العام
- `/admin/tenants` — إدارة المستأجرين
- `/admin/templates` — إدارة القوالب
- `/admin/plans` — إدارة الخطط

---

## F16: Settings System (نظام الإعدادات)

> **الوصف:** إعدادات المستأجر: عامة، هوية، نطاقات، موديولات، أمان، إشعارات.
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 8

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F16.1 | **General Settings** | اسم الموقع، الوصف، اللغة، المنطقة الزمنية | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F16.2 | **Branding Tab** | الشعار، الألوان، الخطوط مع معاينة | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F16.3 | **Domains Tab** | Subdomain + إضافة دومين مخصص + تعليمات DNS | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F16.4 | **Modules Tab** | بطاقات الموديولات مع Toggle تفعيل/تعطيل | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F16.5 | **Billing Tab** | الخطة الحالية + سجل الفواتير | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F16.6 | **Security Tab** | تغيير كلمة المرور + 2FA + جلسات نشطة | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F16.7 | **Notifications Tab** | إعدادات الإشعارات (بريد/SMS) مع checkboxes | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F16.8 | **API Keys** | إدارة مفاتيح API | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |

**Database Entities:**
- `Settings` (Tenant-scoped): Id, TenantId, Key, Value, UpdatedAt — تخزين key-value مرن

**UI Pages:**
- `/settings` — صفحة الإعدادات (7 tabs)

---

## F17: File Storage & Media (التخزين والوسائط)

> **الوصف:** رفع وإدارة الملفات (صور، فيديو، مستندات) في السحابة.
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 7

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F17.1 | **File Upload API** | رفع ملفات إلى S3/Azure Blob | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F17.2 | **Tenant-Scoped Paths** | كل مستأجر له مسار منفصل (`sitecraft/{tenantId}/media/`) | ✅ | — | — | 👀 AI+Review | ⬜ |
| F17.3 | **Image Optimization** | تحسين حجم الصور تلقائياً عند الرفع | ✅ | — | — | 👀 AI+Review | ⬜ |
| F17.4 | **File Type Validation** | السماح فقط بأنواع معينة (png, jpg, svg, pdf, mp4) | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F17.5 | **Storage Usage Tracking** | تتبع استخدام التخزين لكل مستأجر | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F17.6 | **CDN Delivery** | تقديم الملفات عبر Cloudflare CDN — مستقبلي | — | — | — | ✏️ AI Draft | ⬜ |

**Database Entities:**
- `MediaFile` (Tenant-scoped): Id, TenantId, FileName, FileUrl, FileSize, MimeType, UploadedBy, CreatedAt

---

## F18: Module Activation System (نظام تفعيل الموديولات)

> **الوصف:** نظام موديولات قابلة للتفعيل/التعطيل لكل مستأجر حسب خطته.
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 8

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F18.1 | **List Available Modules** | عرض كل الموديولات المتاحة (Courses, Blog, Store, Booking) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F18.2 | **Activate/Deactivate** | تفعيل أو تعطيل موديول لمستأجر معين | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F18.3 | **Module Settings** | إعدادات خاصة بكل موديول لكل مستأجر | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |
| F18.4 | **Plan-Based Limits** | الموديولات المتاحة تعتمد على الخطة | ✅ | ✅ | ✅ | ✏️ AI Draft | ⬜ |
| F18.5 | **Module Toggle Cards** | واجهة بطاقات مع زر Toggle | — | ✅ | — | 🤖 AI | ⬜ |

**API Endpoints:**
```
GET    /api/v1/modules                   — كل الموديولات
GET    /api/v1/modules/active            — الموديولات المفعّلة
POST   /api/v1/modules/{id}/activate     — تفعيل
POST   /api/v1/modules/{id}/deactivate   — تعطيل
PUT    /api/v1/modules/{id}/settings     — تحديث إعدادات
```

**Database Entities:**
- `Module` (Global): Id, Name, Description, Icon, IsDefault, Price
- `TenantModule` (Tenant-scoped): Id, TenantId, ModuleId, IsActive, Settings (JSON), ActivatedAt

---

## F19: AI Features (ميزات الذكاء الاصطناعي)

> **الوصف:** ميزات ذكاء اصطناعي لمساعدة المستأجرين في إنشاء المحتوى.
> **الأولوية:** 🟢 مستقبلي | **المرحلة:** Phase 11+

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F19.1 | **OpenAI API Integration** | ربط مع GPT-4 API | ✅ | — | — | ✏️ AI Draft | ⬜ |
| F19.2 | **AI Text Generation** | توليد نصوص للصفحات والمقالات والدورات | ✅ | ✅ | — | 👀 AI+Review | ⬜ |
| F19.3 | **AI SEO Suggestions** | اقتراحات SEO تلقائية (عناوين، أوصاف، كلمات مفتاحية) | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F19.4 | **AI Image Alt Text** | توليد نص بديل للصور تلقائياً (Accessibility) | ✅ | ✅ | — | 🤖 AI | ⬜ |
| F19.5 | **AI Content Suggestions** | اقتراحات محتوى ذكية — مستقبلي | ✅ | ✅ | — | 👀 AI+Review | ⬜ |

---

## F20: Marketing Website (الموقع التسويقي)

> **الوصف:** الواجهة العامة لمنصة SiteCraft (الصفحة الرئيسية، الأسعار، المساعدة).
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 10

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F20.1 | **Landing Page** | Hero, Features, How it works, Templates, Pricing, Testimonials, FAQ | — | ✅ | — | 🤖 AI | ⬜ |
| F20.2 | **Pricing Page** | 3 خطط، مقارنة، Monthly/Yearly toggle | — | ✅ | ✅ | 🤖 AI | ⬜ |
| F20.3 | **About / Features** | صفحات تعريفية عن المنصة | — | ✅ | — | 🤖 AI | ⬜ |
| F20.4 | **Blog (Marketing)** | مدونة المنصة (مقالات تسويقية) | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F20.5 | **Help Center** | مركز مساعدة مع بحث + تصنيفات + مقالات + دعم | ✅ | ✅ | ✅ | 🤖 AI | ⬜ |
| F20.6 | **Profile / Account** | صورة، كلمة مرور، 2FA، حسابات مربوطة، حذف الحساب | ✅ | ✅ | ✅ | 👀 AI+Review | ⬜ |

---

## F21: Notifications & Email (الإشعارات والبريد)

> **الوصف:** نظام إشعارات عبر البريد الإلكتروني والـ SMS.
> **الأولوية:** 🟡 مهم | **المرحلة:** Phase 8-9

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F21.1 | **Welcome Email** | بريد ترحيب بعد التسجيل | ✅ | — | — | 🤖 AI | ⬜ |
| F21.2 | **Email Verification** | رابط تأكيد الإيميل | ✅ | — | — | 🤖 AI | ⬜ |
| F21.3 | **Password Reset Email** | رابط إعادة تعيين كلمة المرور | ✅ | — | — | 🤖 AI | ⬜ |
| F21.4 | **Order Confirmation** | تأكيد الطلب بالبريد | ✅ | — | — | 🤖 AI | ⬜ |
| F21.5 | **Booking Confirmation** | تأكيد الحجز بالبريد | ✅ | — | — | 🤖 AI | ⬜ |
| F21.6 | **Subscription Reminder** | تذكير قبل انتهاء الاشتراك | ✅ | — | — | 👀 AI+Review | ⬜ |

**External Services:**
- SendGrid / SMTP — للبريد الإلكتروني
- Twilio — للـ SMS (مستقبلي)
- WhatsApp Business API (مستقبلي)

---

## F22: Background Jobs (المهام الخلفية)

> **الوصف:** معالجة المهام في الخلفية (إرسال بريد، إنشاء تقارير، حساب الاستخدام).
> **الأولوية:** 🟠 أساسي | **المرحلة:** Phase 7-8

| ID | الميزة | الوصف | Backend | Frontend | DB | المسؤولية | الحالة |
|----|--------|-------|---------|----------|-----|-----------|--------|
| F22.1 | **Email Queue** | إرسال الإيميلات في الخلفية (لا تبطّئ الـ API) | ✅ | — | — | 🤖 AI | ⬜ |
| F22.2 | **Template Snapshot** | توليد صور معاينة للقوالب تلقائياً | ✅ | — | ✅ | 👀 AI+Review | ⬜ |
| F22.3 | **Analytics Sync** | تجميع وحساب بيانات التحليلات يومياً | ✅ | — | ✅ | 👀 AI+Review | ⬜ |
| F22.4 | **Usage Calculation** | حساب استخدام الموارد لكل مستأجر يومياً | ✅ | — | ✅ | 👀 AI+Review | ⬜ |
| F22.5 | **Quota Alert (80%)** | تنبيه عند اقتراب المستأجر من حد الخطة (80%) | ✅ | ✅ | — | 🤖 AI | ⬜ |

**Technology:** Hangfire (ASP.NET Core)

---

## إحصائيات عامة

| الفئة | العدد |
|-------|------|
| **إجمالي الميزات (Features)** | ~200 |
| **إجمالي الـ API Endpoints** | 70+ |
| **إجمالي الـ Database Entities** | 28 |
| **صفحات الواجهة (UI Pages)** | 20+ |
| **أدوار المستخدمين** | 4 (SuperAdmin, TenantAdmin, Staff, EndUser) |
| **خدمات خارجية (Integrations)** | 15+ |
| **خطط اشتراك** | 5 (Free, Starter, Pro, Business, Enterprise) |
| **موديولات قابلة للتفعيل** | 4 (Courses, Blog, Store, Booking) |

---

## مخطط تسلسل التنفيذ

```
Phase 6 ──→ F01 (Multi-Tenancy) ──→ F02 (Auth)
               ↓
Phase 7 ──→ F03 (Templates) ──→ F04 (Builder) ──→ F05 (Branding) ──→ F17 (Storage)
               ↓
Phase 8 ──→ F06 (Courses) ──→ F07 (Blog) ──→ F13 (Users) ──→ F18 (Modules) ──→ F16 (Settings)
               ↓
Phase 9 ──→ F08 (Store) ──→ F09 (Booking) ──→ F10 (Payments) ──→ F11 (Billing) ──→ F21 (Email)
               ↓
Phase 10 ──→ F12 (Domains) ──→ F14 (Analytics) ──→ F15 (SuperAdmin) ──→ F20 (Marketing)
               ↓
Phase 11+ ──→ F19 (AI Features) ──→ Future Enhancements
```

---

## الميزات الحرجة (يجب بناؤها بإشراف بشري)

| الميزة | السبب | Score |
|--------|-------|-------|
| F01.2 Global Query Filters | عزل البيانات بين المستأجرين | 18 |
| F01.3 Tenant Resolution Middleware | توجيه الطلبات للمستأجر الصحيح | 18 |
| F01.4 Subdomain Routing | جزء من عزل المستأجرين | 18 |
| F10.3 Stripe Integration | معالجة الأموال | 16 |
| F10.6 Payment Webhooks | استقبال إشعارات الدفع | 17 |
| F12.5 SSL Certificate | أمن الاتصال | 17 |
| F11.9 Auto-Renewal | التعامل مع الأموال | 17 |

---

> **كيفية الاستخدام:**
> - عند بدء العمل على ميزة، استخدم الـ ID (مثل F03.6) كمرجع
> - حدّث عمود "الحالة" عندما تتغير
> - راجع عمود "المسؤولية" قبل التفويض للـ AI
> - استخدم الـ API Endpoints و Database Entities كمواصفات تقنية

---

**آخر تحديث:** فبراير 10, 2026
