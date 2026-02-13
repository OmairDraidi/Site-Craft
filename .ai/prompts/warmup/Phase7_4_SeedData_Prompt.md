# SiteCraft — Phase 7.4: Seed Data

@Phase7_TemplateEngine_Prompt.md

---

## السياق:

- **المرحلة الحالية:** Phase 7.4 - Seed Data (Backend)
- **الـ Status السابق:**
  - Phase 7.1 مكتمل ✅ (Database & Entities)
  - Phase 7.2 مكتمل ✅ (Repository & Service Layer)
  - Phase 7.3 مكتمل ✅ (API Endpoints + Validators)
- **التالي:** إنشاء 5 قوالب افتراضية + Seed logic

---

## المهمة:

إنشاء **5 Default Templates** جاهزة للاستخدام مع بيانات واقعية وجذابة.

### القوالب المطلوبة:

#### 1. **Educational Template** 🎓
- **Category:** Education
- **Name:** "Academic Excellence"
- **Description:** "Perfect for schools, universities, and online courses. Features course listings, faculty profiles, and student testimonials."
- **IsPremium:** false (Free)
- **Sections:**
  - Hero (Welcome message + CTA)
  - Courses Grid (Featured courses)
  - Testimonials (Student reviews)
  - Contact Form
  - Footer

#### 2. **Services Template** 💼
- **Category:** Services
- **Name:** "Professional Services"
- **Description:** "Ideal for consulting firms, agencies, and service providers. Showcases your expertise and builds trust."
- **IsPremium:** false (Free)
- **Sections:**
  - Hero (Value proposition)
  - Services Cards (What we offer)
  - About Section (Company story)
  - Contact Form
  - Footer

#### 3. **Store Lite Template** 🛒
- **Category:** Store
- **Name:** "E-Commerce Starter"
- **Description:** "Simple and elegant online store template. Perfect for small businesses starting their e-commerce journey."
- **IsPremium:** true (Premium)
- **Sections:**
  - Hero (Featured products)
  - Products Grid (All products)
  - Shopping Cart (Basic cart)
  - Checkout Form
  - Footer

#### 4. **Portfolio Template** 🎨
- **Category:** Portfolio
- **Name:** "Creative Showcase"
- **Description:** "Stunning portfolio template for designers, photographers, and creative professionals. Let your work speak."
- **IsPremium:** false (Free)
- **Sections:**
  - Hero (Your name + tagline)
  - Projects Grid (Portfolio items)
  - About Me (Bio + skills)
  - Contact Form
  - Footer

#### 5. **Coach Template** 🏋️
- **Category:** Services
- **Name:** "Personal Coach Pro"
- **Description:** "Designed for coaches, trainers, and consultants. Highlight your programs and convert visitors to clients."
- **IsPremium:** true (Premium)
- **Sections:**
  - Hero (Your expertise)
  - Programs/Packages (Offerings)
  - Testimonials (Client success)
  - Booking Form (Appointment)
  - Footer

---

## المتطلبات التقنية:

### 1. **Template JSON Structure**

كل قالب يجب أن يحتوي على:

```json
{
  "version": "1.0",
  "pages": [
    {
      "slug": "home",
      "title": "Home",
      "sections": [
        {
          "type": "hero",
          "props": {
            "title": "Welcome to Academic Excellence",
            "subtitle": "Empowering minds, shaping futures",
            "backgroundImage": "https://images.unsplash.com/photo-education",
            "ctaText": "Explore Courses",
            "ctaLink": "/courses"
          }
        },
        {
          "type": "features",
          "props": {
            "title": "Our Courses",
            "items": [
              {
                "icon": "book-open",
                "title": "Mathematics",
                "description": "Advanced calculus and algebra"
              }
            ]
          }
        }
      ]
    }
  ],
  "theme": {
    "primaryColor": "#F6C453",
    "secondaryColor": "#111111",
    "fontFamily": "Inter",
    "accentColor": "#3B82F6"
  }
}
```

### 2. **Preview Images**

استخدم **Unsplash** للصور:
- Educational: `https://images.unsplash.com/photo-1523050854058-8df90110c9f1` (Library)
- Services: `https://images.unsplash.com/photo-1556761175-b413da4baf72` (Office)
- Store: `https://images.unsplash.com/photo-1441986300917-64674bd600d8` (Shop)
- Portfolio: `https://images.unsplash.com/photo-1542744094-3a31f272c490` (Design)
- Coach: `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b` (Fitness)

### 3. **Seeder Implementation**

**الخيار 1: Extension Method (Recommended)**

```csharp
// SiteCraft.Infrastructure/Data/Extensions/TemplateSeeder.cs
public static class TemplateSeeder
{
    public static void SeedTemplates(this SiteCraftDbContext context)
    {
        // Check if templates already exist
        if (context.Templates.Any())
        {
            return;
        }

        var templates = new List<Template>
        {
            // Educational Template
            new Template
            {
                Id = Guid.NewGuid(),
                TenantId = null, // Global template
                Name = "Academic Excellence",
                Description = "Perfect for schools, universities...",
                Category = "Education",
                PreviewImageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
                IsPublic = true,
                IsPremium = false,
                TemplateData = GetEducationalTemplateJson(),
                UsageCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // ... other templates
        };

        context.Templates.AddRange(templates);
        context.SaveChanges();
    }

    private static string GetEducationalTemplateJson()
    {
        return @"{
            ""version"": ""1.0"",
            ""pages"": [...]
        }";
    }
}
```

**الخيار 2: Background Service**

```csharp
// SiteCraft.API/Services/TemplateSeedService.cs
public class TemplateSeedService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SiteCraftDbContext>();
        
        context.SeedTemplates();
    }
}
```

### 4. **التسجيل في Program.cs**

```csharp
// في Program.cs بعد app.Run() أو قبل
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SiteCraftDbContext>();
    context.Database.Migrate(); // Apply migrations
    context.SeedTemplates();    // Seed templates
}
```

---

## التوقعات:

### ✅ **Phase 7.4: Tasks**

- [ ] إنشاء `TemplateSeeder.cs` في `SiteCraft.Infrastructure/Data/Extensions/`
- [ ] تعريف 5 Template Objects مع جميع الـ properties
- [ ] كتابة JSON structure واقعي لكل قالب (صفحة Home كاملة)
- [ ] إضافة Helper methods لكل قالب: `GetEducationalTemplateJson()`, etc.
- [ ] تسجيل الـ Seeder في `Program.cs`
- [ ] تجربة التطبيق والتأكد من إضافة القوالب للـ Database
- [ ] اختبار GET /api/v1/templates والتأكد من ظهور الـ 5 قوالب

---

## القواعد:

### 📝 **Content Rules**
- ✅ استخدم نصوص واقعية ومفيدة (ليس Lorem Ipsum)
- ✅ استخدم Unsplash لصور Preview عالية الجودة
- ✅ كل قالب يجب أن يكون مختلف بصريًا وهيكليًا
- ✅ JSON يجب أن يكون valid (اختبره قبل الحفظ)

### 🎨 **Design Rules**
- ✅ Theme Colors: Primary = `#F6C453` (Gold), Secondary = `#111111` (Dark)
- ✅ استخدم Lucide icons في الـ sections (e.g., `"book-open"`, `"briefcase"`)
- ✅ كل Hero section يجب أن يحتوي على CTA واضح

### 🔒 **Data Rules**
- ✅ `TenantId = null` لجميع القوالب (Global templates)
- ✅ `IsPublic = true` لجميع القوالب
- ✅ 3 Free templates و 2 Premium templates
- ✅ `UsageCount = 0` عند الإنشاء
- ✅ `CreatedAt` و `UpdatedAt` = `DateTime.UtcNow`

### 🧪 **Testing Rules**
- ✅ تحقق من seed مرة واحدة فقط (تجنب duplicates)
- ✅ اختبر JSON validation (هل يمر بالـ validator؟)
- ✅ تأكد أن الـ preview images تظهر بشكل صحيح

---

## Template JSON Examples:

### Educational Template (Full Example)

```json
{
  "version": "1.0",
  "pages": [
    {
      "slug": "home",
      "title": "Home",
      "sections": [
        {
          "type": "hero",
          "props": {
            "title": "Welcome to Academic Excellence",
            "subtitle": "Empowering minds, shaping futures through quality education",
            "backgroundImage": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920",
            "ctaText": "Explore Courses",
            "ctaLink": "/courses",
            "layout": "centered"
          }
        },
        {
          "type": "features",
          "props": {
            "title": "Featured Courses",
            "subtitle": "Choose from our wide range of programs",
            "items": [
              {
                "icon": "book-open",
                "title": "Mathematics",
                "description": "Advanced calculus, algebra, and statistics"
              },
              {
                "icon": "beaker",
                "title": "Science",
                "description": "Physics, chemistry, and biology programs"
              },
              {
                "icon": "globe",
                "title": "Languages",
                "description": "English, French, and Spanish courses"
              }
            ]
          }
        },
        {
          "type": "testimonials",
          "props": {
            "title": "Student Success Stories",
            "items": [
              {
                "name": "Sarah Johnson",
                "role": "Graduate Student",
                "quote": "This institution changed my life. The quality of education is unmatched.",
                "avatar": "https://i.pravatar.cc/150?img=1"
              }
            ]
          }
        },
        {
          "type": "contact",
          "props": {
            "title": "Get in Touch",
            "subtitle": "Have questions? We're here to help",
            "email": "info@academic-excellence.com",
            "phone": "+1 (555) 123-4567"
          }
        }
      ]
    }
  ],
  "theme": {
    "primaryColor": "#F6C453",
    "secondaryColor": "#111111",
    "accentColor": "#3B82F6",
    "fontFamily": "Inter"
  }
}
```

---

## ملاحظات إضافية:

1. **Performance:**
   - Seeding يجب أن يحصل مرة واحدة فقط
   - استخدم `context.Templates.Any()` للتحقق

2. **Extensibility:**
   - JSON structure قابل للتوسع (يمكن إضافة sections جديدة لاحقًا)
   - استخدم `"version": "1.0"` للـ versioning

3. **Future Enhancements:**
   - Phase 8: سنضيف Template Preview في Frontend
   - Phase 9: سنضيف Template Customization
   - Phase 10: سنضيف Template Marketplace

---

## الأولويات:

1. ✅ إنشاء TemplateSeeder.cs
2. ✅ كتابة JSON لكل قالب (مع تفاصيل واقعية)
3. ✅ تسجيل في Program.cs
4. ✅ اختبار البناء والتشغيل
5. ✅ التحقق من البيانات في Database

---

**ابدأ الآن! 🚀**
