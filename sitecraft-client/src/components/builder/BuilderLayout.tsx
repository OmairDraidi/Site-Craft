/**
 * Builder Layout
 * 3-column layout: Left Sidebar | Center Canvas | Right Sidebar
 */

import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { FloatingToolbar } from './Canvas/FloatingToolbar';
import { useBuilderStore } from '@/stores/builderStore';
import { Toolbar } from './Toolbar';
import { LeftSidebar } from './LeftSidebar/LeftSidebar';
import { BuilderCanvas } from './Canvas/BuilderCanvas';
import { RightSidebar } from './RightSidebar/RightSidebar';
import { DragPreview } from './Canvas/DragPreview';
import type { ComponentData, DraggableElement, SectionTemplate } from '@/types/builder.types';

export const BuilderLayout = () => {
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    selectedElementId,
    deleteComponent,
    duplicateComponent,
    copyComponent,
    pageData,
    addSection,
    reorderSections,
    reorderComponents,
    moveComponentToSection,
    selectElement, // Added this based on the provided snippet
    isPreviewMode, // Added this based on the provided snippet
    moveComponentUp,
    moveComponentDown,
  } = useBuilderStore();

  const [activeType, setActiveType] = useState<'section' | 'component' | 'element' | null>(null);
  const [activeData, setActiveData] = useState<{
    element?: DraggableElement;
    section?: SectionTemplate;
    component?: ComponentData;
  } | null>(null);
  const [activeDraggable, setActiveDraggable] = useState<any>(null); // Added for DndContext changes

  // Helper to generate component ID
  const generateId = () => `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px to start a drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDraggable(active); // Set active draggable for overlay

    // Determine what's being dragged and store its data
    if (active.data.current?.element) {
      setActiveType('element');
      setActiveData({ element: active.data.current.element });
    } else if (active.data.current?.section) {
      setActiveType('section');
      setActiveData({ section: active.data.current.section });
    } else if (active.data.current?.type === 'component') {
      setActiveType('component');
      setActiveData({ component: active.data.current.component });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveType(null);
    setActiveData(null);
    setActiveDraggable(null); // Clear active draggable

    if (!over) return;

    // Handle dragging from Elements panel
    if (active.data.current?.element) {
      const element = active.data.current.element;

      // Check if dropped over an existing section
      if (over.data.current?.type === 'section-drop') {
        const sectionId = over.data.current.sectionId;
        const newComponent = {
          type: element.type,
          content: element.defaultContent,
          styles: element.defaultStyles,
          visible: true,
        };

        useBuilderStore.getState().addComponent(sectionId, newComponent);
        return;
      }

      // Otherwise, create new section with this component
      const newSection = {
        type: 'custom' as const,
        visible: true,
        components: [
          {
            id: generateId(),
            type: element.type,
            content: element.defaultContent,
            styles: element.defaultStyles,
            visible: true,
          },
        ],
      };

      addSection(newSection);
      return;
    }

    // Handle dragging from Sections panel
    if (active.data.current?.section) {
      const section = active.data.current.section;

      // Create pre-built section
      const components = getSectionTemplate(section.type);
      const newSection = {
        type: section.type,
        visible: true,
        components,
      };

      addSection(newSection);
      return;
    }

    // Handle reordering components within sections
    if (active.data.current?.type === 'component' && over.data.current?.type === 'component') {
      const activeComponent = active.data.current.component;
      const overComponent = over.data.current.component;
      const activeSectionId = active.data.current.sectionId;
      const overSectionId = over.data.current.sectionId;

      // Cross-section movement
      if (activeSectionId !== overSectionId) {
        // Find target index in the destination section
        for (const section of pageData.sections) {
          if (section.id === overSectionId) {
            const targetIndex = section.components.findIndex((c) => c.id === overComponent.id);
            if (targetIndex !== -1) {
              moveComponentToSection(activeComponent.id, activeSectionId, overSectionId, targetIndex);
            }
            break;
          }
        }
        return;
      }

      // Same section reordering
      for (const section of pageData.sections) {
        const activeIndex = section.components.findIndex((c) => c.id === activeComponent.id);
        const overIndex = section.components.findIndex((c) => c.id === overComponent.id);

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          reorderComponents(section.id, activeIndex, overIndex);
          break;
        }
      }
      return;
    }

    // Handle reordering sections
    if (active.data.current?.type === 'section' && over.data.current?.type === 'section') {
      const activeIndex = pageData.sections.findIndex((s) => s.id === active.id);
      const overIndex = pageData.sections.findIndex((s) => s.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        reorderSections(activeIndex, overIndex);
      }
    }
  };

  // Get drag overlay content
  const getDragOverlayContent = () => {
    // Use activeData for the preview content
    return <DragPreview activeType={activeType} activeData={activeData} />;
  };

  // Handle clicks on the canvas to deselect elements
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Check if the click target is the canvas itself and not a child element
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  // Actions for Floating Toolbar
  const handleDuplicate = () => {
    if (selectedElementId) duplicateComponent(selectedElementId);
  };

  const handleDelete = () => {
    if (selectedElementId) deleteComponent(selectedElementId);
  };

  const handleMoveUp = () => {
    if (selectedElementId) moveComponentUp(selectedElementId);
  };

  const handleMoveDown = () => {
    if (selectedElementId) moveComponentDown(selectedElementId);
  };

  // Check if movement is possible
  const canMoveUp = (() => {
    if (!selectedElementId) return false;
    // Implementation logic check would go here, simpler to just allow for now or check index
    return true;
  })();

  const canMoveDown = (() => {
    if (!selectedElementId) return false;
    return true;
  })();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip shortcuts if user is typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Undo: Ctrl+Z (Windows) or Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      // Redo: Ctrl+Y (Windows) or Ctrl+Shift+Z (Windows) or Cmd+Shift+Z (Mac)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        // Only delete components, not sections
        const isComponent = pageData.sections.some(section =>
          section.components.some(comp => comp.id === selectedElementId)
        );
        if (isComponent) {
          deleteComponent(selectedElementId);
        }
      }

      // Duplicate: Ctrl+D (Windows) or Cmd+D (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementId) {
        e.preventDefault();
        const isComponent = pageData.sections.some(section =>
          section.components.some(comp => comp.id === selectedElementId)
        );
        if (isComponent) {
          duplicateComponent(selectedElementId);
        }
      }

      // Copy: Ctrl+C (Windows) or Cmd+C (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElementId) {
        e.preventDefault();
        const isComponent = pageData.sections.some(section =>
          section.components.some(comp => comp.id === selectedElementId)
        );
        if (isComponent) {
          copyComponent(selectedElementId);
        }
      }

      // Paste: Ctrl+V (Windows) or Cmd+V (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        const clipboardComponent = useBuilderStore.getState().clipboardComponent;
        if (clipboardComponent && pageData.sections.length > 0) {
          // Paste into the first section or the section containing selected element
          let targetSectionId = pageData.sections[0].id;

          if (selectedElementId) {
            for (const section of pageData.sections) {
              if (section.components.some(comp => comp.id === selectedElementId)) {
                targetSectionId = section.id;
                break;
              }
            }
          }

          useBuilderStore.getState().pasteComponent(targetSectionId);
        }
      }

      // Deselect: Escape
      if (e.key === 'Escape') {
        useBuilderStore.getState().selectElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, selectedElementId, deleteComponent, duplicateComponent, copyComponent, pageData, selectElement]); // Added selectElement to dependencies

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-[#0A0A0A] overflow-hidden">
        <Toolbar />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Elements & Sections */}
          {!isPreviewMode && (
            <div className="w-[280px] border-r border-white/10 bg-[#111111] flex flex-col z-20">
              <LeftSidebar />
            </div>
          )}

          {/* Center - Canvas */}
          <div className="flex-1 bg-[#0A0A0A] relative overflow-hidden flex flex-col">
            {/* Canvas Area */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth"
              onClick={handleCanvasClick}
            >
              <div className="min-h-full py-12">
                <BuilderCanvas />
              </div>
            </div>

            {/* Floating Actions Toolbar */}
            {!isPreviewMode && selectedElementId && (
              <FloatingToolbar
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                visible={true}
                onToggleVisibility={() => { }} // Placeholder if needed
              />
            )}
          </div>

          {/* Right Sidebar - Properties */}
          {!isPreviewMode && (
            <div className="w-[320px] border-l border-white/10 bg-[#111111] flex flex-col z-20">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDraggable ? (
          <div className="opacity-80 rotate-2 cursor-grabbing pointer-events-none">
            {getDragOverlayContent()}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// Helper: Get section template components
function getSectionTemplate(type: string) {
  const generateId = () => `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case 'hero':
      return [
        {
          id: generateId(),
          type: 'heading' as const,
          content: 'Welcome to Your Site',
          styles: { fontSize: '3rem', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' as const },
          visible: true,
        },
        {
          id: generateId(),
          type: 'text' as const,
          content: 'Build amazing websites with our powerful page builder',
          styles: { fontSize: '1.25rem', color: '#A1A1A1', textAlign: 'center' as const, marginBottom: '2rem' },
          visible: true,
        },
        {
          id: generateId(),
          type: 'button' as const,
          content: 'Get Started',
          styles: {
            backgroundColor: '#F6C453',
            color: '#000000',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
          },
          visible: true,
        },
      ];

    case 'features':
      return [
        {
          id: generateId(),
          type: 'heading' as const,
          content: 'Features',
          styles: { fontSize: '2rem', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' as const },
          visible: true,
        },
        {
          id: generateId(),
          type: 'text' as const,
          content: 'Feature 1 description',
          styles: { fontSize: '1rem', color: '#A1A1A1' },
          visible: true,
        },
        {
          id: generateId(),
          type: 'text' as const,
          content: 'Feature 2 description',
          styles: { fontSize: '1rem', color: '#A1A1A1' },
          visible: true,
        },
      ];

    case 'pricing':
      return [
        {
          id: generateId(),
          type: 'heading' as const,
          content: 'Pricing Plans',
          styles: { fontSize: '2rem', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' as const },
          visible: true,
        },
        {
          id: generateId(),
          type: 'text' as const,
          content: 'Choose the perfect plan for your needs',
          styles: { fontSize: '1rem', color: '#A1A1A1', textAlign: 'center' as const },
          visible: true,
        },
      ];

    case 'testimonials':
      return [
        {
          id: generateId(),
          type: 'heading' as const,
          content: 'What Our Customers Say',
          styles: { fontSize: '2rem', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' as const },
          visible: true,
        },
        {
          id: generateId(),
          type: 'text' as const,
          content: '"This product changed my life!" - Happy Customer',
          styles: { fontSize: '1rem', color: '#A1A1A1', fontStyle: 'italic' },
          visible: true,
        },
      ];

    case 'footer':
      return [
        {
          id: generateId(),
          type: 'text' as const,
          content: '© 2026 Your Company. All rights reserved.',
          styles: { fontSize: '0.875rem', color: '#666', textAlign: 'center' as const },
          visible: true,
        },
      ];

    default:
      return [
        {
          id: generateId(),
          type: 'text' as const,
          content: 'Section content',
          styles: { color: '#FFFFFF' },
          visible: true,
        },
      ];
  }
}
