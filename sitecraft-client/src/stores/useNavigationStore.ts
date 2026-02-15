// src/stores/useNavigationStore.ts

import { create } from 'zustand';
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
import { menuService } from '@/services/menu.service';

interface NavigationState {
  menus: MenuListItem[];
  selectedMenu: Menu | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMenus: (siteId: string) => Promise<void>;
  fetchMenuById: (id: string) => Promise<void>;
  createMenu: (data: CreateMenuRequest) => Promise<Menu>;
  updateMenu: (id: string, data: UpdateMenuRequest) => Promise<Menu>;
  deleteMenu: (id: string) => Promise<void>;
  createMenuItem: (data: CreateMenuItemRequest) => Promise<MenuItem>;
  updateMenuItem: (id: string, data: UpdateMenuItemRequest) => Promise<MenuItem>;
  deleteMenuItem: (id: string) => Promise<void>;
  reorderItems: (menuId: string, data: ReorderMenuItemsRequest) => Promise<Menu>;
  clearSelectedMenu: () => void;
  clearError: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  menus: [],
  selectedMenu: null,
  isLoading: false,
  error: null,

  fetchMenus: async (siteId: string) => {
    set({ isLoading: true, error: null });
    try {
      const menus = await menuService.getMenusBySite(siteId);
      set({ menus, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch menus',
        isLoading: false,
      });
    }
  },

  fetchMenuById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const menu = await menuService.getMenuById(id);
      set({ selectedMenu: menu, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch menu',
        isLoading: false,
      });
    }
  },

  createMenu: async (data: CreateMenuRequest) => {
    set({ isLoading: true, error: null });
    try {
      const menu = await menuService.createMenu(data);
      set((state) => ({
        menus: [
          {
            id: menu.id,
            name: menu.name,
            location: menu.location,
            itemCount: menu.items.length,
            createdAt: menu.createdAt,
          },
          ...state.menus,
        ],
        isLoading: false,
      }));
      return menu;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create menu',
        isLoading: false,
      });
      throw error;
    }
  },

  updateMenu: async (id: string, data: UpdateMenuRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await menuService.updateMenu(id, data);
      set((state) => ({
        menus: state.menus.map((m) =>
          m.id === id
            ? { ...m, name: updated.name, location: updated.location }
            : m
        ),
        selectedMenu: state.selectedMenu?.id === id ? updated : state.selectedMenu,
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update menu',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMenu: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await menuService.deleteMenu(id);
      set((state) => ({
        menus: state.menus.filter((m) => m.id !== id),
        selectedMenu: state.selectedMenu?.id === id ? null : state.selectedMenu,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete menu',
        isLoading: false,
      });
      throw error;
    }
  },

  createMenuItem: async (data: CreateMenuItemRequest) => {
    set({ isLoading: true, error: null });
    try {
      const item = await menuService.createMenuItem(data);
      // Refresh selected menu to update items
      if (data.menuId) {
        const menu = await menuService.getMenuById(data.menuId);
        set({ selectedMenu: menu, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return item;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create menu item',
        isLoading: false,
      });
      throw error;
    }
  },

  updateMenuItem: async (id: string, data: UpdateMenuItemRequest) => {
    set({ isLoading: true, error: null });
    try {
      const item = await menuService.updateMenuItem(id, data);
      // Refresh selected menu if open
      if (item.menuId) {
        const menu = await menuService.getMenuById(item.menuId);
        set({ selectedMenu: menu, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return item;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update menu item',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMenuItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await menuService.deleteMenuItem(id);
      // Refresh selected menu if open
      set((state) => {
        if (state.selectedMenu) {
          menuService.getMenuById(state.selectedMenu.id).then((menu) => {
            set({ selectedMenu: menu, isLoading: false });
          });
        }
        return { isLoading: false };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete menu item',
        isLoading: false,
      });
      throw error;
    }
  },

  reorderItems: async (menuId: string, data: ReorderMenuItemsRequest) => {
    set({ isLoading: true, error: null });
    try {
      const menu = await menuService.reorderMenuItems(menuId, data);
      set({ selectedMenu: menu, isLoading: false });
      return menu;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder menu items',
        isLoading: false,
      });
      throw error;
    }
  },

  clearSelectedMenu: () => set({ selectedMenu: null }),
  clearError: () => set({ error: null }),
}));
