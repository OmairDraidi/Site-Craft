/**
 * Page Service
 * Handles all page-related API operations for the page builder
 */

import { apiClient } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Page, PageData } from '@/types/builder.types';
import type { ApiResponse } from '@/types/api.types';

// API response type for pages
interface PageApiResponse extends ApiResponse<Page> {}
interface PagesListApiResponse extends ApiResponse<Page[]> {}

class PageService {
  /**
   * Get all pages for a site
   */
  async getPagesBySite(siteId: string): Promise<Page[]> {
    const response = await apiClient.get<PagesListApiResponse>(
      `${API_ENDPOINTS.PAGES.LIST}?siteId=${siteId}`
    );
    return response.data.data;
  }

  /**
   * Get page by ID
   */
  async getPageById(id: string): Promise<Page> {
    const response = await apiClient.get<PageApiResponse>(
      API_ENDPOINTS.PAGES.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Create new page
   */
  async createPage(data: {
    siteId: string;
    title: string;
    metaDescription?: string;
    metaKeywords?: string;
  }): Promise<Page> {
    const response = await apiClient.post<PageApiResponse>(
      API_ENDPOINTS.PAGES.LIST,
      data
    );
    return response.data.data;
  }

  /**
   * Update page (including PageData JSON)
   */
  async updatePage(id: string, data: {
    title?: string;
    metaDescription?: string;
    metaKeywords?: string;
    pageData?: PageData;
  }): Promise<Page> {
    // Convert pageData object to JSON string if present
    const payload = {
      ...data,
      pageData: data.pageData ? JSON.stringify(data.pageData) : undefined,
    };
    
    const response = await apiClient.put<PageApiResponse>(
      API_ENDPOINTS.PAGES.BY_ID(id),
      payload
    );
    return response.data.data;
  }

  /**
   * Delete page
   */
  async deletePage(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PAGES.BY_ID(id));
  }

  /**
   * Publish page
   */
  async publishPage(id: string): Promise<Page> {
    const response = await apiClient.post<PageApiResponse>(
      API_ENDPOINTS.PAGES.PUBLISH(id)
    );
    return response.data.data;
  }

  /**
   * Unpublish page
   */
  async unpublishPage(id: string): Promise<Page> {
    const response = await apiClient.post<PageApiResponse>(
      API_ENDPOINTS.PAGES.UNPUBLISH(id)
    );
    return response.data.data;
  }

  /**
   * Save page data (auto-save helper)
   * Only updates the PageData JSON field
   */
  async savePageData(id: string, pageData: PageData): Promise<Page> {
    return this.updatePage(id, { pageData });
  }
}

export const pageService = new PageService();
