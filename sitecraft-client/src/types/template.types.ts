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
  isFavorited: boolean;
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
