# SiteCraft — AI-Powered Website Builder Platform

**SiteCraft** is a modern, multi-tenant SaaS platform that empowers users to create professional websites using AI-powered tools and customizable templates. Built for agencies, freelancers, and small businesses, SiteCraft combines powerful backend architecture with an intuitive drag-and-drop builder.

---

## 🚀 Tech Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS
- **Backend:** ASP.NET Core 8 + Clean Architecture
- **Database:** MySQL 8 + Redis (caching)
- **AI/ML:** OpenAI API (GPT-4) for content generation
- **Deployment:** Docker + Docker Compose on VPS (Contabo/Hetzner)
- **Authentication:** JWT + Multi-tenant isolation

---

## 📁 Project Structure

```
Project/
├── .ai/                        # AI context & prompts (for AI-assisted development)
│   ├── context/                # Project context files for AI agents
│   └── prompts/                # Organized prompt templates
│       ├── warmup/             # Session warmup prompts
│       ├── features/           # Feature-specific prompts
│       └── debugging/          # Debugging prompts
├── plans/                      # Project planning & documentation
│   ├── active/                 # Current work plans with progress tracking
│   ├── completed/              # Completed phase documentation
│   ├── Architecture.md         # Technical architecture
│   ├── SiteCraft_PRD.md        # Product Requirements Document
│   ├── project.md              # Project overview & roadmap
│   └── SiteCraft_Brand_Identity.md  # Brand guidelines
├── docs/                       # User & developer documentation (to be created)
├── ref/                        # Reference guides & best practices
├── src/                        # Source code (Phase 7+, to be created)
├── tests/                      # Test files (to be created)
└── README.md                   # This file
```

---

## 🎯 Core Features

- **AI-Powered Builder:** Drag-and-drop editor with AI content generation
- **Template Gallery:** Pre-designed, customizable templates
- **Multi-Tenancy:** Full tenant isolation with custom domains
- **User Management:** Role-based access (SuperAdmin, TenantAdmin, User)
- **Domain Management:** Custom domain mapping & SSL
- **Billing & Subscriptions:** Tiered pricing (Free, Starter, Pro, Enterprise)
- **Analytics Dashboard:** Traffic, conversions, user behavior

---

## 📚 Key Documentation

| Document | Description |
|----------|-------------|
| [Architecture.md](plans/Architecture.md) | Technical architecture, Clean Architecture layers, Docker setup |
| [SiteCraft_PRD.md](plans/SiteCraft_PRD.md) | Complete product requirements, features, user stories, API design |
| [project.md](plans/project.md) | Project vision, roadmap, core pillars |
| [SiteCraft_Brand_Identity.md](plans/SiteCraft_Brand_Identity.md) | Brand colors, typography, UI components |
| [Phase1_System_Analysis.md](plans/completed/Phase1_System_Analysis.md) | System analysis with UML diagrams, ERD |

---

## 🧠 AI-Assisted Development

This project follows the **Vibe Coding Development Lifecycle (VCDL)** as documented in [ref/handbook.md](ref/handbook.md). All AI context files are stored in `.ai/context/` to enable consistent AI-assisted development sessions.

**Key AI Context Files:**
- [.ai/context/dev_context.md](.ai/context/dev_context.md) — Full development context
- [.ai/context/conventions.md](.ai/context/conventions.md) — Naming & coding standards
- [.ai/context/ui_context.md](.ai/context/ui_context.md) — UI/UX rules & brand
- [.ai/prompts/warmup/WarmUpPrompt.md](.ai/prompts/warmup/WarmUpPrompt.md) — Session warmup

---

## 🏗️ Current Status

**Phase:** Planning & Design (Phases 1-5 complete)

**Completed:**
- ✅ System Analysis (Use Cases, ERD, UML Diagrams)
- ✅ Product Requirements Document
- ✅ Architecture Design (Clean Architecture + Multi-tenancy)
- ✅ Brand Identity & UI Design System
- ✅ Wireframes & HTML Prototypes

**Next Steps:**
- 🔜 Phase 6: Environment Setup & Database Schema
- 🔜 Phase 7: Authentication System
- 🔜 Phase 8: Core Feature Implementation

---

## 🛠️ Getting Started

*(To be updated when implementation begins)*

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- MySQL 8
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
