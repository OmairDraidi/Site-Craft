# SiteCraft — Phase 7.5: Frontend Complete (Template Gallery)

@Phase7_TemplateEngine_Prompt.md

---

## السياق:

- **المرحلة الحالية:** Phase 7.5 - Frontend Implementation (Complete)
- **الـ Status السابق:**
  - Phase 7.1 مكتمل ✅ (Database & Entities)
  - Phase 7.2 مكتمل ✅ (Repository & Service Layer)
  - Phase 7.3 مكتمل ✅ (API Endpoints)
  - Phase 7.4 مكتمل ✅ (Seed Data - 5 Default Templates)
- **التالي:** بناء واجهة Template Gallery كاملة في Frontend

---

## المهمة:

إنشاء **Template Gallery Frontend** كاملة تشمل:
- Types & Interfaces
- API Services  
- State Management (Zustand)
- UI Components (TemplateCard, Filters, Grid)
- Main Page (TemplatesPage)
- Integration مع Backend
- Testing

---

## الهيكل التنظيمي:

```
Phase 7.5: Frontend Complete
├── Step 1: Types & Interfaces
├── Step 2: API Service Layer
├── Step 3: State Management (Zustand)
├── Step 4: UI Components
├── Step 5: Main Page
├── Step 6: Routing
├── Step 7: Integration Testing
└── Step 8: Final Touches
```

---

## Step 1: Types & Interfaces 📝

### الملف: `src/types/template.types.ts`

```typescript
// src/types/template.types.ts

export interface Template {
  id: string;
  tenantId: string | null;
  name: string;
  description: string;
  category: TemplateCategory;
  previewImageUrl: string;
  isPublic: boolean;
  isPremium: boolean;
  templateData: string; // JSON string
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory = 
  | 'Business' 
  | 'Education' 
  | 'Portfolio' 
  | 'Services' 
  | 'Store';

export interface TemplateFilters {
  category?: TemplateCategory | 'All';
  isPremium?: boolean | null;
  searchTerm?: string;
}

export interface TemplateApiResponse {
  success: boolean;
  message: string;
  data: Template[];
}

export interface SingleTemplateApiResponse {
  success: boolean;
  message: string;
  data: Template;
}

export interface ApplyTemplateResponse {
  success: boolean;
  message: string;
  data: Record<string, never>; // Empty object
}
```

**✅ Checklist:**
- [ ] إنشاء مجلد `src/types/` إذا لم يكن موجود
- [ ] إنشاء `template.types.ts`
- [ ] نسخ الـ interfaces أعلاه
- [ ] التأكد من عدم وجود أخطاء TypeScript

---

## Step 2: API Service Layer 🔌

### الملف: `src/services/template.service.ts`

```typescript
// src/services/template.service.ts

import axios from 'axios';
import type { 
  Template, 
  TemplateFilters, 
  TemplateApiResponse,
  SingleTemplateApiResponse,
  ApplyTemplateResponse
} from '@/types/template.types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class TemplateService {
  /**
   * Get all templates with optional filters
   */
  async getAllTemplates(filters?: TemplateFilters): Promise<Template[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category && filters.category !== 'All') {
        params.append('category', filters.category);
      }
      if (filters?.isPremium !== undefined && filters.isPremium !== null) {
        params.append('isPremium', String(filters.isPremium));
      }
      if (filters?.searchTerm) {
        params.append('searchTerm', filters.searchTerm);
      }

      const queryString = params.toString();
      const url = `${API_BASE}/api/v1/templates${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get<TemplateApiResponse>(url, {
        headers: {
          'X-Tenant-Id': localStorage.getItem('tenantId') || 'default',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw error;
    }
  }

  /**
   * Get single template by ID
   */
  async getTemplateById(id: string): Promise<Template> {
    try {
      const response = await axios.get<SingleTemplateApiResponse>(
        `${API_BASE}/api/v1/templates/${id}`,
        {
          headers: {
            'X-Tenant-Id': localStorage.getItem('tenantId') || 'default',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch template:', error);
      throw error;
    }
  }

  /**
   * Apply template to user's site
   */
  async applyTemplate(templateId: string): Promise<void> {
    try {
      await axios.post<ApplyTemplateResponse>(
        `${API_BASE}/api/v1/templates/${templateId}/apply`,
        {},
        {
          headers: {
            'X-Tenant-Id': localStorage.getItem('tenantId') || 'default',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
    } catch (error) {
      console.error('Failed to apply template:', error);
      throw error;
    }
  }
}

export const templateService = new TemplateService();
```

**✅ Checklist:**
- [ ] إنشاء مجلد `src/services/` إذا لم يكن موجود
- [ ] إنشاء `template.service.ts`
- [ ] نسخ الكود أعلاه
- [ ] التأكد من تثبيت axios: `npm install axios`
- [ ] اختبار import في ملف آخر

---

## Step 3: State Management (Zustand) 🗄️

### الملف: `src/stores/useTemplateStore.ts`

```typescript
// src/stores/useTemplateStore.ts

import { create } from 'zustand';
import type { Template, TemplateFilters } from '@/types/template.types';
import { templateService } from '@/services/template.service';

interface TemplateState {
  // State
  templates: Template[];
  filteredTemplates: Template[];
  filters: TemplateFilters;
  isLoading: boolean;
  error: string | null;
  selectedTemplate: Template | null;
  
  // Actions
  fetchTemplates: () => Promise<void>;
  setFilters: (filters: Partial<TemplateFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  selectTemplate: (template: Template | null) => void;
  applyTemplate: (templateId: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  // Initial State
  templates: [],
  filteredTemplates: [],
  filters: {
    category: 'All',
    isPremium: null,
    searchTerm: ''
  },
  isLoading: false,
  error: null,
  selectedTemplate: null,

  // Fetch all templates
  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const templates = await templateService.getAllTemplates();
      set({ 
        templates, 
        filteredTemplates: templates, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch templates', 
        isLoading: false 
      });
    }
  },

  // Update filters
  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters });
    get().applyFilters();
  },

  // Clear all filters
  clearFilters: () => {
    set({ 
      filters: { category: 'All', isPremium: null, searchTerm: '' }
    });
    set({ filteredTemplates: get().templates });
  },

  // Apply filters to templates
  applyFilters: () => {
    const { templates, filters } = get();
    let filtered = [...templates];

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Filter by premium status
    if (filters.isPremium !== null && filters.isPremium !== undefined) {
      filtered = filtered.filter(t => t.isPremium === filters.isPremium);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }

    set({ filteredTemplates: filtered });
  },

  // Select template for details view
  selectTemplate: (template) => {
    set({ selectedTemplate: template });
  },

  // Apply template to user's site
  applyTemplate: async (templateId: string) => {
    set({ isLoading: true, error: null });
    try {
      await templateService.applyTemplate(templateId);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to apply template', 
        isLoading: false 
      });
      throw error;
    }
  }
}));
```

**✅ Checklist:**
- [ ] إنشاء مجلد `src/stores/` إذا لم يكن موجود
- [ ] إنشاء `useTemplateStore.ts`
- [ ] نسخ الكود أعلاه
- [ ] التأكد من تثبيت zustand: `npm install zustand`

---

## Step 4: UI Components 🎨

### Component 1: TemplateCard

**الملف:** `src/components/templates/TemplateCard.tsx`

```tsx
// src/components/templates/TemplateCard.tsx

import { Crown, Users } from 'lucide-react';
import type { Template } from '@/types/template.types';

interface TemplateCardProps {
  template: Template;
  onSelect?: (template: Template) => void;
}

export const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <div 
      onClick={() => onSelect?.(template)}
      className="group relative overflow-hidden rounded-xl bg-dark-lighter/50 backdrop-blur-md border border-white/10 hover:border-gold/50 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      {/* Preview Image */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={template.previewImageUrl} 
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-gold/90 backdrop-blur-sm">
            <Crown className="w-3 h-3 text-dark" />
            <span className="text-xs font-semibold text-dark">Premium</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-dark/80 backdrop-blur-sm border border-white/10">
          <span className="text-xs font-medium text-white">{template.category}</span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {template.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{template.usageCount} uses</span>
          </div>
          <span className="text-gold font-medium group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
```

---

### Component 2: TemplateFilters

**الملف:** `src/components/templates/TemplateFilters.tsx`

```tsx
// src/components/templates/TemplateFilters.tsx

import { Search, X } from 'lucide-react';
import type { TemplateCategory, TemplateFilters } from '@/types/template.types';

interface TemplateFiltersProps {
  filters: TemplateFilters;
  onFilterChange: (filters: Partial<TemplateFilters>) => void;
  onClearFilters: () => void;
}

const categories: Array<TemplateCategory | 'All'> = [
  'All',
  'Business',
  'Education',
  'Portfolio',
  'Services',
  'Store'
];

export const TemplateFiltersComponent = ({
  filters,
  onFilterChange,
  onClearFilters
}: TemplateFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          value={filters.searchTerm || ''}
          onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
          className="w-full pl-10 pr-4 py-3 bg-dark-lighter/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange({ category })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.category === category
                  ? 'bg-gold text-dark'
                  : 'bg-dark-lighter/50 text-gray-300 hover:bg-dark-lighter border border-white/10 hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange({ isPremium: null })}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.isPremium === null
                ? 'bg-gold text-dark'
                : 'bg-dark-lighter/50 text-gray-300 hover:bg-dark-lighter border border-white/10 hover:border-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange({ isPremium: false })}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.isPremium === false
                ? 'bg-gold text-dark'
                : 'bg-dark-lighter/50 text-gray-300 hover:bg-dark-lighter border border-white/10 hover:border-white/20'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => onFilterChange({ isPremium: true })}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filters.isPremium === true
                ? 'bg-gold text-dark'
                : 'bg-dark-lighter/50 text-gray-300 hover:bg-dark-lighter border border-white/10 hover:border-white/20'
            }`}
          >
            Premium
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClearFilters}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium"
      >
        <X className="w-4 h-4" />
        Clear Filters
      </button>
    </div>
  );
};
```

---

### Component 3: TemplateGrid

**الملف:** `src/components/templates/TemplateGrid.tsx`

```tsx
// src/components/templates/TemplateGrid.tsx

import { TemplateCard } from './TemplateCard';
import type { Template } from '@/types/template.types';

interface TemplateGridProps {
  templates: Template[];
  isLoading?: boolean;
  onTemplateSelect?: (template: Template) => void;
}

export const TemplateGrid = ({ 
  templates, 
  isLoading = false,
  onTemplateSelect 
}: TemplateGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="animate-pulse rounded-xl bg-dark-lighter/50 h-80"
          />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-lighter/50 border border-white/10 mb-4">
          <span className="text-3xl">📭</span>
        </div>
        <p className="text-xl text-gray-400 font-medium">No templates found</p>
        <p className="text-sm text-gray-500 mt-2">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onTemplateSelect}
        />
      ))}
    </div>
  );
};
```

**✅ Checklist:**
- [ ] إنشاء مجلد `src/components/templates/`
- [ ] إنشاء `TemplateCard.tsx`
- [ ] إنشاء `TemplateFilters.tsx`
- [ ] إنشاء `TemplateGrid.tsx`
- [ ] التأكد من تثبيت lucide-react: `npm install lucide-react`
- [ ] اختبار import لكل component

---

## Step 5: Main Page 📄

### الملف: `src/pages/TemplatesPage.tsx`

```tsx
// src/pages/TemplatesPage.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTemplateStore } from '@/stores/useTemplateStore';
import { TemplateFiltersComponent } from '@/components/templates/TemplateFilters';
import { TemplateGrid } from '@/components/templates/TemplateGrid';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { 
    filteredTemplates, 
    filters, 
    isLoading, 
    error,
    fetchTemplates, 
    setFilters, 
    clearFilters 
  } = useTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTemplateSelect = (template: any) => {
    navigate(`/templates/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Template Gallery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Perfect Template
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Professional, ready-to-use templates to kickstart your website journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TemplateFiltersComponent
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            {!isLoading && (
              <div className="mb-4 text-sm text-gray-400">
                Found <span className="text-gold font-medium">{filteredTemplates.length}</span> templates
              </div>
            )}
            
            <TemplateGrid
              templates={filteredTemplates}
              isLoading={isLoading}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
```

**✅ Checklist:**
- [ ] إنشاء مجلد `src/pages/` إذا لم يكن موجود
- [ ] إنشاء `TemplatesPage.tsx`
- [ ] نسخ الكود أعلاه
- [ ] التأكد من تثبيت react-router-dom: `npm install react-router-dom`

---

## Step 6: Routing 🛣️

### تحديث: `src/App.tsx`

```tsx
// Add to your routes
import { TemplatesPage } from '@/pages/TemplatesPage';

// Inside your Routes:
<Route path="/templates" element={<TemplatesPage />} />
```

**✅ Checklist:**
- [ ] إضافة Route للـ `/templates`
- [ ] إضافة Link في الـ Navigation
- [ ] اختبار Navigation

---

## Step 7: Integration Testing 🧪

### الاختبارات المطلوبة:

1. **API Integration:**
   - [ ] تشغيل Backend: `dotnet run`
   - [ ] تشغيل Frontend: `npm run dev`
   - [ ] اختبار GET /api/v1/templates
   - [ ] التأكد من ظهور 5 قوالب

2. **Filters Testing:**
   - [ ] اختبار Category filter (كل فئة)
   - [ ] اختبار Premium/Free filter
   - [ ] اختبار Search functionality
   - [ ] اختبار Clear Filters

3. **UI Testing:**
   - [ ] Skeleton loaders تظهر عند Loading
   - [ ] Empty state يظهر عند No Results
   - [ ] Badge يظهر على Premium templates
   - [ ] Hover effects تعمل بشكل سلس
   - [ ] Responsive على Mobile/Tablet/Desktop

4. **Navigation:**
   - [ ] Click على Template يفتح Details (حتى لو الصفحة مش موجودة بعد)
   - [ ] Back button يعمل صح

---

## Step 8: Final Touches ✨

### Tailwind Config Check

تأكد من وجود الألوان في `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#111111',
          lighter: '#1a1a1a'
        },
        gold: {
          DEFAULT: '#F6C453',
        }
      }
    }
  }
}
```

### Environment Variables

تأكد من `VITE_API_URL` في `.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## ✅ Acceptance Criteria (معايير القبول):

قبل اعتبار Phase 7.5 مكتملة، يجب:

- ✅ جميع الـ Types تم إنشاؤها بدون أخطاء
- ✅ Service layer يتصل بالـ Backend بنجاح
- ✅ Zustand store يدير الـ State بشكل صحيح
- ✅ جميع الـ Components تعرض بشكل صحيح
- ✅ TemplatesPage تعرض 5 قوالب من الـ Backend
- ✅ Filters تعمل بشكل صحيح (Category, Premium, Search)
- ✅ UI responsive على جميع الأحجام
- ✅ Loading states و Error states تعمل
- ✅ Glassmorphism و Animations سلسة
- ✅ لا يوجد Console Errors

---

## 🎯 Next Steps (بعد Phase 7.5):

- **Phase 7.6:** Template Details Page
- **Phase 7.7:** Apply Template Functionality
- **Phase 7.8:** Template Favorites (Optional)
- **Phase 7.9:** Final Testing & Documentation

---

## 📝 Notes:

- استخدم `@/` alias للـ imports (تأكد من tsconfig.json)
- جميع الألوان تتبع Digital Luxury Theme
- استخدم `line-clamp` utility من Tailwind للنصوص الطويلة
- Error handling شامل في كل API call

---

**ابدأ من Step 1 ونكمل خطوة بخطوة! 🚀**
