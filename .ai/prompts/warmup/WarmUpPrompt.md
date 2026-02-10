# SiteCraft — Warm Up Prompt
(ابدأ كل جلسة بشحن هذا البرومبت لتذكير الـ AI بالسياق العام قبل أي مهمة)

مرحبًا، قبل أن نبدأ الشغل… إليك تذكير سريع ومنظّم عن مشروع SiteCraft لكي تعمل بدقة وثبات:

---

## 1. What is SiteCraft?
SiteCraft هو **نظام SaaS متعدد المستأجرين (Multi-Tenant)** يسمح للمستخدمين ببناء مواقع جاهزة بسهولة باستخدام:
- مكتبة قوالب Templates
- نظام تحرير Builder
- تخصيص الهوية
- إدارة دومينات
- Dashboard لكل Tenant
- نظام نشر مباشر

---

## 2. Current Status
المشروع جاهز بالكامل من حيث:
- System Analysis ✔
- PRD ✔
- Brand Identity ✔
- Wireframes ✔
- Full UI Prompts ✔
- Architecture ✔
- Project.md ✔
- Conventions.md ✔
- AI Context (dev + ui + rules + memory) ✔

ونحن الآن جاهزين للانتقال للمرحلة التالية من التنفيذ (تصميم واجهات أو بناء الكود).

---

## 3. Tech Stack (Quick Recap)
### Frontend
React 19 — Vite — TypeScript — Tailwind — React Query — Zustand — shadcn/ui — Axios — RHF + Yup

### Backend
ASP.NET Core 8 — EF Core — MySQL 8 — Redis — Hangfire — Azure Blob/S3 — Serilog

### Deployment
Docker + Docker Compose — VPS (Contabo/Hetzner) — Nginx reverse proxy — GitHub Actions

### Tenancy Model
- Shared DB  
- TenantId على كل جدول  
- Subdomain-based resolution  

---

## 4. AI Behavior Rules
الهدف منك كـ AI:
- الالتزام بالمستندات (PRD + Architecture + Conventions)
- عدم تغيير أي قرار معماري
- احترام الـ Tech Stack
- الحفاظ على Multi-Tenant logic
- إنتاج كود نظيف، منظم، جاهز للتنفيذ
- الالتزام بالـ dark + gold theme
- استخدام React Query و Zustand بالطريقة الصحيحة
- استخدام EF Core بطريقة صحيحة حسب الطبقات (API / App / Domain / Infra)

---

## 5. Output Formatting
عند تنفيذ أي مهمة:
- استخدم Markdown  
- استخدم code blocks عند الحاجة  
- كن مباشرًا وواضحًا  
- لا تضف كلام زائد  
- التزم بالـ naming conventions  

---

## 6. Current Task 

### Scenario A: UI Design
- **Current Focus:** Generate Dashboard UI in Figma
- **Using:** SiteCraft_Full_AI_Prompts.md → Dashboard prompt
- **Expected Output:** Figma design link

### Scenario B: Backend Development
- **Current Focus:** Build Authentication API
- **Working on:** SiteCraft.Api + SiteCraft.Application
- **Expected Output:** Controllers + Services + DTOs

### Scenario C: Frontend Development
- **Current Focus:** Build Template Gallery page
- **Working on:** frontend/src/features/templates
- **Expected Output:** React components + API integration

### Scenario D: Database
- **Current Focus:** Create EF Core Migrations
- **Using:** Phase1_System_Analysis.md → ERD
- **Expected Output:** Migration files

### Scenario E: DevOps/Deployment
- **Current Focus:** Setup Docker environment or CI/CD pipeline
- **Working on:** Dockerfile, docker-compose.yml, GitHub Actions workflow
- **Expected Output:** Deployment configuration files

---

## 7. Let’s Begin
بعد تحميل هذا الـ WarmUpPrompt، أنت جاهز للتنفيذ بدقة واتساق.
