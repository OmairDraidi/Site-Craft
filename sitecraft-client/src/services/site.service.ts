import { apiClient } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';

export interface SiteDto {
  id: string;
  tenantId: string;
  userId: string;
  projectId?: string;
  templateId?: string;
  name: string;
  tagline?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  headingFontFamily: string;
  bodyFontFamily: string;
  socialLinks?: string; // JSON string
  contactInfo?: string; // JSON string
}

export interface UpdateSiteBrandingRequest {
  name?: string;
  tagline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  headingFontFamily?: string;
  bodyFontFamily?: string;
  socialLinks?: string; // JSON string
  contactInfo?: string; // JSON string
}

export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

export const siteService = {
  /**
   * Get site by ID with branding information
   */
  async getSite(id: string): Promise<SiteDto> {
    const response = await apiClient.get<SiteDto>(API_ENDPOINTS.SITES.BY_ID(id));
    return response.data;
  },

  /**
   * Update site branding settings
   */
  async updateSite(id: string, data: UpdateSiteBrandingRequest): Promise<SiteDto> {
    const response = await apiClient.put<SiteDto>(API_ENDPOINTS.SITES.BY_ID(id), data);
    return response.data;
  },

  /**
   * Upload logo or favicon for a site
   */
  async uploadFile(siteId: string, file: File, type: 'logo' | 'favicon'): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<FileUploadResponse>(
      API_ENDPOINTS.SITES.UPLOAD(siteId, type),
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
