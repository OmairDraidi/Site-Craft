// Navigation Menu Types

export interface Menu {
  id: string;
  siteId: string;
  name: string;
  location: 'Header' | 'Footer';
  createdAt: string;
  updatedAt?: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  menuId: string;
  label: string;
  url: string;
  parentId?: string;
  order: number;
  target: '_self' | '_blank';
  isVisible: boolean;
  createdAt: string;
  updatedAt?: string;
  children: MenuItem[];
}

export interface MenuListItem {
  id: string;
  name: string;
  location: 'Header' | 'Footer';
  itemCount: number;
  createdAt: string;
}

export interface CreateMenuRequest {
  siteId: string;
  name: string;
  location: 'Header' | 'Footer';
}

export interface UpdateMenuRequest {
  name?: string;
  location?: 'Header' | 'Footer';
}

export interface CreateMenuItemRequest {
  menuId: string;
  label: string;
  url: string;
  parentId?: string;
  target?: '_self' | '_blank';
  order?: number;
}

export interface UpdateMenuItemRequest {
  label?: string;
  url?: string;
  parentId?: string;
  target?: '_self' | '_blank';
  isVisible?: boolean;
}

export interface ReorderItem {
  id: string;
  newOrder: number;
  newParentId?: string;
}

export interface ReorderMenuItemsRequest {
  items: ReorderItem[];
}
