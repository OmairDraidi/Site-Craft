# Phase 10 — Advanced Modules: Courses & Blog

**Status:** 📋 PLANNED  
**Started:** February 16, 2026  
**Scope:** F06 (Courses Module) + F07 (Blog Module) + F18 (Module Activation)

## Overview

Phase 10 introduces the "Modular SaaS" capabilities of SiteCraft. Instead of just static pages, tenants can now activate vertical-specific functionality:
1. **Courses Module:** For educators and trainers to sell and manage online courses.
2. **Blog Module:** For content marketing and news sections.
3. **Module Activation:** A system to enable/disable these features per site to keep the UI clean.

---

## Task Breakdown

### Task 1: Module Activation System (F18.1–5)
**Goal:** Create the infrastructure to toggle features per site.
- **Backend:**
  - `Module` entity (Id, Name, Slug, Description, IsDefault).
  - `TenantModule` entity (Id, TenantId, SiteId, ModuleId, IsActive).
  - Middleware to restrict API access if module is disabled.
- **Frontend:**
  - `/settings/modules` page with toggle cards.
  - Sidebar updates to conditionally show/hide module links.

### Task 2: Courses Module — Backend (F06.1–13)
**Goal:** Entities, Repositories, and Services for E-learning.
- **Entities:** `Course`, `Lesson`, `Enrollment`, `Category`.
- **Endpoints:**
  - Course CRUD
  - Lesson reordering (within course)
  - Student enrollment logic
  - Progress tracking API

### Task 3: Courses Module — Frontend UI
**Goal:** Management interface and student view.
- **Management:**
  - `/courses` manager (List/Grid view).
  - Course editor (Details, Pricing, Curriculum builder).
  - Curriculum builder with drag-and-drop lessons.
- **Student View:**
  - Course landing page (public).
  - Course player (for enrolled students).

### Task 4: Blog Module — Backend (F07.1–9)
**Goal:** Content management system for articles.
- **Entities:** `Post`, `Category`, `Tag`.
- **Endpoints:**
  - Post CRUD (with scheduling logic).
  - Category management.
  - Image upload integration.

### Task 5: Blog Module — Frontend UI
**Goal:** Editor and listing pages.
- **Management:**
  - `/blog` manager (Posts list).
  - Rich-text editor integration (TipTap or similar).
  - Scheduling and SEO metadata.

---

## 📅 Schedule (Tentative)

| Task | Estimated Time | Complexity |
|------|----------------|------------|
| Task 1: Module System | 1 day | Medium |
| Task 2 & 3: Courses | 3-4 days | High |
| Task 4 & 5: Blog | 2 days | Medium |
| Integration & Polish | 1 day | Low |

---

## 🎯 Success Criteria
- [ ] Tenant can enable "Courses" and see it in the sidebar.
- [ ] Tenant can create a course with 3 lessons and set a price.
- [ ] Tenant can publish a blog post with a featured image.
- [ ] Hidden features stay hidden when modules are disabled.

---

**Next Up:** Task 1 — Module Activation Infrastructure 🚀
