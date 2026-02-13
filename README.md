# SiteCraft — AI-Powered Website Builder Platform

**SiteCraft** is a modern, multi-tenant SaaS platform that empowers users to create professional websites using AI-powered tools and customizable templates. Built for agencies, freelancers, and small businesses, SiteCraft combines powerful backend architecture with an intuitive drag-and-drop builder.

**Current Status:** ✅ Phase 7 Complete - Template Engine Fully Implemented

---

## 🚀 Tech Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS
- **Backend:** ASP.NET Core 8 + Clean Architecture
- **Database:** MySQL 8 + Redis (caching)
- **Authentication:** JWT + BCrypt + Refresh Tokens
- **Multi-Tenancy:** X-Tenant-Id header-based isolation
- **Deployment:** Docker + Docker Compose

---

## ✅ Implemented Features

### Phase 6 - Authentication System
#### Backend
- ✅ JWT-based authentication with refresh tokens
- ✅ User registration & login with tenant context
- ✅ Multi-tenancy system (default, demo, companyb tenants)
- ✅ Password hashing with BCrypt
- ✅ RESTful API with Swagger documentation
- ✅ Clean Architecture (Domain, Application, Infrastructure, API)

#### Frontend
- ✅ Premium Black & Gold UI design
- ✅ Login & Registration pages with validation
- ✅ Protected routes with auth context
- ✅ Dashboard with user information
- ✅ Token management & auto-refresh
- ✅ Error handling & user feedback

### Phase 7 - Template Engine
#### Backend
- ✅ Template CRUD operations (GET, POST, PUT, DELETE)
- ✅ 5 Default templates seeded (Business, Education, Portfolio, Services, Store)
- ✅ SubscriptionPlan enum (Free/Pro/Enterprise)
- ✅ Site entity for applied templates (TenantId, UserId, TemplateId, SiteData JSON)
- ✅ Template Favorites system (TemplateFavorite entity with toggle endpoint)
- ✅ Apply Template logic with premium subscription checks
- ✅ EF Core migration applied successfully
- ✅ 11 unit tests covering all service logic (100% passing)

#### Frontend
- ✅ Template Gallery with search, filter, and sort
- ✅ Template Details Page with device preview
- ✅ DevicePreview component (Desktop/Tablet/Mobile)
- ✅ Template favorite toggle with Heart icon
- ✅ Optimistic UI updates in Zustand store
- ✅ Free/Premium badges
- ✅ Responsive grid layout with glassmorphism design

---

## 📁 Project Structure

```
SiteCraft/
├── backend/
│   ├── src/
│   │   ├── SiteCraft.API/          # Controllers & Program setup
│   │   ├── SiteCraft.Application/   # DTOs & Validators
│   │   ├── SiteCraft.Domain/        # Entities & Interfaces
│   │   └── SiteCraft.Infrastructure/ # Services & Repositories
│   ├── docker-compose.yml           # App services
│   └── docker-compose.infra.yml     # MySQL & Redis
│
├── sitecraft-client/
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # Auth context
│   │   ├── hooks/           # useAuth hook
│   │   ├── services/        # API client & auth service
│   │   ├── types/           # TypeScript interfaces
│   │   └── config/          # API configuration
│   └── package.json
│
├── plans/                   # Project documentation
│   ├── active/              # Current phase plans
│   ├── completed/           # Completed documentation
│   └── Architecture.md      # System architecture
│
├── API_DOCUMENTATION.md     # Complete API reference
├── PHASE6_PROGRESS.md       # Current progress tracker
└── README.md                # This file
```

---

## 🎯 Core Features (Roadmap)

### ✅ Implemented
- ✅ **Authentication (Phase 6):** JWT-based auth with refresh tokens
- ✅ **Multi-Tenancy (Phase 6):** Tenant isolation via X-Tenant-Id header
- ✅ **User Management (Phase 6):** Registration, login, logout, user profile
- ✅ **Template Engine (Phase 7):** Gallery, search/filter/sort, favorites, apply template with premium checks
- ✅ **Site Management (Phase 7):** Site entity creation from templates with subscription validation
- ✅ **Device Preview (Phase 7):** Desktop/Tablet/Mobile preview component

### 🔜 Next Phase (Phase 8)
- 🔜 **Project Management:** CRUD operations for website projects
- 🔜 **Page Builder:** Create and manage pages within projects
- 🔜 **Component System:** Reusable UI components for pages

### 🎯 Future Features
- **AI Content Generation:** GPT-4 powered content creation
- **Template Gallery:** Pre-designed, customizable templates
- **Drag-and-Drop Editor:** Visual website builder
- **Custom Domains:** Domain mapping & SSL
- **Billing & Subscriptions:** Tiered pricing plans
- **Analytics Dashboard:** Traffic & conversion tracking

---

## 🛠️ Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- MySQL 8
- Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sitecraft
   ```

2. **Start infrastructure (MySQL & Redis)**
   ```bash
   cd backend
   docker-compose up -d mysql redis
   ```

3. **Run backend API**
   ```bash
   cd backend/src/SiteCraft.API
   dotnet restore
   dotnet run
   ```
   API will be available at: `http://localhost:5263`

4. **Run frontend**
   ```bash
   cd sitecraft-client
   npm install
   npm run dev
   ```
   App will be available at: `http://localhost:5174`

### First Time Setup

After starting both backend and frontend:

1. Navigate to `http://localhost:5174/register`
2. Create your first account with:
   - Email: `admin@sitecraft.com`
   - Password: `SecurePass123!`
   - First Name & Last Name
3. You'll be automatically logged in and redirected to the dashboard

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference with examples |
| [PHASE6_PROGRESS.md](PHASE6_PROGRESS.md) | Current progress & next steps |
| [Architecture.md](plans/Architecture.md) | System architecture & design patterns |
| [SiteCraft_PRD.md](plans/SiteCraft_PRD.md) | Product requirements & features |
| [Brand Identity](plans/SiteCraft_Brand_Identity.md) | UI/UX guidelines & design system |

---

## 🏗️ Development Status

**Current Phase:** ✅ Phase 6 Complete (Authentication System)

**Progress:**
- ✅ Phase 1: System Analysis & UML Diagrams
- ✅ Phase 2-5: Planning & Design
- ✅ Phase 6: Environment Setup, Multi-Tenancy, Authentication
- 🔜 Phase 7: Project & Page Management
- 🔜 Phase 8: AI-Powered Website Builder
- 🔜 Phase 9: Deployment & Production

---

## 🎨 Brand Identity

**Theme:** Premium Black & Gold  
**Primary Color:** #F6C453 (Gold)  
**Background:** #0A0A0A (Deep Black)  
**Typography:** Bold, uppercase, luxury aesthetic

---
- Docker & Docker Compose

### Local Development
```bash
# Coming soon after Phase 6 completion
```

---

## 🎨 Brand

- **Primary Color:** Gold `#F6C453`
- **Background:** Black `#0A0A0A`
- **Fonts:** Poppins (headings), Inter (body), Cairo (Arabic)
- **Design:** Dark theme with gold accents, modern minimalist aesthetic

---

## 📄 License

*(To be determined)*

---

## 👥 Contributors

Built with AI-assisted development using GitHub Copilot and the Vibe Coding methodology.

---

**Last Updated:** February 9, 2026
