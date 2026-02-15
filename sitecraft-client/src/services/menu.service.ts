/**
 * Menu Service
 * Handles all navigation menu-related API operations
 */

import { apiClient } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Menu,
  MenuListItem,
  MenuItem,
  CreateMenuRequest,
  UpdateMenuRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  ReorderMenuItemsRequest,
} from '@/types/navigation.types';
import type { ApiResponse } from '@/types/api.types';

// API response types
interface MenuApiResponse extends ApiResponse<Menu> {}
interface MenusListApiResponse extends ApiResponse<MenuListItem[]> {}
interface MenuItemApiResponse extends ApiResponse<MenuItem> {}

class MenuService {
  /**
   * Get all menus for a site
   */
  async getMenusBySite(siteId: string): Promise<MenuListItem[]> {
    const response = await apiClient.get<MenusListApiResponse>(
      `${API_ENDPOINTS.MENUS.LIST}?siteId=${siteId}`
    );
    return response.data.data;
  }

  /**
   * Get menu by ID with items
   */
  async getMenuById(id: string): Promise<Menu> {
    const response = await apiClient.get<MenuApiResponse>(
      API_ENDPOINTS.MENUS.BY_ID(id)
    );
    return response.data.data;
  }

  /**
   * Create new menu
   */
  async createMenu(data: CreateMenuRequest): Promise<Menu> {
    const response = await apiClient.post<MenuApiResponse>(
      API_ENDPOINTS.MENUS.LIST,
      data
    );
    return response.data.data;
  }

  /**
   * Update menu
   */
  async updateMenu(id: string, data: UpdateMenuRequest): Promise<Menu> {
    const response = await apiClient.put<MenuApiResponse>(
      API_ENDPOINTS.MENUS.BY_ID(id),
      data
    );
    return response.data.data;
  }

  /**
   * Delete menu
   */
  async deleteMenu(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.MENUS.BY_ID(id));
  }

  /**
   * Create menu item
   */
  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    const response = await apiClient.post<MenuItemApiResponse>(
      API_ENDPOINTS.MENUS.CREATE_ITEM(data.menuId),
      data
    );
    return response.data.data;
  }

  /**
   * Update menu item
   */
  async updateMenuItem(id: string, data: UpdateMenuItemRequest): Promise<MenuItem> {
    const response = await apiClient.put<MenuItemApiResponse>(
      API_ENDPOINTS.MENUS.UPDATE_ITEM(id),
      data
    );
    return response.data.data;
  }

  /**
   * Delete menu item
   */
  async deleteMenuItem(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.MENUS.DELETE_ITEM(id));
  }

  /**
   * Reorder menu items
   */
  async reorderMenuItems(menuId: string, data: ReorderMenuItemsRequest): Promise<Menu> {
    const response = await apiClient.put<MenuApiResponse>(
      API_ENDPOINTS.MENUS.REORDER(menuId),
      data
    );
    return response.data.data;
  }
}

export const menuService = new MenuService();
