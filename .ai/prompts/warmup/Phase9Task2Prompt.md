@WarmUpPrompt.md
@phase9-task2-frontend-prep.md

## السياق:

- المرحلة الحالية: Phase 9 - Site Builder & Navigation
- آخر ما اشتغلت عليه: Page Entity + Backend API (Task 1)
- الحالة: ✅ مكتمل (7 REST endpoints, 12 unit tests passed, migration applied)

## المهمة:

**Phase 9 Task 2: Page Builder Frontend - Visual Drag & Drop Editor**

[F04.PGE.1-4 من Feature Reference]

## المتطلبات:

### 1. Frontend - React + TypeScript + @dnd-kit

#### الحزم المطلوبة:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

#### هيكل الصفحات:
- **Route**: `/builder/:pageId` (Protected - AuthGuard required)
- **Layout**: 3-column responsive layout
  - Left Sidebar: 280px (Elements Panel + Sections Panel)
  - Center Canvas: Flexible (Drop Zone + Visual Indicators)
  - Right Sidebar: 320px (Properties Panel)

#### المكونات الرئيسية:

**1. Zustand Store (useBuilderStore.ts)**
```typescript
interface BuilderState {
  pageData: ComponentData[];
  selectedElement: string | null;
  history: ComponentData[][];
  historyIndex: number;
  // Actions: setPageData, selectElement, addElement, updateElement, deleteElement, undo, redo
}
```

**2. LeftSidebar**
- ElementsPanel: 6 عناصر أساسية (Text, Image, Button, Video, Form, Icon)
- SectionsPanel: 5 أقسام جاهزة (Hero, Features, Pricing, Testimonials, Footer)

**3. BuilderCanvas**
- DndContext wrapper
- Drop zones بين العناصر
- Visual feedback عند السحب
- Highlight عند Hover
- Delete button لكل عنصر

**4. RightSidebar - PropertiesPanel**
- Dynamic controls حسب نوع العنصر المحدد
- Typography controls (font, size, weight, alignment)
- Layout controls (width, height, margin, padding)
- Style controls (colors, borders, shadows, radius)

### 2. التكامل مع Backend API

**الـ endpoints المتاحة:**
- `GET /api/v1/pages/:id` - جلب بيانات الصفحة
- `PUT /api/v1/pages/:id` - تحديث PageData
- `POST /api/v1/pages/:id/publish` - نشر الصفحة
- `POST /api/v1/pages/:id/unpublish` - إلغاء النشر

**page.service.ts:**
- Auto-save debounced (30 ثانية)
- Optimistic updates
- Error handling مع toast notifications

### 3. Business Rules

- ✅ Tenant isolation: كل صفحة تنتمي لموقع محدد (SiteId)
- ✅ Ownership validation: فقط صاحب الموقع يمكنه التعديل
- ✅ Auto-save: حفظ تلقائي كل 30 ثانية
- ✅ History: Undo/Redo للتراجع والإعادة (تخزين محلي)
- ✅ Responsive: التصميم يدعم الشاشات الكبيرة (Desktop-first)

## التوقعات:

### الـ Checklist الكامل:

- [ ] **Prerequisites (30 min)**
  - [ ] تثبيت @dnd-kit packages
  - [ ] إنشاء types/builder.types.ts
  - [ ] إنشاء services/page.service.ts

- [ ] **Zustand Store (45 min)**
  - [ ] useBuilderStore.ts مع full state management
  - [ ] Actions: CRUD + Undo/Redo

- [ ] **Routing & Layout (30 min)**
  - [ ] /builder/:pageId route مع AuthGuard
  - [ ] ThreeColumnLayout component

- [ ] **LeftSidebar (1.5 hours)**
  - [ ] ElementsPanel مع 6 عناصر draggable
  - [ ] SectionsPanel مع 5 أقسام جاهزة

- [ ] **BuilderCanvas (2.5 hours)**
  - [ ] DndContext setup
  - [ ] Drop zones implementation
  - [ ] Visual indicators & feedback
  - [ ] Element rendering من الـ store

- [ ] **RightSidebar (2 hours)**
  - [ ] PropertiesPanel dynamic controls
  - [ ] Typography controls
  - [ ] Layout controls (spacing, sizing)
  - [ ] Style controls (colors, borders, shadows)

- [ ] **API Integration (1.5 hours)**
  - [ ] page.service.ts methods
  - [ ] useState/useEffect للـ initial load
  - [ ] Auto-save logic (debounce 30s)
  - [ ] Publish/Unpublish buttons

- [ ] **Visual Polish (1 hour)**
  - [ ] Hover states
  - [ ] Selected element highlight
  - [ ] Empty state للـ Canvas
  - [ ] Loading states

- [ ] **Error Handling (45 min)**
  - [ ] Try-catch blocks
  - [ ] Toast notifications
  - [ ] 404 handling للصفحات غير موجودة

- [ ] **Testing (1 hour)**
  - [ ] Manual testing: إنشاء صفحة → سحب عناصر → تعديل خصائص → حفظ → نشر
  - [ ] تجربة Undo/Redo
  - [ ] تجربة Auto-save

**الوقت المتوقع**: 12 ساعة

## القواعد:

- ✅ استخدم TypeScript - كل الـ interfaces واضحة
- ✅ Zustand للـ state management (NO Redux)
- ✅ @dnd-kit للـ drag & drop (NO react-beautiful-dnd)
- ✅ Tailwind CSS للـ styling
- ✅ Tenant context من AuthContext
- ✅ Error handling + toast notifications
- ✅ Responsive (Desktop-first حاليًا)
- ✅ Auto-save debounced (30 seconds)
- ✅ Clean component structure

## ملاحظات مهمة:

### من الـ Backend:
- الـ PageData مخزن كـ JSON string بالـ database (longtext)
- الـ Components منفصلة عن PageData (جدول Components)
- الـ Slug يتم توليده تلقائيًا وضمان uniqueness per site
- IsPublished + PublishedAt للتحكم بحالة النشر

### الأولويات:
1. **الوظائف الأساسية أولاً**: DnD working + Save/Load
2. **التفاصيل الجمالية لاحقاً**: Animations, transitions
3. **التركيز على UX**: Feedback واضح للمستخدم

### Success Criteria:
✅ يمكن للمستخدم سحب عنصر Text من الـ LeftSidebar إلى الـ Canvas
✅ يمكن تعديل خصائص العنصر من الـ RightSidebar (مثل: تغيير النص، اللون، الحجم)
✅ التغييرات تحفظ تلقائياً بعد 30 ثانية
✅ يمكن التراجع والإعادة (Undo/Redo)
✅ يمكن نشر الصفحة وإلغاء النشر
✅ الـ Canvas يعرض حالة Empty عند البداية بشكل واضح

---

**ملف المرجع الكامل**: `phase9-task2-frontend-prep.md`
