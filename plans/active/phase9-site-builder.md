# Phase 9 — Site Builder + Site Customization

**Status:** 📋 Planned  
**Target Start:** February 2026  
**Scope:** F04 (Site Builder — 15 features) + F05 (Branding — 8 features)

---

## Overview

Phase 9 delivers the **Visual Page Builder** — the core product differentiator. Users will create and edit website pages using a drag-and-drop interface with pre-built sections, a properties panel, responsive preview, and page publishing.

Additionally, it introduces **Site Customization** — allowing tenants to define their visual identity (logo, colors, fonts, social links).

---

## Task Breakdown

### Task 1: Page Entity + Backend API (F04.9, F04.10, F04.11, F04.13) ✅ COMPLETE

**Goal:** Create the Page entity, CRUD endpoints, and JSON page storage.

**Backend:**
- ✅ `Page` entity: Id, TenantId, SiteId, Title, Slug, MetaDescription, MetaKeywords, IsPublished, PublishedAt, PageData (JSON), TemplateId, CreatedAt, UpdatedAt
- ✅ `Component` entity: Id, TenantId, PageId, Type, Content (JSON), Order, IsVisible, CreatedAt, UpdatedAt
- ✅ `IPageRepository` + `PageRepository`
- ✅ `IPageService` + `PageService` (CRUD + Publish/Unpublish + Slug generation)
- ✅ `PagesController` — 7 endpoints
- ✅ Auto-slug generation per tenant (unique per site)
- ✅ Draft/Published states
- ✅ 12 unit tests (all passing)
- ✅ Migration applied successfully

**Endpoints:**
```
GET    /api/v1/pages?siteId={id}  — List pages (implemented)
POST   /api/v1/pages              — Create page (implemented)
GET    /api/v1/pages/{id}         — Page details (implemented)
PUT    /api/v1/pages/{id}         — Update page (save JSON) (implemented)
DELETE /api/v1/pages/{id}         — Delete page (implemented)
POST   /api/v1/pages/{id}/publish   — Publish (implemented)
POST   /api/v1/pages/{id}/unpublish — Unpublish (implemented)
```

**Database:** EF Core migration `AddPagesAndComponents` - Tables: `Pages`, `Components`

**Completed:** February 14, 2026

---

### Task 2: Navigation Builder Backend (F04.NAV.1–5)

**Goal:** Menu system with nested items.

**Backend:**
- `Menu` entity: Id, SiteId, Name, Location (Header/Footer)
- `MenuItem` entity: Id, MenuId, Label, Url, ParentId (self-referencing for dropdowns), Order, Target
- CRUD endpoints for menus and items
- Drag-and-drop reorder (update Order field)

**Endpoints:**
```
GET    /api/v1/menus              — List menus
POST   /api/v1/menus              — Create menu
PUT    /api/v1/menus/{id}         — Update menu
DELETE /api/v1/menus/{id}         — Delete menu
POST   /api/v1/menus/{id}/items   — Add item
PUT    /api/v1/menu-items/{id}    — Update item
DELETE /api/v1/menu-items/{id}    — Delete item
POST   /api/v1/menus/{id}/reorder — Reorder items
```

---

### Task 3: Page Builder Frontend — Layout (F04.1, F04.2, F04.3, F04.4)

**Goal:** Build the 3-column visual editor layout.

**Frontend:**
- `/builder/{pageId}` route
- **Left Sidebar:** Elements panel (Text, Image, Button, Video, Form, Icon) + Sections panel (Hero, Features, Pricing, Testimonial, Footer)
- **Center:** Drag-and-drop canvas with grid lines and resize handles
- **Right Sidebar:** Properties panel (Typography, Colors, Borders, Shadows, Layout, Animations)
- Zustand store: `useBuilderStore` (selected element, page data, history)

**Libraries needed:**
- `@dnd-kit/core` + `@dnd-kit/sortable` — drag and drop
- `@dnd-kit/utilities` — utilities

---

### Task 4: Drag-and-Drop + Block Editing (F04.5, F04.6, F04.14, F04.15)

**Goal:** Interactive editing capabilities.

**Frontend:**
- Block reordering via drag-and-drop
- Undo/Redo (Ctrl+Z / Ctrl+Y) — history stack in Zustand
- Section visibility toggle (show/hide sections)
- Alignment guides (smart snap lines when dragging)
- Inline text editing
- Element selection with visual handles

---

### Task 5: Responsive Preview + Publish (F04.7, F04.8, F04.12)

**Goal:** Preview and publish pages.

**Frontend:**
- Responsive preview switcher (Desktop 1200px / Tablet 768px / Mobile 375px)
- Preview mode (read-only view, exit editing)
- Publish button → API call → updates IsPublished
- SEO metadata tab in properties (Title, Description, Keywords)
- Toast notifications for save/publish actions

---

### Task 6: Site Customization — Branding (F05.1–F05.8)

**Goal:** Site identity customization for each tenant.

**Backend:**
- Site settings API (branding data in Site entity or SiteSettings JSON)
- Endpoints:
```
GET    /api/v1/site              — Get site settings
PUT    /api/v1/site              — Update site settings
PUT    /api/v1/site/branding     — Update branding
```

**Frontend:**
- `/settings/branding` page (or tab inside Settings)
- Logo upload (drag-and-drop, PNG/JPG/SVG, max 2MB)
- Color picker (primary + secondary colors)
- Font selector (10+ font combos: heading + body)
- Favicon upload
- Site title + tagline
- Social media links (Facebook, Twitter, Instagram, LinkedIn)
- Contact info (email, phone, address)
- Live preview of changes before save

---

## Dependencies

| From | Required For |
|------|-------------|
| Phase 6 (Auth + Tenancy) | Tenant-scoped pages |
| Phase 7 (Templates) | Template-based page creation |
| Phase 8 (Projects) | Pages belong to Projects |

---

## Technical Notes

- **Page Data Format:** JSON structure representing the page tree
```json
{
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0,
      "visible": true,
      "components": [
        { "id": "heading-1", "type": "heading", "content": "Welcome", "styles": {...} },
        { "id": "button-1", "type": "button", "content": "Get Started", "styles": {...} }
      ]
    }
  ]
}
```
- **Undo/Redo:** Array-based history stack (max 50 states)
- **Auto-save:** Debounced save every 30 seconds
- **Slug:** Generated from page title, checked for uniqueness per tenant

---

## Estimated Scope

| Metric | Estimate |
|--------|----------|
| Tasks | 6 |
| API Endpoints | ~15 new |
| New Entities | 4 (Page, Component, Menu, MenuItem) |
| New Frontend Pages | 2 (Builder, Branding) |
| New Components | ~20 |
| Lines of Code | ~3,000-5,000 |

---

**Phase 9 Status:** 📋 PLANNED  
**Previous Phase:** Phase 8 — Project Details ✅
