// src/types/project.types.ts

export type ProjectStatus = 'Draft' | 'Active' | 'Published' | 'Archived';

export interface Project {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  templateId: string | null;
  templateName: string | null;
  templatePreviewUrl: string | null;
  siteId: string | null;
  name: string;
  description: string;
  status: ProjectStatus;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectListItem {
  id: string;
  templateId: string | null;
  templateName: string | null;
  name: string;
  description: string;
  status: ProjectStatus;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  templateId?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectStatusRequest {
  status: ProjectStatus;
}

export interface ProjectApiResponse {
  success: boolean;
  message: string;
  data: ProjectListItem[];
}

export interface SingleProjectApiResponse {
  success: boolean;
  message: string;
  data: Project;
}
