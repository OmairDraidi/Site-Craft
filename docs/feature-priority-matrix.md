# Feature Priority Matrix — AI vs Human Development

**Purpose:** Assess each SiteCraft feature using the **Feature Criticality Matrix** from the Vibe Coding Handbook to determine optimal AI/human delegation strategy.

**Scoring System (4-20 points):**  
Each feature scored on 5 dimensions (1-4 scale each):
- **Data Impact (DI):** Risk of data loss/corruption
- **Security (S):** Security vulnerability risk
- **Reversibility (R):** How easy to revert if wrong
- **User Impact (UI):** How many users affected by bugs
- **Business Impact (BI):** Revenue/reputation risk

**Total Score = DI + S + R + UI + BI**

---

## Delegation Strategy

| Score Range | Strategy | Examples |
|-------------|----------|----------|
| **4-8** | ✅ **Fully AI** | UI components, CRUD operations, basic forms |
| **9-12** | 🟡 **AI with Review** | Authentication, data validation, API endpoints |
| **13-16** | 🟠 **AI Draft + Human Refine** | Payment integration, multi-tenant filtering, migrations |
| **17-20** | 🔴 **Human-Led** | Security architecture, billing logic, data recovery |

---

## SiteCraft Feature Assessment

### Phase 6: Foundation  

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **Environment Setup (Docker, Vite, .NET)** | 1 | 2 | 1 | 1 | 1 | **6** | ✅ AI | Low risk, standardized setup |
| **Database Schema (EF Core Migrations)** | 3 | 2 | 2 | 2 | 3 | **12** | 🟡 AI+Review | Critical structure, review all migrations |
| **Multi-Tenant Query Filters** | 4 | 4 | 2 | 4 | 4 | **18** | 🔴 Human-Led | **CRITICAL** — Tenant isolation is security-critical |
| **JWT Authentication** | 3 | 4 | 2 | 3 | 3 | **15** | 🟠 AI Draft | AI generates, human reviews security |
| **Password Hashing (BCrypt)** | 3 | 4 | 1 | 3 | 3 | **14** | 🟠 AI Draft | Use proven libraries, review implementation |
| **User Registration Endpoint** | 2 | 3 | 2 | 2 | 2 | **11** | 🟡 AI+Review | Standard flow, validate inputs thoroughly |
| **Login Endpoint** | 2 | 3 | 2 | 3 | 2 | **12** | 🟡 AI+Review | Critical for access control |
| **Protected Routes (Frontend)** | 2 | 3 | 2 | 2 | 2 | **11** | 🟡 AI+Review | Review token validation logic |
| **Tenant Resolution Middleware** | 4 | 4 | 2 | 4 | 4 | **18** | 🔴 Human-Led | **CRITICAL** — Must correctly isolate tenants |

---

### Phase 7: Template Gallery

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **Template CRUD API** | 2 | 2 | 3 | 2 | 2 | **11** | 🟡 AI+Review | Standard CRUD, validate JSON structure |
| **Template Gallery UI** | 1 | 1 | 4 | 2 | 1 | **9** | ✅ AI | UI component, low risk |
| **Template Preview** | 1 | 1 | 4 | 2 | 1 | **9** | ✅ AI | Frontend display logic |
| **Apply Template to Site** | 3 | 2 | 2 | 3 | 3 | **13** | 🟠 AI Draft | Can overwrite user data, review carefully |
| **Template Filtering (Category, Search)** | 1 | 1 | 4 | 2 | 1 | **9** | ✅ AI | Simple query logic |

---

### Phase 8: Visual Builder

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **Drag-and-Drop UI** | 1 | 1 | 4 | 3 | 2 | **11** | 🟡 AI+Review | Complex UI, test thoroughly |
| **Component Library (Hero, Text, etc.)** | 1 | 1 | 4 | 2 | 1 | **9** | ✅ AI | Reusable React components |
| **Save Page Data (JSON)** | 3 | 2 | 2 | 3 | 3 | **13** | 🟠 AI Draft | Data loss risk, validate JSON schema |
| **Publish/Unpublish Page** | 2 | 2 | 3 | 3 | 2 | **12** | 🟡 AI+Review | Moderately critical, reversible |
| **Page Slug Generation** | 2 | 1 | 3 | 2 | 2 | **10** | 🟡 AI+Review | Must ensure uniqueness per tenant |
| **SEO Metadata Management** | 1 | 1 | 4 | 2 | 2 | **10** | ✅ AI | Low risk, straightforward |

---

### Phase 9: Domain Management

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **Custom Domain CRUD** | 2 | 3 | 3 | 3 | 3 | **14** | 🟠 AI Draft | Affects site access, review DNS logic |
| **DNS Verification** | 2 | 3 | 3 | 3 | 3 | **14** | 🟠 AI Draft | External API integration, test well |
| **SSL Certificate (Let's Encrypt)** | 3 | 4 | 2 | 4 | 4 | **17** | 🔴 Human-Led | **CRITICAL** — Security & uptime impact |
| **Subdomain Routing Logic** | 4 | 4 | 2 | 4 | 4 | **18** | 🔴 Human-Led | **CRITICAL** — Part of tenant isolation |

---

### Phase 10: Billing & Subscriptions

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **Stripe Integration** | 3 | 4 | 2 | 3 | 4 | **16** | 🔴 Human-Led | **CRITICAL** — Revenue impact, PCI compliance |
| **Subscription Plan CRUD** | 2 | 2 | 3 | 2 | 3 | **12** | 🟡 AI+Review | Moderately critical, affects billing |
| **Subscription Upgrade/Downgrade** | 3 | 3 | 2 | 3 | 4 | **15** | 🟠 AI Draft | Revenue impact, test edge cases |
| **Usage Tracking (Pages, Storage)** | 2 | 2 | 3 | 2 | 3 | **12** | 🟡 AI+Review | Affects plan limits, validate logic |
| **Payment Webhooks (Stripe)** | 4 | 4 | 1 | 4 | 4 | **17** | 🔴 Human-Led | **CRITICAL** — Must handle failures correctly |
| **Invoice Generation** | 2 | 2 | 3 | 2 | 3 | **12** | 🟡 AI+Review | Financial record, validate math |
| **Billing Dashboard UI** | 1 | 1 | 4 | 2 | 2 | **10** | ✅ AI | Display-only, low risk |

---

### Phase 11: User Management

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **Add/Remove Tenant Users** | 2 | 3 | 3 | 2 | 2 | **12** | 🟡 AI+Review | Affects access control |
| **Role Assignment (Admin, User)** | 3 | 4 | 2 | 3 | 3 | **15** | 🟠 AI Draft | Permission escalation risk |
| **User Permissions Matrix** | 3 | 4 | 2 | 3 | 3 | **15** | 🟠 AI Draft | Security-critical, review thoroughly |
| **User Activity Logs** | 1 | 2 | 4 | 1 | 2 | **10** | ✅ AI | Audit trail, low risk |

---

### Phase 12: Analytics & Reporting

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **Page View Tracking** | 1 | 1 | 4 | 1 | 2 | **9** | ✅ AI | Event logging, low risk |
| **Analytics Dashboard (Charts)** | 1 | 1 | 4 | 2 | 1 | **9** | ✅ AI | Frontend display, low risk |
| **Export Reports (CSV, PDF)** | 1 | 1 | 4 | 1 | 2 | **9** | ✅ AI | Data export, low risk |
| **Real-Time Analytics (WebSockets)** | 2 | 2 | 3 | 2 | 2 | **11** | 🟡 AI+Review | Moderate complexity |

---

### Phase 13: AI Content Generation

| Feature | DI | S | R | UI | BI | **Total** | Strategy | Notes |
|---------|----|----|----|----|----|-----------| ---------|-------|
| **OpenAI API Integration** | 2 | 3 | 3 | 2 | 3 | **13** | 🟠 AI Draft | API key security, cost monitoring |
| **AI Text Generation** | 1 | 2 | 4 | 2 | 2 | **11** | 🟡 AI+Review | Output quality varies |
| **AI SEO Suggestions** | 1 | 1 | 4 | 2 | 2 | **10** | ✅ AI | Recommendation engine |
| **AI Image Alt Text** | 1 | 1 | 4 | 1 | 1 | **8** | ✅ AI | Accessibility feature |

---

## Summary Statistics

| Strategy | Count | % of Features |
|----------|-------|---------------|
| ✅ **Fully AI** | 13 | 28% |
| 🟡 **AI with Review** | 14 | 30% |
| 🟠 **AI Draft + Human Refine** | 12 | 26% |
| 🔴 **Human-Led** | 7 | 15% |
| **Total** | **46** | **100%** |

---

## Critical Features (17-20) — **Human-Led Only**

1. **Multi-Tenant Query Filters** (18) — Tenant isolation
2. **Tenant Resolution Middleware** (18) — Tenant routing
3. **Subdomain Routing Logic** (18) — Request routing
4. **SSL Certificate Management** (17) — Security
5. **Stripe Integration** (16) — Payment processing
6. **Payment Webhooks** (17) — Revenue handling

**⚠️ WARNING:** These features MUST be implemented with human oversight due to security, revenue, and data isolation risks.

---

## AI-Recommended Features (4-8) — **Fast Track**

1. Template Gallery UI
2. Template Preview
3. Template Filtering
4. Component Library (Hero, Text, Image, etc.)
5. SEO Metadata Management
6. Billing Dashboard UI
7. User Activity Logs
8. Page View Tracking
9. Analytics Dashboard
10. Export Reports
11. AI Image Alt Text
12. Environment Setup

**✅ Recommendation:** These can be fully delegated to AI agents with minimal review.

---

## Implementation Priority (Phases 6-13)

### **Phase 6 (Immediate)**
1. 🔴 Multi-Tenant Query Filters — **Human (Priority 1)**
2. 🔴 Tenant Resolution Middleware — **Human (Priority 2)**
3. 🟠 Database Schema — AI Draft → Human Review
4. 🟠 JWT Authentication — AI Draft → Human Review
5. ✅ Environment Setup — Fully AI

### **Phase 7-8 (Next)**
1. ✅ Template Gallery UI — Fully AI
2. ✅ Component Library — Fully AI
3. 🟡 Drag-and-Drop Builder — AI + Review
4. 🟠 Save Page Data — AI Draft → Human Review

### **Phase 9-10 (Later)**
1. 🔴 SSL Certificate — **Human-Led**
2. 🔴 Stripe Integration — **Human-Led**
3. 🟠 Custom Domain Management — AI Draft → Human Review

---

## Review Checklist (For AI-Generated Code)

When using AI for **🟡 AI+Review** or **🟠 AI Draft** features:

- [ ] **Security:** No hardcoded secrets, proper input validation
- [ ] **Multi-Tenant:** All queries include `TenantId` filter
- [ ] **Error Handling:** Try-catch blocks, proper logging
- [ ] **Validation:** All user inputs validated (FluentValidation)
- [ ] **Testing:** Unit tests provided for critical paths
- [ ] **Performance:** No N+1 queries, proper indexing
- [ ] **Reversibility:** Can rollback changes if needed

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| AI generates insecure auth code | Manual review of all auth-related code before deployment |
| Multi-tenant filter bypassed | Comprehensive integration tests for tenant isolation |
| Payment webhook failures | Human-led implementation with extensive error handling |
| AI misunderstands business logic | Detailed prompts with PRD/Architecture context |

---

**Last Updated:** February 9, 2026  
**Next Review:** After Phase 6 completion
