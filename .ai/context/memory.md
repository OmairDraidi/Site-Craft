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
- [SiteCraft_Full_AI_Prompts.md](../../plans/SiteCraft_Full_AI_Prompts.md) — Figma prompts
- [conventions.md](./conventions.md) — Coding & naming conventions
- [dev_context.md](./dev_context.md) — Full development context

---

## 3. Recent Changes (February 2026)
- ✅ Fixed PRD tech stack conflict (was Django/Next.js/PostgreSQL → now ASP.NET Core/React/MySQL)
- ✅ Unified spacing scale across ui_context.md and Brand Identity (4-128px)
- ✅ Clarified deployment strategy (VPS only, not AWS)
- ✅ Restructured project folders to match Vibe Coding Handbook (ai/ → .ai/, Plan/ → plans/)
- ✅ Created .ai/context/project.md and .ai/context/architecture.md as AI-optimized summaries

---

## 4. Future Notes
- Billing provider = Stripe (integration in Phase 6/7)
- AI content generation = OpenAI GPT-4 API (Phase 7+)
- Email provider = SendGrid or SMTP
- File storage = Azure Blob Storage or S3-compatible
- CDN = Consider Cloudflare for static assets (post-MVP)
- Multi-language support = Planned for Phase 9+ (English + Arabic)

---

## 5. What NOT to Do
- ❌ Do NOT suggest Django, Next.js, or PostgreSQL (we use ASP.NET Core, React, MySQL)
- ❌ Do NOT propose AWS deployment (we use VPS)
- ❌ Do NOT use spacing values outside the 4-128px scale
- ❌ Do NOT create entities without TenantId (except global tables)
- ❌ Do NOT bypass multi-tenant filtering in queries
