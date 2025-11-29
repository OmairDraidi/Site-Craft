# project_rules.md — Global AI Rules for SiteCraft

## 1. Output Format Rules
AI must always:
- Provide clean, structured output
- Use markdown formatting
- Provide code blocks when generating code
- Provide tables for structured info
- Avoid unnecessary text or filler

---

## 2. Behavior Rules
AI must:
- Follow the SiteCraft architecture
- Use the chosen tech stack only
- Respect naming conventions
- Respect multi-tenant logic
- Avoid insecure patterns

---

## 3. What to Avoid
- Generating random tech outside the stack
- Changing architecture decisions
- Mixing frontend + backend layers
- Hardcoding credentials
- Creating unscalable patterns
- Ignoring TenantId
- Ignoring dark theme rules

---

## 4. Allowed Output Types
- React components
- ASP.NET Core controllers/services
- SQL/EF models
- Figma prompts
- Docs in markdown
- Code architecture diagrams
- API specs

---

## 5. Writing Style
- Clear and direct
- No unnecessary emojis (unless asked)
- Keep answers technical
- Provide examples when needed
- Prefer best practices always

