using SiteCraft.Application.DTOs.Projects;

namespace SiteCraft.Application.Interfaces;

public interface IProjectService
{
    Task<ProjectDto?> GetProjectByIdAsync(Guid id);
    Task<IEnumerable<ProjectListItemDto>> GetUserProjectsAsync(Guid userId, Guid tenantId);
    Task<ProjectDto> CreateProjectAsync(CreateProjectRequest request, Guid userId, Guid tenantId);
    Task<ProjectDto> UpdateProjectAsync(Guid id, UpdateProjectRequest request, Guid userId);
    Task<bool> DeleteProjectAsync(Guid id, Guid userId);

    /// <summary>
    /// Apply a template to an existing project
    /// </summary>
    Task<ProjectDto> ApplyTemplateToProjectAsync(Guid projectId, Guid templateId, Guid userId, Guid tenantId);

    /// <summary>
    /// Update project status
    /// </summary>
    Task<ProjectDto> UpdateProjectStatusAsync(Guid projectId, string status, Guid userId);
}
