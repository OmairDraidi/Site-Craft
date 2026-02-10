# SiteCraft — Project Context (AI Summary)

> **Full documentation:** [plans/project.md](../../plans/project.md)

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

## Key Features (MVP)

### Phase 1-5 (Planning — ✅ Complete)
- ✅ System analysis, ERD, UML diagrams
- ✅ Product requirements document
- ✅ Architecture design (Clean Architecture + Multi-tenancy)
- ✅ Brand identity & UI design system
- ✅ Wireframes & HTML prototypes

### Phase 6-8 (Implementation — 🔜 Next)
- 🔜 **Authentication System:** JWT + role-based access
- 🔜 **Template Gallery:** Pre-designed templates with AI customization
- 🔜 **Visual Builder:** Drag-and-drop editor with component library
- 🔜 **Domain Management:** Custom domain mapping + SSL
- 🔜 **User Management:** Tenant users with role-based permissions
- 🔜 **Billing & Subscriptions:** Stripe integration with tiered pricing

### Phase 9-10 (Advanced — Future)
- ⏳ Analytics dashboard
- ⏳ Advanced AI features (SEO, content optimization)
- ⏳ Multi-language support (English, Arabic)
- ⏳ Mobile app

---

## Current Phase

**Phase 5 → Phase 6 Transition (February 2026)**

**Status:**
- Planning phases (1-5) are **complete**
- Implementation about to begin with environment setup
- Next milestone: Functional authentication system

---

## Tech Stack Summary

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS
- **Backend:** ASP.NET Core 8 + Clean Architecture
- **Database:** MySQL 8 + Redis (caching)
- **AI:** OpenAI GPT-4 API
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
| 6 | Environment Setup + Database | 🔜 Next |
| 7 | Authentication System | 🔜 Next |
| 8 | Template Gallery + Builder | ⏳ Planned |
| 9 | Advanced Features | ⏳ Planned |
| 10 | Testing & Launch | ⏳ Planned |

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

**Last Updated:** February 9, 2026  
**Phase:** Planning → Implementation Transition
