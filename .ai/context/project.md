# SiteCraft — Project Context (AI Summary)

> **Full documentation:** [plans/Architecture.md](../../plans/Architecture.md)

---

## Vision

**SiteCraft** is an AI-powered, multi-tenant SaaS platform that enables agencies, freelancers, and small businesses to create professional websites using:
- **AI-generated content** and templates
- **Drag-and-drop visual builder**
- **Full multi-tenancy** with custom domains
- **Tiered subscription model** (Free → Enterprise)

---

## Core Pillars

1. **Multi-Tenancy First:** Complete tenant isolation, custom domains, subdomain routing
2. **AI-Powered:** GPT-4 integration for content generation, SEO optimization, design suggestions
3. **Visual Builder:** Real-time drag-and-drop editor with component library
4. **SaaS Business Model:** Subscription-based with clear upgrade paths

---

## Target Users

| User Type | Description |
|-----------|-------------|
| **SuperAdmin** | Platform owner — manages all tenants, billing, system configuration |
| **Tenant Admin** | Business owner — manages their website, users, content, settings |
| **Tenant User** | Staff/collaborators — limited permissions (e.g., content editing only) |
| **End Visitors** | Public users visiting tenant websites |

---

## Key Features

### Phase 1-5 (Planning — ✅ Complete)
- ✅ System analysis, ERD, UML diagrams
- ✅ Product requirements document
- ✅ Architecture design (Clean Architecture + Multi-tenancy)
- ✅ Brand identity & UI design system
- ✅ Wireframes & HTML prototypes

### Phase 6 (Foundation — ✅ Complete)
- ✅ **Environment Setup:** Backend (ASP.NET Core 8), Frontend (React 19 + Vite), Docker (MySQL + Redis)
- ✅ **Multi-Tenancy:** Shared DB + TenantId row-level isolation, global query filters
- ✅ **Authentication:** JWT + BCrypt, refresh tokens, role-based access

### Phase 7 (Template Engine — ✅ Complete)
- ✅ **Template Gallery:** CRUD, search, filter, sort, pagination
- ✅ **Premium System:** Free/Pro/Enterprise subscription tiers
- ✅ **Favorites:** Toggle favorites with optimistic UI
- ✅ **Device Preview:** Desktop/Tablet/Mobile preview
- ✅ **Unit Tests:** 11 tests, 100% passing

### Phase 8 (Project Details — ✅ Complete)
- ✅ **Project CRUD:** Create, view, edit, delete projects
- ✅ **Template Linking:** Apply templates to projects
- ✅ **Status Management:** Active/Archived/Draft status tracking
- ✅ **Inline Editing:** Edit project details inline

### Phase 9 (Site Builder — ✅ Complete)
- ✅ **Visual Page Builder:** Drag-and-drop editor, component library, undo/redo
- ✅ **Navigation Builder:** Menu management, nested items, reordering
- ✅ **Branding:** Logo upload, color picker, font selector, SEO controls

### Phase 10 (Advanced Modules — 🔜 Current)
- 🔜 **Courses Module:** Course CRUD, lessons management, student enrollment
- 🔜 **Blog Module:** Articles, categories, tags, scheduling
- 🔜 **Module System:** Enable/disable modules per site
- ⏳ Analytics dashboard
- ⏳ Advanced AI features (SEO, content optimization)

---

## Current Phase

**Phase 9 → Phase 10 Transition (February 2026)**

**Status:**
- Phases 1-9 are **complete**
- Next milestone: Courses & Blog Modules + Activation System
- Goal: Add vertical-specific functionality (Education & Content)

---

## Tech Stack Summary

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS
- **Backend:** ASP.NET Core 8 + Clean Architecture
- **Database:** MySQL 8 + Redis (caching)
- **AI:** OpenAI GPT-4 API (planned for Phase 11)
- **Deployment:** Docker Compose on VPS (Contabo/Hetzner)
- **Auth:** JWT with multi-tenant middleware

---

## 10-Phase Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | System Analysis | ✅ Complete |
| 2 | Architecture Design | ✅ Complete |
| 3 | UI/UX Design | ✅ Complete |
| 4 | Database Design (ERD) | ✅ Complete |
| 5 | Wireframes & Prototypes | ✅ Complete |
| 6 | Environment + Multi-Tenancy + Auth | ✅ Complete |
| 7 | Template Engine | ✅ Complete |
| 8 | Project Details & Site Management | ✅ Complete |
| 9 | Visual Page Builder + Branding | ✅ Complete |
| 10 | Advanced Modules (Courses, Blog) | 🔜 Current |

---

## Project Constraints

- **Timeline:** Iterative development (no hard deadline)
- **Budget:** Bootstrap/low-cost (VPS instead of AWS)
- **Team:** Solo developer + AI assistance (Vibe Coding methodology)
- **Scope:** MVP first, then iterate based on feedback

---

## Success Metrics (Post-Launch)

- **10 active tenants** within first 3 months
- **70% user retention** after onboarding
- **5+ templates** in gallery
- **< 3s page load time**
- **99% uptime**

---

**Last Updated:** February 13, 2026  
**Phase:** Phase 8 Complete → Phase 9 Next
