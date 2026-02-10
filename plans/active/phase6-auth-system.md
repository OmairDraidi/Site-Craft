# Phase 6: Authentication System Implementation

**Status:** 🔜 Planned  
**Phase:** Core Feature Development  
**Start Date:** TBD (after environment setup)  
**Target Completion:** TBD  
**Owner:** Development Team

---

## Objective

Implement a complete, secure authentication system for SiteCraft with:
- **Multi-tenant authentication** (tenant-scoped users)
- **Role-based access control** (SuperAdmin, TenantAdmin, TenantUser)
- **JWT token-based authentication**
- **Secure password hashing** (bcrypt/PBKDF2)
- **Email verification** (optional for MVP, plan for future)
- **Password reset** (optional for MVP)
- **Frontend auth flows** (Login, Register, Logout)

---

## Prerequisites

- ✅ Environment setup complete (Phase 6-Environment-Setup)
- ✅ Database schema for `Tenants` and `Users` tables ready
- ✅ Redis configured for token storage (optional refresh tokens)

---

## Tasks & Progress

### 1. Backend: Domain Layer ✅❌

#### 1.1 Create Entities
- [ ] Create `User` entity in `SiteCraft.Domain/Entities/`:
  - Properties: `Id`, `TenantId`, `Email`, `PasswordHash`, `FirstName`, `LastName`, `Role`, `IsActive`, `EmailVerified`, `CreatedAt`, `UpdatedAt`
  - Navigation: `Tenant` (foreign key)
- [ ] Create `UserRole` enum:
  - Values: `SuperAdmin`, `TenantAdmin`, `TenantUser`
- [ ] Create `RefreshToken` entity (optional, for refresh token storage):
  - Properties: `Id`, `UserId`, `Token`, `ExpiresAt`, `CreatedAt`

#### 1.2 Create Interfaces
- [ ] Create `IUserRepository` interface:
  - Methods: `GetByEmailAsync`, `GetByIdAsync`, `CreateAsync`, `UpdateAsync`, `DeleteAsync`, `ExistsAsync`
- [ ] Create `IAuthService` interface:
  - Methods: `RegisterAsync`, `LoginAsync`, `GenerateJwtToken`, `ValidateToken`, `HashPassword`, `VerifyPassword`

---

### 2. Backend: Application Layer ✅❌

#### 2.1 DTOs (Data Transfer Objects)
- [ ] Create `RegisterRequestDTO`:
  - Properties: `Email`, `Password`, `ConfirmPassword`, `FirstName`, `LastName`
- [ ] Create `LoginRequestDTO`:
  - Properties: `Email`, `Password`
- [ ] Create `LoginResponseDTO`:
  - Properties: `Token`, `RefreshToken`, `User` (UserDTO), `ExpiresAt`
- [ ] Create `UserDTO`:
  - Properties: `Id`, `Email`, `FirstName`, `LastName`, `Role`, `TenantId`

#### 2.2 Validators (FluentValidation)
- [ ] Create `RegisterRequestValidator`:
  - Email: Required, valid email format
  - Password: Required, min 8 characters, complexity rules
  - ConfirmPassword: Must match Password
  - FirstName/LastName: Required, max length 50
- [ ] Create `LoginRequestValidator`:
  - Email: Required, valid format
  - Password: Required

#### 2.3 Commands & Queries (CQRS pattern)
- [ ] Create `RegisterCommand`:
  - Handler: `RegisterCommandHandler`
  - Logic: Validate input → Check if email exists → Hash password → Create user → Return success
- [ ] Create `LoginQuery`:
  - Handler: `LoginQueryHandler`
  - Logic: Validate credentials → Verify password → Generate JWT → Return token + user info

#### 2.4 Auth Service
- [ ] Create `AuthService` class in `SiteCraft.Application/Services/`:
  - Implement `IAuthService`
  - Methods:
    - `HashPassword(string password)` — Use BCrypt or PBKDF2
    - `VerifyPassword(string password, string hash)` — Compare hashed passwords
    - `GenerateJwtToken(User user)` — Create JWT with claims (UserId, Email, Role, TenantId)
    - `ValidateToken(string token)` — Verify JWT signature & expiration

---

### 3. Backend: Infrastructure Layer ✅❌

#### 3.1 Repository Implementation
- [ ] Create `UserRepository` in `SiteCraft.Infrastructure/Repositories/`:
  - Implement `IUserRepository`
  - Use EF Core for database operations
  - Apply global `TenantId` filter (except for SuperAdmin users)

#### 3.2 Database Configuration
- [ ] Create `UserConfiguration` in `Infrastructure/Data/Configurations/`:
  - Configure table name: `Users`
  - Set indexes: `Email` (unique per tenant), `TenantId`
  - Set constraints: Email required, PasswordHash required
  - Configure relationships: `User` → `Tenant` (many-to-one)

#### 3.3 JWT Configuration
- [ ] Add JWT settings to `appsettings.json`:
  ```json
  "JwtSettings": {
    "SecretKey": "your-256-bit-secret-key-here",
    "Issuer": "SiteCraft",
    "Audience": "SiteCraft-Users",
    "ExpirationMinutes": 60
  }
  ```
- [ ] Create `JwtSettings` class to bind configuration
- [ ] Register JWT authentication in `Program.cs`:
  - Add `AddAuthentication()` with JWT Bearer scheme
  - Configure token validation parameters

---

### 4. Backend: API Layer ✅❌

#### 4.1 Auth Controller
- [ ] Create `AuthController` in `SiteCraft.API/Controllers/`:
  - Route: `/api/v1/auth`
  - Endpoints:
    - `POST /register` — Register new user (creates tenant if first user)
    - `POST /login` — Login and get JWT token
    - `POST /logout` — Invalidate token (optional, stateless JWT)
    - `GET /me` — Get current user info (protected endpoint)

#### 4.2 Endpoint: Register
- [ ] Accept `RegisterRequestDTO`
- [ ] Validate input using FluentValidation
- [ ] Check if email already exists (scoped to tenant)
- [ ] Hash password
- [ ] Create user record in database
- [ ] Return success response (201 Created)

#### 4.3 Endpoint: Login
- [ ] Accept `LoginRequestDTO`
- [ ] Retrieve user by email
- [ ] Verify password hash
- [ ] Generate JWT token with claims:
  - `sub` (user ID)
  - `email`
  - `role`
  - `tenant_id`
- [ ] Return `LoginResponseDTO` with token

#### 4.4 Endpoint: Get Current User
- [ ] Require `[Authorize]` attribute
- [ ] Extract user ID from JWT claims
- [ ] Fetch user from database
- [ ] Return `UserDTO`

#### 4.5 Middleware: Tenant Resolution
- [ ] Create `MultiTenantMiddleware`:
  - Extract subdomain from `Host` header (e.g., `acme.sitecraft.com`)
  - Resolve `TenantId` from `Tenants` table by subdomain
  - Store `TenantId` in `HttpContext.Items`
  - If tenant not found, return 404 or redirect to main site
- [ ] Register middleware in `Program.cs`

#### 4.6 Middleware: Exception Handling
- [ ] Create `ExceptionMiddleware`:
  - Catch all unhandled exceptions
  - Log errors with Serilog
  - Return standardized error response JSON
- [ ] Register middleware in `Program.cs`

---

### 5. Frontend: Auth Context & State ✅❌

#### 5.1 Create Auth Context
- [ ] Create `src/contexts/AuthContext.tsx`:
  - State: `user`, `token`, `isAuthenticated`, `isLoading`
  - Methods: `login`, `logout`, `register`, `checkAuth`
- [ ] Wrap app with `<AuthProvider>` in `App.tsx`

#### 5.2 API Client Setup
- [ ] Create `src/services/authService.ts`:
  - `register(data: RegisterRequestDTO)` → POST `/api/v1/auth/register`
  - `login(data: LoginRequestDTO)` → POST `/api/v1/auth/login`
  - `logout()` → Clear local storage
  - `getCurrentUser()` → GET `/api/v1/auth/me`
- [ ] Configure Axios interceptor to add `Authorization: Bearer {token}` header

---

### 6. Frontend: Auth Pages ✅❌

#### 6.1 Login Page
- [ ] Create `src/pages/Login.tsx`:
  - Form fields: Email, Password
  - Use `react-hook-form` + `yup` for validation
  - On submit: Call `authService.login(data)`
  - On success: Store token in localStorage, redirect to dashboard
  - On error: Display error message
- [ ] Style with Tailwind CSS (dark theme + gold accents)

#### 6.2 Register Page
- [ ] Create `src/pages/Register.tsx`:
  - Form fields: Email, Password, Confirm Password, First Name, Last Name
  - Validation: Email format, password strength, passwords match
  - On submit: Call `authService.register(data)`
  - On success: Auto-login or redirect to login page
- [ ] Include link to login page for existing users

#### 6.3 Protected Route Component
- [ ] Create `src/components/ProtectedRoute.tsx`:
  - Check if user is authenticated (from AuthContext)
  - If not authenticated: Redirect to `/login`
  - If authenticated: Render child components
- [ ] Wrap all protected pages (Dashboard, Templates, etc.) with `<ProtectedRoute>`

---

### 7. Frontend: Auth Flow Integration ✅❌

#### 7.1 Routing Setup
- [ ] Configure React Router in `App.tsx`:
  - Public routes: `/login`, `/register`
  - Protected routes: `/dashboard`, `/templates`, `/builder`, etc.
  - Redirect `/` to `/dashboard` if authenticated, else `/login`

#### 7.2 Token Persistence
- [ ] Store JWT token in `localStorage` (or secure httpOnly cookie)
- [ ] On app load: Check if token exists → Validate → Auto-login
- [ ] On logout: Remove token from storage

#### 7.3 Token Expiration Handling
- [ ] Add Axios response interceptor:
  - If 401 response: Token expired → Logout user → Redirect to `/login`
  - Show "Session expired" notification

---

### 8. Testing ✅❌

#### 8.1 Backend Unit Tests
- [ ] Test `AuthService.HashPassword()` and `VerifyPassword()`
- [ ] Test `AuthService.GenerateJwtToken()` creates valid token
- [ ] Test `RegisterCommandHandler` creates user successfully
- [ ] Test `LoginQueryHandler` returns correct response
- [ ] Test password mismatch returns error

#### 8.2 Backend Integration Tests
- [ ] Test `POST /api/v1/auth/register` endpoint:
  - Valid data → 201 Created
  - Duplicate email → 400 Bad Request
  - Invalid email → 400 Bad Request
- [ ] Test `POST /api/v1/auth/login` endpoint:
  - Valid credentials → 200 OK + JWT token
  - Invalid credentials → 401 Unauthorized
- [ ] Test `GET /api/v1/auth/me` endpoint:
  - Valid token → 200 OK + user data
  - Invalid token → 401 Unauthorized

#### 8.3 Frontend Unit Tests
- [ ] Test Login form validation (empty fields, invalid email)
- [ ] Test Register form validation (passwords don't match)
- [ ] Test AuthContext state updates correctly on login/logout

#### 8.4 E2E Tests (Optional)
- [ ] Test full registration flow: Fill form → Submit → Redirect to dashboard
- [ ] Test login → Logout flow
- [ ] Test protected route redirects to login if not authenticated

---

## Acceptance Criteria

- ✅ User can register a new account via frontend
- ✅ User can login with email + password and receive JWT token
- ✅ Protected routes require authentication
- ✅ Token includes correct claims (user ID, email, role, tenant ID)
- ✅ Passwords are hashed (never stored plain text)
- ✅ Invalid credentials return proper error messages
- ✅ Multi-tenant isolation works (users can only login to their tenant)
- ✅ All auth endpoints return standardized JSON responses
- ✅ Frontend displays validation errors correctly
- ✅ Logout clears token and redirects to login

---

## Security Checklist

- [ ] Passwords hashed with BCrypt/PBKDF2 (NOT MD5 or SHA1)
- [ ] JWT secret key is strong (256-bit minimum)
- [ ] Token expiration set (60 minutes default)
- [ ] HTTPS enforced in production
- [ ] CORS configured to allow only trusted origins
- [ ] SQL injection prevented (EF Core parameterized queries)
- [ ] Input validation on all fields
- [ ] Rate limiting on login endpoint (prevent brute force)
- [ ] No sensitive data in JWT payload (no passwords, no PII)

---

## Dependencies

**Blocks:**
- All feature development (templates, builder, domains, billing)

**Blocked By:**
- Phase 6: Environment Setup (must be complete)
- Phase 6: Database Schema (User table must exist)

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| JWT secret leaked | Low | Critical | Store in environment variables, rotate periodically |
| Weak password policy | Medium | High | Enforce min 8 chars, complexity, use zxcvbn for strength meter |
| Session fixation | Low | Medium | Use stateless JWT, implement logout token blacklist if needed |
| Multi-tenant isolation broken | Low | Critical | Always test queries include TenantId filter |

---

## Notes

- **Do NOT** store JWT tokens in localStorage if XSS is a concern — use httpOnly cookies
- Implement **refresh tokens** for longer sessions (Phase 7+)
- Add **2FA** in future phase for enhanced security
- Consider **OAuth2/OIDC** for third-party login (Google, Microsoft) in Phase 9+

---

**Last Updated:** February 9, 2026  
**Next Phase:** Template Gallery & Visual Builder
