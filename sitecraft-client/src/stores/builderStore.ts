/**
 * Builder Store (Zustand)
 * 
 * Manages the state for the visual page builder:
 * - Current page data (sections & components)
 * - Selected element for editing
 * - History for undo/redo (max 50 states)
 * - Save status
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { pageService } from '@/services/page.service';
import type {
  PageData,
  SectionData,
  ComponentData,
  SaveStatus,
  DeviceMode,
} from '@/types/builder.types';

const MAX_HISTORY = 50;

interface SiteBranding {
  primaryColor: string;
  secondaryColor: string;
  headingFontFamily: string;
  bodyFontFamily: string;
  logoUrl?: string;
  faviconUrl?: string;
}

interface BuilderState {
  // Core data
  pageId: string | null;
  pageData: PageData;
  selectedElementId: string | null;
  clipboardComponent: ComponentData | null;
  siteBranding: SiteBranding | null;
  
  // History management
  history: PageData[];
  historyIndex: number;
  
  // UI state
  isDirty: boolean;
  saveStatus: SaveStatus;
  deviceMode: DeviceMode;
  isPreviewMode: boolean;
  
  // Actions
  initializePage: (pageId: string, pageData: PageData) => void;
  setPageData: (pageData: PageData) => void;
  selectElement: (id: string | null) => void;
  setSiteBranding: (branding: SiteBranding | null) => void;
  
  // Section operations
  addSection: (section: Omit<SectionData, 'id' | 'order'>) => void;
  updateSection: (id: string, updates: Partial<SectionData>) => void;
  deleteSection: (id: string) => void;
  reorderSections: (sourceOrder: number, targetOrder: number) => void;
  
  // Component operations
  addComponent: (sectionId: string, component: Omit<ComponentData, 'id'>) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  deleteComponent: (id: string) => void;
  reorderComponents: (sectionId: string, sourceOrder: number, targetOrder: number) => void;
  moveComponentToSection: (componentId: string, fromSectionId: string, toSectionId: string, targetIndex: number) => void;
  duplicateComponent: (id: string) => void;
  copyComponent: (id: string) => void;
  pasteComponent: (sectionId: string) => void;
  moveComponentUp: (id: string) => void;
  moveComponentDown: (id: string) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Save operations
  save: () => Promise<void>;
  setDeviceMode: (mode: DeviceMode) => void;
  togglePreview: () => void;
  
  // Reset
  reset: () => void;
}

const initialPageData: PageData = {
  sections: [],
};

export const useBuilderStore = create<BuilderState>()(
  devtools(
    (set, get) => ({
      // Initial state
      pageId: null,
      pageData: initialPageData,
      selectedElementId: null,
      clipboardComponent: null,
      siteBranding: null,
      history: [initialPageData],
      historyIndex: 0,
      isDirty: false,
      saveStatus: 'saved',
      deviceMode: 'desktop',
      isPreviewMode: false,

      // Initialize page with data from API
      initializePage: (pageId, pageData) => {
        set({
          pageId,
          pageData,
          history: [pageData],
          historyIndex: 0,
          isDirty: false,
          saveStatus: 'saved',
          selectedElementId: null,
        });
      },

      // Set page data and add to history
      setPageData: (pageData) => {
        const { history, historyIndex } = get();
        
        // Truncate history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(pageData);
        
        // Keep only last MAX_HISTORY states
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        
        set({
          pageData,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isDirty: true,
          saveStatus: 'unsaved',
        });
      },

      // Select element for editing
      selectElement: (id) => {
        set({ selectedElementId: id });
      },

      // Set site branding
      setSiteBranding: (branding) => {
        set({ siteBranding: branding });
      },

      // Add new section
      addSection: (section) => {
        const { pageData, setPageData } = get();
        const newSection: SectionData = {
          ...section,
          id: uuidv4(),
          order: pageData.sections.length,
        };
        
        setPageData({
          ...pageData,
          sections: [...pageData.sections, newSection],
        });
      },

      // Update section
      updateSection: (id, updates) => {
        const { pageData, setPageData } = get();
        setPageData({
          ...pageData,
          sections: pageData.sections.map((section) =>
            section.id === id ? { ...section, ...updates } : section
          ),
        });
      },

      // Delete section
      deleteSection: (id) => {
        const { pageData, setPageData, selectedElementId } = get();
        const newSections = pageData.sections
          .filter((section) => section.id !== id)
          .map((section, index) => ({ ...section, order: index }));
        
        setPageData({
          ...pageData,
          sections: newSections,
        });
        
        // Deselect if deleted section was selected
        if (selectedElementId === id) {
          set({ selectedElementId: null });
        }
      },

      // Reorder sections
      reorderSections: (sourceOrder, targetOrder) => {
        const { pageData, setPageData } = get();
        const newSections = [...pageData.sections];
        const [removed] = newSections.splice(sourceOrder, 1);
        newSections.splice(targetOrder, 0, removed);
        
        // Update order indices
        const reorderedSections = newSections.map((section, index) => ({
          ...section,
          order: index,
        }));
        
        setPageData({
          ...pageData,
          sections: reorderedSections,
        });
      },

      // Add component to section
      addComponent: (sectionId, component) => {
        const { pageData, setPageData } = get();
        const newComponent: ComponentData = {
          ...component,
          id: uuidv4(),
        };
        
        setPageData({
          ...pageData,
          sections: pageData.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  components: [...section.components, newComponent],
                }
              : section
          ),
        });
      },

      // Update component
      updateComponent: (id, updates) => {
        const { pageData, setPageData } = get();
        setPageData({
          ...pageData,
          sections: pageData.sections.map((section) => ({
            ...section,
            components: section.components.map((component) =>
              component.id === id ? { ...component, ...updates } : component
            ),
          })),
        });
      },

      // Delete component
      deleteComponent: (id) => {
        const { pageData, setPageData, selectedElementId } = get();
        setPageData({
          ...pageData,
          sections: pageData.sections.map((section) => ({
            ...section,
            components: section.components.filter(
              (component) => component.id !== id
            ),
          })),
        });
        
        // Deselect if deleted component was selected
        if (selectedElementId === id) {
          set({ selectedElementId: null });
        }
      },

      // Reorder components within a section
      reorderComponents: (sectionId, sourceOrder, targetOrder) => {
        const { pageData, setPageData } = get();
        setPageData({
          ...pageData,
          sections: pageData.sections.map((section) => {
            if (section.id !== sectionId) return section;
            
            const newComponents = [...section.components];
            const [removed] = newComponents.splice(sourceOrder, 1);
            newComponents.splice(targetOrder, 0, removed);
            
            return {
              ...section,
              components: newComponents,
            };
          }),
        });
      },

      // Move component from one section to another
      moveComponentToSection: (componentId, fromSectionId, toSectionId, targetIndex) => {
        const { pageData, setPageData } = get();
        
        // Find the component in the source section
        let componentToMove: ComponentData | undefined;
        
        const updatedSections = pageData.sections.map((section) => {
          if (section.id === fromSectionId) {
            // Remove from source section
            const component = section.components.find((c) => c.id === componentId);
            if (component) {
              componentToMove = component;
            }
            return {
              ...section,
              components: section.components.filter((c) => c.id !== componentId),
            };
          }
          return section;
        });
        
        if (!componentToMove) return; // Component not found
        
        // Insert into target section at specified index
        const finalSections = updatedSections.map((section) => {
          if (section.id === toSectionId) {
            const newComponents = [...section.components];
            newComponents.splice(targetIndex, 0, componentToMove!);
            return {
              ...section,
              components: newComponents,
            };
          }
          return section;
        });
        
        setPageData({
          ...pageData,
          sections: finalSections,
        });
      },

      // Duplicate component
      duplicateComponent: (id) => {
        const { pageData, setPageData } = get();
        
        // Find the component and its section
        for (const section of pageData.sections) {
          const componentIndex = section.components.findIndex((c) => c.id === id);
          if (componentIndex !== -1) {
            const originalComponent = section.components[componentIndex];
            const newComponent: ComponentData = {
              ...originalComponent,
              id: uuidv4(),
            };
            
            // Insert duplicated component right after the original
            setPageData({
              ...pageData,
              sections: pageData.sections.map((s) =>
                s.id === section.id
                  ? {
                      ...s,
                      components: [
                        ...s.components.slice(0, componentIndex + 1),
                        newComponent,
                        ...s.components.slice(componentIndex + 1),
                      ],
                    }
                  : s
              ),
            });
            
            // Select the new component
            set({ selectedElementId: newComponent.id });
            break;
          }
        }
      },

      // Copy component to clipboard
      copyComponent: (id) => {
        const { pageData } = get();
        
        // Find the component
        for (const section of pageData.sections) {
          const component = section.components.find((c) => c.id === id);
          if (component) {
            set({ clipboardComponent: component });
            break;
          }
        }
      },

      // Paste component from clipboard
      pasteComponent: (sectionId) => {
        const { clipboardComponent, pageData, setPageData } = get();
        
        if (!clipboardComponent) return;
        
        const newComponent: ComponentData = {
          ...clipboardComponent,
          id: uuidv4(),
        };
        
        setPageData({
          ...pageData,
          sections: pageData.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  components: [...section.components, newComponent],
                }
              : section
          ),
        });
        
        // Select the new component
        set({ selectedElementId: newComponent.id });
      },

      // Move component up within its section
      moveComponentUp: (id) => {
        const { pageData, setPageData } = get();
        
        for (const section of pageData.sections) {
          const componentIndex = section.components.findIndex((c) => c.id === id);
          if (componentIndex > 0) {
            const newComponents = [...section.components];
            [newComponents[componentIndex - 1], newComponents[componentIndex]] = 
              [newComponents[componentIndex], newComponents[componentIndex - 1]];
            
            setPageData({
              ...pageData,
              sections: pageData.sections.map((s) =>
                s.id === section.id ? { ...s, components: newComponents } : s
              ),
            });
            break;
          }
        }
      },

      // Move component down within its section
      moveComponentDown: (id) => {
        const { pageData, setPageData } = get();
        
        for (const section of pageData.sections) {
          const componentIndex = section.components.findIndex((c) => c.id === id);
          if (componentIndex !== -1 && componentIndex < section.components.length - 1) {
            const newComponents = [...section.components];
            [newComponents[componentIndex], newComponents[componentIndex + 1]] = 
              [newComponents[componentIndex + 1], newComponents[componentIndex]];
            
            setPageData({
              ...pageData,
              sections: pageData.sections.map((s) =>
                s.id === section.id ? { ...s, components: newComponents } : s
              ),
            });
            break;
          }
        }
      },

      // Undo
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          set({
            pageData: history[newIndex],
            historyIndex: newIndex,
            isDirty: true,
            saveStatus: 'unsaved',
          });
        }
      },

      // Redo
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          set({
            pageData: history[newIndex],
            historyIndex: newIndex,
            isDirty: true,
            saveStatus: 'unsaved',
          });
        }
      },

      // Can undo?
      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex > 0;
      },

      // Can redo?
      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      // Save to API
      save: async () => {
        const { pageId, pageData } = get();
        if (!pageId) {
          console.error('Cannot save: No page ID');
          return;
        }
        
        set({ saveStatus: 'saving' });
        
        try {
          await pageService.savePageData(pageId, pageData);
          set({
            isDirty: false,
            saveStatus: 'saved',
          });
        } catch (error) {
          console.error('Failed to save page:', error);
          set({ saveStatus: 'error' });
        }
      },

      // Set device mode
      setDeviceMode: (mode) => {
        set({ deviceMode: mode });
      },

      // Toggle preview mode
      togglePreview: () => {
        const { isPreviewMode } = get();
        set({
          isPreviewMode: !isPreviewMode,
          selectedElementId: !isPreviewMode ? null : get().selectedElementId,
        });
      },

      // Reset store
      reset: () => {
        set({
          pageId: null,
          pageData: initialPageData,
          selectedElementId: null,
          history: [initialPageData],
          historyIndex: 0,
          isDirty: false,
          saveStatus: 'saved',
          deviceMode: 'desktop',
          isPreviewMode: false,
        });
      },
    }),
    { name: 'BuilderStore' }
  )
);
