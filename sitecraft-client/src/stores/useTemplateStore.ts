// src/stores/useTemplateStore.ts

import { create } from 'zustand';
import type { Template, TemplateFilters } from '@/types/template.types';
import { templateService } from '@/services/template.service';

interface TemplateState {
  // State
  templates: Template[];
  filteredTemplates: Template[];
  paginatedTemplates: Template[];
  filters: TemplateFilters;
  isLoading: boolean;
  error: string | null;
  selectedTemplate: Template | null;
  
  // Pagination State
  currentPage: number;
  pageSize: number;
  totalPages: number;

  // Actions
  fetchTemplates: () => Promise<void>;
  fetchTemplateById: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TemplateFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  setPage: (page: number) => void;
  selectTemplate: (template: Template | null) => void;
  applyTemplate: (templateId: string) => Promise<void>;
  toggleFavorite: (templateId: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  // Initial State
  templates: [],
  filteredTemplates: [],
  paginatedTemplates: [],
  filters: {
    category: 'All',
    isPremium: null,
    searchTerm: ''
  },
  isLoading: false,
  error: null,
  selectedTemplate: null,

  // Pagination Initial State
  currentPage: 1,
  pageSize: 4,
  totalPages: 1,

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
      get().applyFilters(); // Initial apply logic
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch templates', 
        isLoading: false 
      });
    }
  },

  // Fetch single template by ID
  fetchTemplateById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const template = await templateService.getTemplateById(id);
      set({ selectedTemplate: template, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch template details', 
        isLoading: false 
      });
    }
  },

  // Update filters
  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters, currentPage: 1 }); // Reset to page 1 on filter change
    get().applyFilters();
  },

  // Clear all filters
  clearFilters: () => {
    set({ 
      filters: { category: 'All', isPremium: null, searchTerm: '' },
      currentPage: 1
    });
    get().applyFilters();
  },

  // Apply filters and pagination
  applyFilters: () => {
    const { templates, filters, currentPage, pageSize } = get();
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

    // Calculate pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    set({ 
      filteredTemplates: filtered,
      paginatedTemplates: paginated,
      totalPages,
      currentPage: safeCurrentPage
    });
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().applyFilters();
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
  },

  // Toggle favorite status for a template
  toggleFavorite: async (templateId: string) => {
    try {
      // Optimistically update UI
      const updateTemplates = (templates: Template[]) =>
        templates.map(t => 
          t.id === templateId ? { ...t, isFavorited: !t.isFavorited } : t
        );

      const { templates, filteredTemplates, paginatedTemplates, selectedTemplate } = get();
      
      set({
        templates: updateTemplates(templates),
        filteredTemplates: updateTemplates(filteredTemplates),
        paginatedTemplates: updateTemplates(paginatedTemplates),
        selectedTemplate: selectedTemplate?.id === templateId 
          ? { ...selectedTemplate, isFavorited: !selectedTemplate.isFavorited }
          : selectedTemplate
      });

      // Call API
      await templateService.toggleFavorite(templateId);
    } catch (error) {
      // Revert on error
      get().fetchTemplates();
      throw error;
    }
  }
}));
