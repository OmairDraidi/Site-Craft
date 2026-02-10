# Phase 1 – System Analysis (SiteCraft)

## 1. System Overview
SiteCraft is a multi-tenant platform that allows creating ready-made, customizable websites for clients.  
Each client (tenant) gets a themed website template with modules such as courses, blog, store, and booking.

---

## 2. Actors
- **Super Admin** – manages tenants, templates, plans, billing.
- **Tenant Admin** – customizes site branding, activates modules, manages content.
- **Tenant Staff / Instructor** – manages courses, lessons, content.
- **End User** – browses site, registers, buys courses/services.
- **Payment Gateway**
- **External Integrations** – Zoom, Telegram, WhatsApp, Email.

---

## 3. High-Level Modules
- Tenant & Subscription Management  
- Templates & Theme Engine  
- Site Builder (Pages, Layouts, Menus)  
- Courses & Lessons Module  
- Blog Module  
- Store Module  
- Booking Module  
- Analytics & Reports  
- Integrations Layer  

---

## 4. Use Case Diagram
```mermaid
flowchart LR
    subgraph Actors
        SA[Super Admin]
        TA[Tenant Admin]
        TS[Tenant Staff / Instructor]
        EU[End User]
        PG[Payment Gateway]
    end

    subgraph System[SiteCraft]
        UC1((Manage Tenants))
        UC2((Manage Templates))
        UC3((Manage Plans & Billing))
        UC4((Setup Tenant Site))
        UC5((Customize Branding))
        UC6((Manage Modules & Content))
        UC7((Manage Users & Roles))
        UC8((Browse Site & Enroll))
        UC9((Process Payment))
        UC10((Access Course / Services))
        UC11((View Analytics))
    end

    SA --> UC1
    SA --> UC2
    SA --> UC3

    TA --> UC4
    TA --> UC5
    TA --> UC6
    TA --> UC7
    TA --> UC11

    TS --> UC6
    TS --> UC11

    EU --> UC8
    EU --> UC10

    UC8 --> UC9
    PG --> UC9
```

---

## 5. Activity Diagram – Tenant Onboarding
```mermaid
flowchart TD
    A[Super Admin/Sign-up Tenant] --> B[Create Tenant Record]
    B --> C[Assign Plan & Limits]
    C --> D[Generate Subdomain]
    D --> E[Initialize Default Settings]
    E --> F[Send Admin Invitation]

    F --> G[Tenant Admin Opens Onboarding]
    G --> H[Select Template]
    H --> I[Upload Logo & Choose Colors]
    I --> J[Set Basic Pages]
    J --> K[Enable Modules]
    K --> L[Connect Domain Optional]
    L --> M[Finish Setup]
    M --> N[Site Goes Live]
```

---

## 6. Sequence Diagram – Course Enrollment
```mermaid
sequenceDiagram
    participant EU as End User
    participant Site as Tenant Site
    participant API as SiteCraft API
    participant PG as Payment Gateway
    participant DB as Database

    EU->>Site: Browse Courses
    Site->>API: GET /courses
    API->>DB: Query
    DB-->>API: Courses list
    API-->>Site: Render
    EU->>Site: Click Enroll
    Site->>API: POST /orders
    API->>DB: Create order
    API-->>Site: Payment URL
    Site->>EU: Redirect to PG

    EU->>PG: Pay
    PG-->>API: Webhook payment success
    API->>DB: Update order
    API->>DB: Grant Access
    Site-->>EU: Enrollment Successful
```

---

## 7. ERD (Entity Relationship Diagram)
```mermaid
erDiagram
    %% Core Multi-tenancy
    TENANT ||--o{ USER : has
    TENANT ||--o{ SITE : owns
    TENANT ||--o{ SUBSCRIPTION : has
    TENANT ||--|| PLAN : "current plan"
    TENANT }o--|| TEMPLATE : uses
    TENANT ||--o{ TENANT_MODULE : enables
    
    PLAN ||--o{ SUBSCRIPTION : "used in"
    
    TENANT_MODULE }o--|| TENANT : "belongs to"
    TENANT_MODULE }o--|| MODULE : "references"
    
    %% Site & Content Management
    SITE ||--o{ PAGE : contains
    SITE ||--o{ MENU : has
    MENU ||--o{ MENU_ITEM : contains
    
    %% Course Module
    TENANT ||--o{ COURSE : offers
    COURSE ||--o{ LESSON : contains
    COURSE ||--o{ ENROLLMENT : "enrolled by"
    USER ||--o{ ENROLLMENT : enrolls
    LESSON }o--|| COURSE : "belongs to"
    
    %% Blog Module
    TENANT ||--o{ BLOG_POST : publishes
    TENANT ||--o{ BLOG_CATEGORY : has
    BLOG_POST }o--|| BLOG_CATEGORY : "categorized in"
    BLOG_POST }o--|| USER : "authored by"
    
    %% Store Module
    TENANT ||--o{ PRODUCT : sells
    TENANT ||--o{ PRODUCT_CATEGORY : has
    PRODUCT }o--|| PRODUCT_CATEGORY : "categorized in"
    
    %% Booking Module
    TENANT ||--o{ BOOKING : manages
    TENANT ||--o{ BOOKING_SLOT : defines
    BOOKING }o--|| BOOKING_SLOT : "reserves"
    BOOKING }o--|| USER : "booked by"
    
    %% Orders & Payments
    TENANT ||--o{ ORDER : receives
    ORDER }o--|| USER : "placed by"
    ORDER ||--o{ ORDER_ITEM : contains
    ORDER ||--o{ PAYMENT : "paid via"
    
    ORDER_ITEM }o--|| COURSE : "references"
    ORDER_ITEM }o--|| PRODUCT : "references"

    %% Entity Definitions
    USER {
        uuid id PK
        uuid tenant_id FK
        string name
        string email
        string password_hash
        string role
        string phone
        datetime created_at
        datetime updated_at
    }

    TENANT {
        uuid id PK
        string name
        string subdomain
        string custom_domain
        string status
        uuid owner_user_id FK
        uuid current_plan_id FK
        datetime created_at
        datetime updated_at
    }

    TEMPLATE {
        uuid id PK
        string name
        string type
        text description
        boolean is_public
        jsonb default_settings
        datetime created_at
    }

    SITE {
        uuid id PK
        uuid tenant_id FK
        uuid template_id FK
        string title
        string logo_url
        string favicon_url
        string primary_color
        string secondary_color
        string language
        jsonb settings
        datetime created_at
        datetime updated_at
    }

    MODULE {
        uuid id PK
        string code
        string name
        text description
        boolean is_core
        decimal price_monthly
        datetime created_at
    }

    TENANT_MODULE {
        uuid id PK
        uuid tenant_id FK
        uuid module_id FK
        boolean is_active
        jsonb settings
        datetime activated_at
        datetime created_at
    }

    PLAN {
        uuid id PK
        string name
        string slug
        int max_users
        int max_courses
        int max_storage_mb
        int max_products
        boolean custom_domain_allowed
        decimal price_monthly
        decimal price_yearly
        datetime created_at
    }

    SUBSCRIPTION {
        uuid id PK
        uuid tenant_id FK
        uuid plan_id FK
        datetime start_date
        datetime end_date
        datetime trial_ends_at
        string status
        string billing_cycle
        datetime created_at
        datetime updated_at
    }

    COURSE {
        uuid id PK
        uuid tenant_id FK
        uuid instructor_id FK
        string title
        string slug
        text description
        text short_description
        string thumbnail_url
        decimal price
        string currency
        int duration_hours
        string level
        string status
        int enrolled_count
        datetime published_at
        datetime created_at
        datetime updated_at
    }

    LESSON {
        uuid id PK
        uuid course_id FK
        string title
        string slug
        text content
        string video_url
        int duration_minutes
        int order_index
        string type
        boolean is_free
        datetime created_at
        datetime updated_at
    }

    ENROLLMENT {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        datetime enrolled_at
        datetime completed_at
        int progress_percentage
        string status
        datetime last_accessed_at
        datetime created_at
    }

    PAGE {
        uuid id PK
        uuid site_id FK
        string title
        string slug
        text content
        string template
        boolean is_published
        int order_index
        datetime published_at
        datetime created_at
        datetime updated_at
    }

    MENU {
        uuid id PK
        uuid site_id FK
        string name
        string location
        datetime created_at
        datetime updated_at
    }

    MENU_ITEM {
        uuid id PK
        uuid menu_id FK
        uuid parent_id FK
        string label
        string url
        string type
        int order_index
        datetime created_at
    }

    BLOG_POST {
        uuid id PK
        uuid tenant_id FK
        uuid author_id FK
        uuid category_id FK
        string title
        string slug
        text content
        text excerpt
        string featured_image_url
        string status
        datetime published_at
        datetime created_at
        datetime updated_at
    }

    BLOG_CATEGORY {
        uuid id PK
        uuid tenant_id FK
        string name
        string slug
        text description
        datetime created_at
    }

    PRODUCT {
        uuid id PK
        uuid tenant_id FK
        uuid category_id FK
        string name
        string slug
        text description
        decimal price
        string currency
        int stock_quantity
        string sku
        string status
        jsonb images
        datetime created_at
        datetime updated_at
    }

    PRODUCT_CATEGORY {
        uuid id PK
        uuid tenant_id FK
        string name
        string slug
        text description
        datetime created_at
    }

    BOOKING {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid slot_id FK
        string customer_name
        string customer_email
        string customer_phone
        text notes
        string status
        datetime booked_at
        datetime created_at
        datetime updated_at
    }

    BOOKING_SLOT {
        uuid id PK
        uuid tenant_id FK
        string title
        text description
        datetime start_time
        datetime end_time
        int capacity
        int booked_count
        decimal price
        string status
        datetime created_at
    }

    ORDER {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        string order_number
        decimal subtotal
        decimal tax
        decimal total
        string currency
        string status
        datetime ordered_at
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid course_id FK
        uuid product_id FK
        string item_type
        string item_name
        int quantity
        decimal unit_price
        decimal total_price
        datetime created_at
    }

    PAYMENT {
        uuid id PK
        uuid order_id FK
        string payment_method
        string transaction_id
        decimal amount
        string currency
        string status
        text gateway_response
        datetime paid_at
        datetime created_at
    }
```

---

## 8. Class Diagram (Backend Perspective)
```mermaid
classDiagram
    %% Core Domain Models
    class Tenant {
        +UUID id
        +String name
        +String subdomain
        +String customDomain
        +String status
        +UUID ownerId
        +UUID currentPlanId
        +DateTime createdAt
        +createSite(templateId) Site
        +enableModule(moduleId) TenantModule
        +upgradePlan(planId) void
        +suspend() void
        +activate() void
        +delete() void
    }

    class User {
        +UUID id
        +UUID tenantId
        +String name
        +String email
        -String passwordHash
        +String role
        +String phone
        +DateTime createdAt
        +authenticate(password) Boolean
        +updateProfile(data) void
        +changePassword(newPassword) void
        +hasPermission(permission) Boolean
    }

    class Site {
        +UUID id
        +UUID tenantId
        +UUID templateId
        +String title
        +String logoUrl
        +String primaryColor
        +String secondaryColor
        +String language
        +JSON settings
        +updateBranding(data) void
        +addPage(pageData) Page
        +addMenu(menuData) Menu
        +publish() void
    }

    class Template {
        +UUID id
        +String name
        +String type
        +String description
        +Boolean isPublic
        +JSON defaultSettings
        +clone() Template
        +getPreview() String
    }

    class Module {
        +UUID id
        +String code
        +String name
        +String description
        +Boolean isCore
        +Decimal priceMonthly
        +isAvailableForPlan(planId) Boolean
    }

    class Plan {
        +UUID id
        +String name
        +String slug
        +Integer maxUsers
        +Integer maxCourses
        +Integer maxStorageMb
        +Decimal priceMonthly
        +Decimal priceYearly
        +canUpgradeTo(planId) Boolean
        +getFeatures() List
    }

    class Subscription {
        +UUID id
        +UUID tenantId
        +UUID planId
        +DateTime startDate
        +DateTime endDate
        +String status
        +String billingCycle
        +renew() void
        +cancel() void
        +isActive() Boolean
        +daysRemaining() Integer
    }

    class Course {
        +UUID id
        +UUID tenantId
        +UUID instructorId
        +String title
        +String slug
        +String description
        +Decimal price
        +String status
        +Integer enrolledCount
        +addLesson(lessonData) Lesson
        +publish() void
        +unpublish() void
        +updatePrice(newPrice) void
        +getEnrollments() List~Enrollment~
    }

    class Lesson {
        +UUID id
        +UUID courseId
        +String title
        +String content
        +String videoUrl
        +Integer durationMinutes
        +Integer orderIndex
        +Boolean isFree
        +reorder(newIndex) void
        +updateContent(content) void
    }

    class Enrollment {
        +UUID id
        +UUID userId
        +UUID courseId
        +DateTime enrolledAt
        +Integer progressPercentage
        +String status
        +updateProgress(percentage) void
        +complete() void
        +isCompleted() Boolean
    }

    class Order {
        +UUID id
        +UUID tenantId
        +UUID userId
        +String orderNumber
        +Decimal total
        +String status
        +addItem(item) OrderItem
        +calculateTotal() Decimal
        +process() void
        +cancel() void
    }

    class Payment {
        +UUID id
        +UUID orderId
        +String paymentMethod
        +String transactionId
        +Decimal amount
        +String status
        +process() Boolean
        +refund() Boolean
        +verify() Boolean
    }

    %% Service Layer
    class TenantService {
        -TenantRepository repo
        +createTenant(data) Tenant
        +setupTenant(tenantId, settings) void
        +suspendTenant(tenantId) void
        +deleteTenant(tenantId) void
        +getTenantBySubdomain(subdomain) Tenant
    }

    class CourseService {
        -CourseRepository repo
        +createCourse(tenantId, data) Course
        +publishCourse(courseId) void
        +enrollUser(userId, courseId) Enrollment
        +getCoursesForTenant(tenantId) List~Course~
        +updateProgress(enrollmentId, progress) void
    }

    class OrderService {
        -OrderRepository repo
        -PaymentService paymentService
        +createOrder(userId, items) Order
        +processPayment(orderId, paymentData) Payment
        +fulfillOrder(orderId) void
        +cancelOrder(orderId) void
    }

    class PaymentService {
        -PaymentGateway gateway
        +processPayment(order, method) Payment
        +verifyPayment(transactionId) Boolean
        +refundPayment(paymentId) Boolean
        +getPaymentStatus(paymentId) String
    }

    %% Relationships
    Tenant "1" --> "*" User : has
    Tenant "1" --> "1" Site : owns
    Tenant "1" --> "*" Subscription : has
    Tenant "1" --> "*" Course : offers
    Tenant "*" --> "1" Plan : subscribes
    Tenant "*" --> "1" Template : uses
    
    Site "1" --> "*" Page : contains
    Site "1" --> "*" Menu : has
    
    Course "1" --> "*" Lesson : contains
    Course "1" --> "*" Enrollment : has
    User "1" --> "*" Enrollment : enrolls
    
    Order "1" --> "*" OrderItem : contains
    Order "1" --> "1" Payment : paidVia
    User "1" --> "*" Order : places
    
    TenantService ..> Tenant : manages
    CourseService ..> Course : manages
    CourseService ..> Enrollment : manages
    OrderService ..> Order : manages
    OrderService ..> PaymentService : uses
    PaymentService ..> Payment : manages
```

---

## 9. State Diagrams

### 9.1 Tenant Lifecycle State Diagram
```mermaid
stateDiagram-v2
    [*] --> Pending: Tenant Created
    
    Pending --> Active: Admin Completes Setup
    Pending --> Cancelled: Setup Abandoned
    
    Active --> Suspended: Payment Failed / Violation
    Active --> Cancelled: Admin Cancels
    
    Suspended --> Active: Payment Resolved
    Suspended --> Cancelled: Grace Period Expired
    
    Cancelled --> [*]: Data Deleted After Retention
    
    note right of Pending
        Tenant record created
        Awaiting admin setup
    end note
    
    note right of Active
        Fully operational
        All features enabled
    end note
    
    note right of Suspended
        Read-only access
        Payment required
    end note
    
    note right of Cancelled
        30-day retention
        Then permanent deletion
    end note
```

### 9.2 Subscription Lifecycle State Diagram
```mermaid
stateDiagram-v2
    [*] --> Trial: New Subscription
    
    Trial --> Active: Payment Successful
    Trial --> Expired: Trial Period Ends
    
    Active --> Expired: Subscription Ends
    Active --> Cancelled: User Cancels
    
    Expired --> Renewed: Payment Successful
    Expired --> Cancelled: Not Renewed
    
    Cancelled --> [*]: Subscription Terminated
    Renewed --> Active: Subscription Extended
    
    note right of Trial
        14-day free trial
        Limited features
    end note
    
    note right of Active
        Full access
        Auto-renewal enabled
    end note
    
    note right of Expired
        Grace period: 7 days
        Read-only access
    end note
    
    note right of Renewed
        Payment processed
        Extending subscription
    end note
```

---

## 10. Additional Sequence Diagrams

### 10.1 Tenant Setup Flow
```mermaid
sequenceDiagram
    participant SA as Super Admin
    participant API as SiteCraft API
    participant DB as Database
    participant Email as Email Service
    participant TA as Tenant Admin

    SA->>API: POST /tenants (create tenant)
    API->>DB: Create tenant record
    API->>DB: Assign default plan
    DB-->>API: Tenant created
    
    API->>API: Generate subdomain
    API->>DB: Initialize default settings
    API->>DB: Create admin user
    
    API->>Email: Send invitation email
    Email-->>TA: Invitation received
    
    TA->>API: Click setup link
    API-->>TA: Show onboarding wizard
    
    TA->>API: Select template
    TA->>API: Upload branding
    TA->>API: Configure modules
    TA->>API: Complete setup
    
    API->>DB: Update tenant status to Active
    API->>DB: Publish site
    DB-->>API: Site live
    API-->>TA: Setup complete notification
```

### 10.2 Module Activation Flow
```mermaid
sequenceDiagram
    participant TA as Tenant Admin
    participant UI as Admin Dashboard
    participant API as SiteCraft API
    participant DB as Database
    participant Module as Module Service

    TA->>UI: Navigate to Modules
    UI->>API: GET /modules/available
    API->>DB: Query available modules
    DB-->>API: Module list
    API-->>UI: Display modules
    
    TA->>UI: Click "Activate Module"
    UI->>API: POST /tenant/modules/activate
    
    API->>DB: Check tenant plan limits
    DB-->>API: Plan details
    
    alt Plan allows module
        API->>Module: Initialize module
        Module->>DB: Create default settings
        Module->>DB: Create default data
        Module-->>API: Module ready
        
        API->>DB: Update tenant_modules
        DB-->>API: Module activated
        API-->>UI: Success message
        UI-->>TA: Module activated
    else Plan doesn't allow
        API-->>UI: Upgrade required
        UI-->>TA: Show upgrade prompt
    end
```

---

## 11. Component Diagram
```mermaid
graph TB
    subgraph "Client Layer"
        TenantSite[Tenant Website]
        AdminDash[Admin Dashboard]
        SuperAdminDash[Super Admin Dashboard]
    end
    
    subgraph "CDN & Load Balancer"
        CDN[CDN - Static Assets]
        LB[Load Balancer]
    end
    
    subgraph "API Gateway Layer"
        Gateway[API Gateway]
        Auth[Authentication Service]
        RateLimit[Rate Limiter]
    end
    
    subgraph "Application Services"
        TenantSvc[Tenant Service]
        UserSvc[User Service]
        CourseSvc[Course Service]
        BlogSvc[Blog Service]
        StoreSvc[Store Service]
        BookingSvc[Booking Service]
        OrderSvc[Order Service]
        PaymentSvc[Payment Service]
        AnalyticsSvc[Analytics Service]
    end
    
    subgraph "Data Layer"
        PrimaryDB[(Primary Database)]
        ReplicaDB[(Read Replica)]
        Cache[(Redis Cache)]
        FileStorage[File Storage S3]
    end
    
    subgraph "External Services"
        PaymentGW[Payment Gateway]
        EmailSvc[Email Service]
        ZoomAPI[Zoom API]
        WhatsApp[WhatsApp API]
    end
    
    subgraph "Background Jobs"
        Queue[Job Queue]
        Worker[Background Workers]
    end
    
    %% Client connections
    TenantSite --> CDN
    TenantSite --> LB
    AdminDash --> LB
    SuperAdminDash --> LB
    
    %% Load balancer to gateway
    LB --> Gateway
    CDN --> FileStorage
    
    %% Gateway to auth and services
    Gateway --> Auth
    Gateway --> RateLimit
    Gateway --> TenantSvc
    Gateway --> UserSvc
    Gateway --> CourseSvc
    Gateway --> BlogSvc
    Gateway --> StoreSvc
    Gateway --> BookingSvc
    Gateway --> OrderSvc
    
    %% Service dependencies
    OrderSvc --> PaymentSvc
    PaymentSvc --> PaymentGW
    TenantSvc --> EmailSvc
    CourseSvc --> ZoomAPI
    
    %% Data layer connections
    TenantSvc --> Cache
    TenantSvc --> PrimaryDB
    UserSvc --> Cache
    UserSvc --> PrimaryDB
    CourseSvc --> PrimaryDB
    BlogSvc --> PrimaryDB
    StoreSvc --> PrimaryDB
    BookingSvc --> PrimaryDB
    OrderSvc --> PrimaryDB
    PaymentSvc --> PrimaryDB
    AnalyticsSvc --> ReplicaDB
    
    %% File storage
    CourseSvc --> FileStorage
    BlogSvc --> FileStorage
    StoreSvc --> FileStorage
    
    %% Background jobs
    TenantSvc --> Queue
    OrderSvc --> Queue
    PaymentSvc --> Queue
    Queue --> Worker
    Worker --> EmailSvc
    Worker --> WhatsApp
```

---

## 12. Deployment Diagram
```mermaid
graph TB
    subgraph "User Devices"
        Browser[Web Browser]
        Mobile[Mobile Device]
    end
    
    subgraph "Cloud Infrastructure - AWS/Azure"
        subgraph "Edge Layer"
            CloudFront[CloudFront CDN]
            Route53[Route53 DNS]
        end
        
        subgraph "Load Balancing"
            ALB[Application Load Balancer]
        end
        
        subgraph "Application Tier - Auto Scaling Group"
            WebServer1[Web Server 1<br/>Node.js/PHP]
            WebServer2[Web Server 2<br/>Node.js/PHP]
            WebServer3[Web Server 3<br/>Node.js/PHP]
        end
        
        subgraph "Database Tier"
            RDS_Primary[(RDS Primary<br/>PostgreSQL)]
            RDS_Replica[(RDS Replica<br/>Read-Only)]
        end
        
        subgraph "Cache Layer"
            Redis1[(Redis Primary)]
            Redis2[(Redis Replica)]
        end
        
        subgraph "Storage"
            S3[S3 Bucket<br/>Files & Media]
        end
        
        subgraph "Background Processing"
            SQS[SQS Queue]
            Lambda[Lambda Functions]
            EC2_Worker[EC2 Worker Instances]
        end
        
        subgraph "Monitoring & Logging"
            CloudWatch[CloudWatch]
            ELK[ELK Stack<br/>Logs]
        end
    end
    
    subgraph "External Services"
        Stripe[Stripe Payment]
        SendGrid[SendGrid Email]
        Zoom[Zoom API]
        Twilio[Twilio SMS/WhatsApp]
    end
    
    %% User connections
    Browser --> Route53
    Mobile --> Route53
    Route53 --> CloudFront
    CloudFront --> ALB
    
    %% Load balancer to servers
    ALB --> WebServer1
    ALB --> WebServer2
    ALB --> WebServer3
    
    %% Servers to database
    WebServer1 --> RDS_Primary
    WebServer2 --> RDS_Primary
    WebServer3 --> RDS_Primary
    
    WebServer1 --> RDS_Replica
    WebServer2 --> RDS_Replica
    WebServer3 --> RDS_Replica
    
    %% Servers to cache
    WebServer1 --> Redis1
    WebServer2 --> Redis1
    WebServer3 --> Redis1
    Redis1 -.Replication.-> Redis2
    
    %% Servers to storage
    WebServer1 --> S3
    WebServer2 --> S3
    WebServer3 --> S3
    CloudFront --> S3
    
    %% Background jobs
    WebServer1 --> SQS
    WebServer2 --> SQS
    WebServer3 --> SQS
    SQS --> Lambda
    SQS --> EC2_Worker
    
    %% Database replication
    RDS_Primary -.Replication.-> RDS_Replica
    
    %% External services
    WebServer1 --> Stripe
    WebServer2 --> Stripe
    WebServer3 --> Stripe
    Lambda --> SendGrid
    EC2_Worker --> SendGrid
    WebServer1 --> Zoom
    Lambda --> Twilio
    
    %% Monitoring
    WebServer1 --> CloudWatch
    WebServer2 --> CloudWatch
    WebServer3 --> CloudWatch
    RDS_Primary --> CloudWatch
    WebServer1 --> ELK
    WebServer2 --> ELK
    WebServer3 --> ELK
```

---

## 13. Multi-tenancy Strategy

### 13.1 Data Isolation Approach
**Strategy:** Shared Database with Tenant Isolation via `tenant_id`

**Rationale:**
- **Cost-effective:** Single database infrastructure for all tenants
- **Easier maintenance:** Schema changes applied once
- **Better resource utilization:** Shared connection pooling
- **Scalability:** Can migrate to separate databases if needed

**Implementation:**
- Every table includes `tenant_id` column (indexed)
- Row-Level Security (RLS) policies enforce data isolation
- Application middleware validates tenant context on every query
- Database views provide tenant-scoped access

### 13.2 Subdomain Routing
**Mechanism:**
```
tenant1.edusite.com → Tenant ID: uuid-1
tenant2.edusite.com → Tenant ID: uuid-2
custom-domain.com → Tenant ID: uuid-3 (custom domain)
```

**Implementation:**
1. DNS wildcard record: `*.edusite.com → Load Balancer`
2. Middleware extracts subdomain from request
3. Lookup tenant by subdomain in cache (Redis)
4. Set tenant context for request lifecycle
5. All queries automatically filtered by `tenant_id`

### 13.3 Resource Limits & Quotas
**Enforcement Points:**
- **Storage:** File upload middleware checks `current_storage < plan.max_storage_mb`
- **Users:** User creation validates `user_count < plan.max_users`
- **Courses:** Course creation validates `course_count < plan.max_courses`
- **API Rate Limiting:** Per-tenant rate limits based on plan tier

**Monitoring:**
- Background jobs calculate resource usage daily
- Alerts sent when approaching 80% of limits
- Hard limits enforced at application layer

### 13.4 Data Migration & Backup
**Backup Strategy:**
- **Full database backup:** Daily at 2 AM UTC
- **Per-tenant backup:** On-demand export via admin dashboard
- **Retention:** 30 days for active tenants, 90 days for cancelled

**Migration:**
- Export tenant data as SQL dump with `tenant_id` filter
- Import to new database instance if scaling required
- Zero-downtime migration using read replicas

---

## 14. Non-Functional Requirements

### 14.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 2 seconds | 95th percentile |
| API Response Time | < 500ms | Average |
| Database Query Time | < 100ms | 95th percentile |
| Concurrent Users per Tenant | 1,000+ | Load testing |
| System-wide Concurrent Users | 50,000+ | Load testing |

**Optimization Strategies:**
- Redis caching for frequently accessed data (tenant settings, user sessions)
- CDN for static assets (images, CSS, JS)
- Database query optimization with proper indexes
- Lazy loading for large datasets
- Image optimization and compression

### 14.2 Security

#### Authentication & Authorization
- **Password Policy:** Minimum 8 characters, complexity requirements
- **Multi-Factor Authentication (MFA):** Optional for tenant admins
- **Session Management:** JWT tokens with 24-hour expiry
- **Role-Based Access Control (RBAC):** Super Admin, Tenant Admin, Instructor, User

#### Data Protection
- **Encryption at Rest:** AES-256 for database and file storage
- **Encryption in Transit:** TLS 1.3 for all connections
- **PII Protection:** GDPR-compliant data handling
- **Password Storage:** Bcrypt hashing with salt

#### Application Security
- **SQL Injection Prevention:** Parameterized queries, ORM usage
- **XSS Protection:** Input sanitization, Content Security Policy (CSP)
- **CSRF Protection:** CSRF tokens for state-changing operations
- **API Security:** Rate limiting, API key authentication
- **File Upload Security:** File type validation, virus scanning

#### Compliance
- **GDPR:** Right to access, right to deletion, data portability
- **PCI DSS:** Payment data handled by certified gateway (Stripe)
- **Data Retention:** Configurable per tenant, default 90 days after cancellation

### 14.3 Scalability

#### Horizontal Scaling
- **Application Servers:** Auto-scaling group (3-10 instances)
- **Database:** Read replicas for analytics and reporting
- **Cache:** Redis cluster with replication
- **Background Jobs:** Multiple worker instances

#### Vertical Scaling
- **Database:** Upgrade instance size as needed
- **Cache:** Increase memory allocation
- **File Storage:** Unlimited S3 storage

#### Load Distribution
- **Geographic Distribution:** Multi-region deployment (future)
- **CDN:** CloudFront for global content delivery
- **Database Sharding:** By tenant_id if single DB becomes bottleneck

### 14.4 Availability & Reliability

| Metric | Target |
|--------|--------|
| Uptime SLA | 99.9% (8.76 hours downtime/year) |
| Recovery Time Objective (RTO) | < 1 hour |
| Recovery Point Objective (RPO) | < 15 minutes |
| Mean Time to Recovery (MTTR) | < 30 minutes |

**High Availability Measures:**
- **Load Balancer:** Health checks, automatic failover
- **Database:** Multi-AZ deployment with automatic failover
- **Backups:** Automated daily backups with point-in-time recovery
- **Monitoring:** 24/7 uptime monitoring with alerts
- **Disaster Recovery:** Cross-region backup replication

### 14.5 Maintainability

**Code Quality:**
- **Code Reviews:** Mandatory for all changes
- **Testing:** Unit tests (80%+ coverage), integration tests, E2E tests
- **Documentation:** API documentation (OpenAPI/Swagger)
- **Code Standards:** ESLint, Prettier, PSR-12 (PHP)

**Monitoring & Logging:**
- **Application Logs:** Centralized logging (ELK Stack)
- **Error Tracking:** Sentry for exception monitoring
- **Performance Monitoring:** New Relic / DataDog
- **Metrics:** Prometheus + Grafana dashboards

**Deployment:**
- **CI/CD Pipeline:** GitHub Actions / GitLab CI
- **Blue-Green Deployment:** Zero-downtime deployments
- **Rollback Strategy:** Automated rollback on failure
- **API Versioning:** `/api/v1/`, `/api/v2/` for backward compatibility

### 14.6 Usability

**User Experience:**
- **Responsive Design:** Mobile-first approach
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Internationalization (i18n):** Multi-language support
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)

**Admin Experience:**
- **Onboarding:** Step-by-step wizard for tenant setup
- **Documentation:** Comprehensive user guides and video tutorials
- **Support:** In-app chat support, knowledge base
- **Analytics:** Dashboard with key metrics and insights

---

## End of Phase 1

This comprehensive system analysis document contains:

### Core Analysis
- **System Overview** – Multi-tenant SaaS platform description
- **Actors** – All system stakeholders identified
- **High-Level Modules** – Complete module breakdown

### UML Diagrams
- **Use Case Diagram** – Actor interactions with system
- **Activity Diagram** – Tenant onboarding workflow
- **Sequence Diagrams** – Course enrollment, tenant setup, module activation flows
- **State Diagrams** – Tenant and subscription lifecycle states
- **Class Diagram** – Complete domain model with service layer
- **Component Diagram** – System architecture and dependencies
- **Deployment Diagram** – Infrastructure and cloud deployment

### Data Architecture
- **ERD (Entity Relationship Diagram)** – 20+ entities covering:
  - Core multi-tenancy (Tenant, User, Site, Plan, Subscription)
  - Course module (Course, Lesson, Enrollment)
  - Blog module (BlogPost, BlogCategory)
  - Store module (Product, ProductCategory)
  - Booking module (Booking, BookingSlot)
  - Orders & Payments (Order, OrderItem, Payment)
  - Content management (Page, Menu, MenuItem)

### Technical Specifications
- **Multi-tenancy Strategy** – Shared database with tenant isolation
- **Non-Functional Requirements** – Performance, security, scalability, availability
- **Security Considerations** – Authentication, encryption, compliance (GDPR, PCI DSS)
- **Deployment Architecture** – AWS/Azure cloud infrastructure with auto-scaling

### Document Statistics
- **Total Sections:** 14
- **Total Diagrams:** 12 (Mermaid-based)
- **Total Entities:** 20+
- **Total Classes:** 15+
- **Lines of Documentation:** 1,200+

**Status:** ✅ Ready for Phase 2 (System Design & API Specification)

