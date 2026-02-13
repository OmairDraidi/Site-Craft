// src/services/template.service.ts

import { apiClient } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { 
  Template, 
  TemplateFilters, 
  TemplateApiResponse,
  SingleTemplateApiResponse,
  ApplyTemplateResponse
} from '@/types/template.types';

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
      const url = `${API_ENDPOINTS.TEMPLATES.LIST}${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get<TemplateApiResponse>(url);
      
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
      const response = await apiClient.get<SingleTemplateApiResponse>(
        API_ENDPOINTS.TEMPLATES.BY_ID(id)
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
      await apiClient.post<ApplyTemplateResponse>(
        API_ENDPOINTS.TEMPLATES.APPLY(templateId),
        {}
      );
    } catch (error) {
      console.error('Failed to apply template:', error);
      throw error;
    }
  }

  /**
   * Toggle favorite status for a template
   */
  async toggleFavorite(templateId: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ success: boolean; data: { isFavorited: boolean } }>(
        API_ENDPOINTS.TEMPLATES.FAVORITE(templateId),
        {}
      );
      return response.data.data.isFavorited;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }

  /**
   * Get user's favorite templates
   */
  async getUserFavorites(): Promise<Template[]> {
    try {
      const response = await apiClient.get<TemplateApiResponse>(
        API_ENDPOINTS.TEMPLATES.FAVORITES
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      throw error;
    }
  }
}

export const templateService = new TemplateService();
