# memory.md — AI Project Memory for SiteCraft

## Purpose
To maintain long-term consistency for AI agents working on the SiteCraft project.

---

## 1. Fixed Decisions (do not change)
- Frontend = React 19 + Vite + TypeScript + Tailwind CSS
- Backend = ASP.NET Core 8 + Clean Architecture + EF Core + MySQL 8 + Redis
- Database = MySQL 8 (NOT PostgreSQL)
- Multi-tenant = Shared DB + TenantId filter on all tables
- Deployment = VPS (Contabo/Hetzner) + Docker Compose (NOT AWS)
- Theme = Black (#0A0A0A) + Gold (#F6C453)
- UI fonts = Poppins (headings) + Inter (body) + Cairo (Arabic)
- Tenant routing = subdomain-based (e.g., acme.sitecraft.com)
- Spacing scale = 4/8/12/16/24/32/48/64/96/128 px
- Authentication = JWT with role-based access (SuperAdmin, TenantAdmin, TenantUser)

---

## 2. Important References
- [Architecture.md](../../plans/Architecture.md) — Full technical architecture
- [SiteCraft_PRD.md](../../plans/SiteCraft_PRD.md) — Product requirements (updated Feb 2026)
- [Phase1_System_Analysis.md](../../plans/completed/Phase1_System_Analysis.md) — System analysis with UML/ERD
- [SiteCraft_Brand_Identity.md](../../plans/SiteCraft_Brand_Identity.md) — Brand guidelines
- [SiteCraft_Full_Wireframes.md](../../plans/SiteCraft_Full_Wireframes.md) — Wireframes
- [LEGACY_PROJECT_SUMMARY.md](../../plans/LEGACY_PROJECT_SUMMARY.md) — Consolidated legacy docs
- [conventions.md](./conventions.md) — Coding & naming conventions
- [dev_context.md](./dev_context.md) — Full development context

---

## 3. Completed Phases (February 2026)
- ✅ **Phase 1-5:** Planning, architecture, design, ERD, wireframes
- ✅ **Phase 6 (Feb 10):** Environment setup, multi-tenancy (shared DB + TenantId), JWT authentication
- ✅ **Phase 7 (Feb 12):** Template Engine — CRUD, favorites, premium system, 11 unit tests (100% pass)
- ✅ **Phase 8 (Feb 13):** Project Details — CRUD, template linking, status management, inline editing
- ✅ **Feb 13:** Documentation consolidation — legacy files moved to LEGACY_PROJECT_SUMMARY.md, plans/ reorganized

---

## 4. Current Status
- **Active Phase:** Phase 9 (Visual Page Builder) — not started
- **Backend running:** port 5000, MySQL 3306, Redis 6379
- **Frontend running:** port 5173

---

## 5. Future Notes
- Billing provider = Stripe (Phase 10)
- AI content generation = OpenAI GPT-4 API (Phase 9-10)
- Email provider = SendGrid or SMTP
- File storage = Azure Blob Storage or S3-compatible
- CDN = Consider Cloudflare for static assets (post-MVP)
- Multi-language support = Planned for Phase 10+ (English + Arabic)
- Visual Page Builder = Phase 9 priority

---

## 6. What NOT to Do
- ❌ Do NOT suggest Django, Next.js, or PostgreSQL (we use ASP.NET Core, React, MySQL)
- ❌ Do NOT propose AWS deployment (we use VPS)
- ❌ Do NOT use spacing values outside the 4-128px scale
- ❌ Do NOT create entities without TenantId (except global tables)
- ❌ Do NOT bypass multi-tenant filtering in queries
