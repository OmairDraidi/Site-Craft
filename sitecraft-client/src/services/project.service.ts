// src/services/project.service.ts

import { apiClient } from './api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Project,
  ProjectListItem,
  ProjectApiResponse,
  SingleProjectApiResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@/types/project.types';

class ProjectService {
  async getAllProjects(): Promise<ProjectListItem[]> {
    try {
      const response = await apiClient.get<ProjectApiResponse>(API_ENDPOINTS.PROJECTS.LIST);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await apiClient.get<SingleProjectApiResponse>(
        API_ENDPOINTS.PROJECTS.BY_ID(id)
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    try {
      const response = await apiClient.post<SingleProjectApiResponse>(
        API_ENDPOINTS.PROJECTS.LIST,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    try {
      const response = await apiClient.put<SingleProjectApiResponse>(
        API_ENDPOINTS.PROJECTS.BY_ID(id),
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PROJECTS.BY_ID(id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }

  async applyTemplateToProject(projectId: string, templateId: string): Promise<Project> {
    try {
      const response = await apiClient.post<SingleProjectApiResponse>(
        API_ENDPOINTS.PROJECTS.APPLY_TEMPLATE(projectId, templateId)
      );
      return response.data.data;
    } catch (error: any) {
      // Only log non-403 errors to keep console clean
      if (error?.statusCode !== 403) {
        console.error('Failed to apply template to project:', error);
      }
      throw error;
    }
  }

  async updateProjectStatus(projectId: string, status: string): Promise<Project> {
    try {
      const response = await apiClient.put<SingleProjectApiResponse>(
        API_ENDPOINTS.PROJECTS.STATUS(projectId),
        { status }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to update project status:', error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();
