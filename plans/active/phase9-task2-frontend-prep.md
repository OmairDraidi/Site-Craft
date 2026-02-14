# Phase 9 Task 2: Page Builder Frontend — Layout

**Status:** 🟢 Ready to Start  
**Date:** February 14, 2026  
**Previous Task:** Task 1 (Backend API) ✅ Complete

---

## Overview

Build the visual page builder interface with 3-column layout:
- **Left Sidebar:** Elements + Sections panels
- **Center Canvas:** Drag-and-drop editing area
- **Right Sidebar:** Properties panel

---

## Implementation Checklist

### Prerequisites
- [ ] Install required packages:
  - `@dnd-kit/core` - Core drag-and-drop functionality
  - `@dnd-kit/sortable` - Sortable list support
  - `@dnd-kit/utilities` - Utility functions
  - `zustand` - State management (if not already installed)

### 1. Route Setup
- [ ] Create `/builder/:pageId` route in React Router
- [ ] Add route to router configuration
- [ ] Add route guards (authentication required)

### 2. Zustand Store (`useBuilderStore`)
- [ ] Create `stores/builderStore.ts`
- [ ] State:
  - `pageData` - Current page structure
  - `selectedElement` - Currently selected element ID
  - `history` - Undo/redo stack (max 50 states)
  - `isDirty` - Unsaved changes flag
  - `isSaving` - Save operation in progress
- [ ] Actions:
  - `loadPage(pageData)` - Initialize builder with page data
  - `selectElement(id)` - Select element for editing
  - `updateElement(id, props)` - Update element properties
  - `addSection(type)` - Add new section
  - `deleteElement(id)` - Remove element
  - `reorderElements(sourceId, targetId)` - Reorder via drag-drop
  - `undo()` / `redo()` - History navigation
  - `save()` - Persist to API

### 3. Page Builder Layout Component
- [ ] Create `pages/Builder/BuilderPage.tsx`
- [ ] 3-column layout with Flexbox/Grid
- [ ] Column widths:
  - Left: 280px (fixed)
  - Center: flexible (1fr)
  - Right: 320px (fixed)
- [ ] Responsive handling (collapse sidebars on mobile)
- [ ] Top toolbar with:
  - Page title (editable)
  - Save button
  - Preview button
  - Publish button
  - Device switcher (Desktop/Tablet/Mobile)
  - Back to pages link

### 4. Left Sidebar — Elements Panel
- [ ] Create `components/Builder/LeftSidebar/ElementsPanel.tsx`
- [ ] Draggable elements:
  - Text (heading, paragraph)
  - Image
  - Button
  - Video
  - Form
  - Icon
- [ ] Each element as draggable card with icon + label
- [ ] Search/filter functionality
- [ ] Categorized tabs (Basic / Media / Forms)

### 5. Left Sidebar — Sections Panel
- [ ] Create `components/Builder/LeftSidebar/SectionsPanel.tsx`
- [ ] Pre-built sections:
  - Hero (with CTA)
  - Features (3-column grid)
  - Pricing (3 tiers)
  - Testimonials (carousel)
  - Footer (3-column)
- [ ] Section preview thumbnails
- [ ] Drag to canvas to add

### 6. Center Canvas
- [ ] Create `components/Builder/Canvas/BuilderCanvas.tsx`
- [ ] Render page structure from `pageData`
- [ ] Drop zones for sections
- [ ] Visual indicators:
  - Grid lines (subtle background)
  - Hover state on elements
  - Selected element highlighted border
  - Drag handles on corners
- [ ] Click to select element
- [ ] Keyboard shortcuts:
  - Delete key to remove selected
  - Ctrl+Z / Ctrl+Y for undo/redo
  - Escape to deselect

### 7. Right Sidebar — Properties Panel
- [ ] Create `components/Builder/RightSidebar/PropertiesPanel.tsx`
- [ ] Dynamic panel based on selected element type
- [ ] Common properties:
  - **Typography:** font family, size, weight, color
  - **Layout:** width, height, padding, margin
  - **Background:** color, image, gradient
  - **Border:** width, color, radius
  - **Shadow:** box shadow controls
- [ ] Element-specific properties:
  - Text: content (textarea)
  - Button: link URL, target
  - Image: src, alt text
  - Video: embed URL
- [ ] Color picker component
- [ ] Number inputs with units (px, %, rem)
- [ ] Toggle switches for boolean props

### 8. API Integration
- [ ] Create `services/page.service.ts`:
  - `getPageById(id)` - Load page for editing
  - `updatePage(id, data)` - Save page
  - `publishPage(id)` - Publish
  - `unpublishPage(id)` - Unpublish
- [ ] Error handling with toast notifications
- [ ] Auto-save every 30 seconds (debounced)
- [ ] Loading states during API calls

### 9. Components to Create
```
components/Builder/
├── BuilderLayout.tsx          - Main 3-column layout
├── Toolbar.tsx                - Top toolbar with actions
├── LeftSidebar/
│   ├── ElementsPanel.tsx      - Draggable elements
│   ├── SectionsPanel.tsx      - Pre-built sections
│   └── DraggableItem.tsx      - Reusable drag item
├── Canvas/
│   ├── BuilderCanvas.tsx      - Main editing area
│   ├── Section.tsx            - Section wrapper
│   ├── Element.tsx            - Generic element renderer
│   └── DropZone.tsx           - Drop target indicator
└── RightSidebar/
    ├── PropertiesPanel.tsx    - Dynamic properties
    ├── StyleControls.tsx      - Style inputs
    └── ColorPicker.tsx        - Custom color picker
```

### 10. Styling
- [ ] Use Tailwind CSS for layout
- [ ] Design system colors from theme
- [ ] Smooth transitions on hover/select
- [ ] Visual feedback during drag
- [ ] Grid overlay on canvas (optional)

---

## Technical Notes

### Drag-and-Drop Implementation
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// In BuilderCanvas.tsx
<DndContext 
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext 
    items={sections} 
    strategy={verticalListSortingStrategy}
  >
    {sections.map(section => (
      <Section key={section.id} section={section} />
    ))}
  </SortableContext>
</DndContext>
```

### Zustand Store Structure
```typescript
interface BuilderState {
  pageData: PageData;
  selectedElement: string | null;
  history: PageData[];
  historyIndex: number;
  isDirty: boolean;
  isSaving: boolean;
  
  loadPage: (data: PageData) => void;
  selectElement: (id: string | null) => void;
  updateElement: (id: string, props: any) => void;
  addSection: (type: string) => void;
  deleteElement: (id: string) => void;
  reorderElements: (sourceId: string, targetId: string) => void;
  undo: () => void;
  redo: () => void;
  save: () => Promise<void>;
}
```

### PageData Structure (TypeScript)
```typescript
interface PageData {
  sections: Section[];
}

interface Section {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'testimonial' | 'footer';
  order: number;
  visible: boolean;
  components: Component[];
}

interface Component {
  id: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'video' | 'form' | 'icon';
  content: string;
  styles: Record<string, any>;
}
```

---

## Success Criteria

- [ ] User can open `/builder/{pageId}` route
- [ ] Page loads from API successfully
- [ ] Left sidebar displays draggable elements and sections
- [ ] Elements can be dragged to canvas
- [ ] Clicking element selects it
- [ ] Right sidebar shows properties for selected element
- [ ] Changes update in real-time on canvas
- [ ] Save button persists changes to API
- [ ] Undo/Redo keyboard shortcuts work
- [ ] Layout is responsive (desktop focus, mobile aware)

---

## Dependencies

- ✅ Backend API (Task 1) - Complete
- ✅ Authentication system - Complete
- ✅ Project/Site structure - Complete

---

## Estimated Time

- Package installation: 10 minutes
- Route setup: 30 minutes
- Zustand store: 1 hour
- Builder layout: 1.5 hours
- Left sidebar (elements + sections): 2 hours
- Center canvas (rendering + drag-drop): 3 hours
- Right sidebar (properties panel): 2 hours
- API integration: 1 hour
- Testing & polish: 1 hour

**Total:** ~12 hours (1.5 days)

---

## Next Steps After Task 2

Task 3: Drag-and-Drop + Block Editing (interactive features)
Task 4: Responsive Preview + Publish (device switcher + publish flow)

---

**Ready to Build! 🎨**
