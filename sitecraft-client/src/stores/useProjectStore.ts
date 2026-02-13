// src/stores/useProjectStore.ts

import { create } from 'zustand';
import type { Project, ProjectListItem, CreateProjectRequest, UpdateProjectRequest } from '@/types/project.types';
import { projectService } from '@/services/project.service';

interface ProjectState {
  projects: ProjectListItem[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectRequest) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  applyTemplateToProject: (projectId: string, templateId: string) => Promise<Project>;
  updateProjectStatus: (projectId: string, status: string) => Promise<Project>;
  clearSelectedProject: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectService.getAllProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        isLoading: false,
      });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.getProjectById(id);
      set({ selectedProject: project, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch project',
        isLoading: false,
      });
    }
  },

  createProject: async (data: CreateProjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.createProject(data);
      set((state) => ({
        projects: [
          {
            id: project.id,
            name: project.name,
            description: project.description,
            templateId: project.templateId,
            templateName: project.templateName,
            status: project.status,
            thumbnailUrl: project.thumbnailUrl,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          },
          ...state.projects,
        ],
        isLoading: false,
      }));
      return project;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create project',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (id: string, data: UpdateProjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, name: updated.name, description: updated.description, updatedAt: updated.updatedAt } : p
        ),
        selectedProject: state.selectedProject?.id === id ? updated : state.selectedProject,
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update project',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete project',
        isLoading: false,
      });
      throw error;
    }
  },

  clearSelectedProject: () => set({ selectedProject: null }),
  clearError: () => set({ error: null }),

  applyTemplateToProject: async (projectId: string, templateId: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.applyTemplateToProject(projectId, templateId);
      set((state) => ({
        selectedProject: project,
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, templateId: project.templateId, templateName: project.templateName, status: project.status, thumbnailUrl: project.thumbnailUrl }
            : p
        ),
        isLoading: false,
      }));
      return project;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProjectStatus: async (projectId: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.updateProjectStatus(projectId, status);
      set((state) => ({
        selectedProject: project,
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, status: project.status } : p
        ),
        isLoading: false,
      }));
      return project;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
