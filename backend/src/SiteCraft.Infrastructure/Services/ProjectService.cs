using Microsoft.Extensions.Logging;
using SiteCraft.Application.DTOs.Projects;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Enums;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;
    private readonly ITemplateService _templateService;
    private readonly ISiteRepository _siteRepository;
    private readonly ILogger<ProjectService> _logger;

    public ProjectService(
        IProjectRepository projectRepository,
        ITemplateService templateService,
        ISiteRepository siteRepository,
        ILogger<ProjectService> logger)
    {
        _projectRepository = projectRepository;
        _templateService = templateService;
        _siteRepository = siteRepository;
        _logger = logger;
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(Guid id)
    {
        _logger.LogInformation("Getting project by ID: {ProjectId}", id);
        
        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
            return null;

        return MapToDto(project);
    }

    public async Task<IEnumerable<ProjectListItemDto>> GetUserProjectsAsync(Guid userId, Guid tenantId)
    {
        _logger.LogInformation("Getting projects for user {UserId} in tenant {TenantId}", userId, tenantId);
        
        var projects = await _projectRepository.GetByUserIdAsync(userId, tenantId);
        return projects.Select(MapToListItemDto);
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectRequest request, Guid userId, Guid tenantId)
    {
        _logger.LogInformation("Creating project: {ProjectName} for user {UserId}", request.Name, userId);

        var project = new Project
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            UserId = userId,
            Name = request.Name,
            Description = request.Description,
            Status = ProjectStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _projectRepository.CreateAsync(project);
        
        _logger.LogInformation("Project created successfully: {ProjectId}", created.Id);

        // If template provided, apply it
        if (request.TemplateId.HasValue)
        {
            try
            {
                var applied = await _templateService.ApplyTemplateAsync(
                    request.TemplateId.Value, userId, tenantId, created.Id);

                if (applied)
                {
                    // Find the site that was created/updated for this project
                    var site = await _siteRepository.GetByProjectIdAsync(created.Id);
                    
                    created.TemplateId = request.TemplateId.Value;
                    
                    // Only set SiteId if we found a site for this project
                    if (site != null)
                    {
                        created.SiteId = site.Id;
                    }

                    // Get template for thumbnail
                    var template = await _templateService.GetTemplateByIdAsync(request.TemplateId.Value);
                    if (template != null)
                    {
                        created.ThumbnailUrl = template.PreviewImageUrl;
                    }

                    await _projectRepository.UpdateAsync(created);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to apply template {TemplateId} during project creation", request.TemplateId.Value);
            }
        }

        // Re-fetch with includes
        return await GetProjectByIdAsync(created.Id)
            ?? throw new InvalidOperationException("Failed to retrieve created project");
    }

    public async Task<ProjectDto> UpdateProjectAsync(Guid id, UpdateProjectRequest request, Guid userId)
    {
        _logger.LogInformation("Updating project: {ProjectId}", id);

        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Project not found: {ProjectId}", id);
            throw new KeyNotFoundException($"Project with ID {id} not found");
        }

        // Ensure user owns the project
        if (project.UserId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to update project {ProjectId} owned by {OwnerId}",
                userId, id, project.UserId);
            throw new UnauthorizedAccessException("You do not have permission to update this project");
        }

        project.Name = request.Name;
        project.Description = request.Description;

        await _projectRepository.UpdateAsync(project);
        
        _logger.LogInformation("Project updated successfully: {ProjectId}", id);
        
        return MapToDto(project);
    }

    public async Task<bool> DeleteProjectAsync(Guid id, Guid userId)
    {
        _logger.LogInformation("Deleting project: {ProjectId}", id);

        var project = await _projectRepository.GetByIdAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Project not found: {ProjectId}", id);
            return false;
        }

        // Ensure user owns the project
        if (project.UserId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to delete project {ProjectId} owned by {OwnerId}",
                userId, id, project.UserId);
            throw new UnauthorizedAccessException("You do not have permission to delete this project");
        }

        await _projectRepository.DeleteAsync(id);
        
        _logger.LogInformation("Project deleted successfully: {ProjectId}", id);
        
        return true;
    }

    public async Task<ProjectDto> ApplyTemplateToProjectAsync(Guid projectId, Guid templateId, Guid userId, Guid tenantId)
    {
        _logger.LogInformation("Applying template {TemplateId} to project {ProjectId}", templateId, projectId);

        var project = await _projectRepository.GetByIdAsync(projectId);
        if (project == null || project.UserId != userId)
            throw new KeyNotFoundException("Project not found");

        // Apply template (creates/updates a site) with project context
        var applied = await _templateService.ApplyTemplateAsync(templateId, userId, tenantId, projectId);
        if (!applied)
            throw new InvalidOperationException("Failed to apply template");

        // Find the site that was created/updated for this project
        var site = await _siteRepository.GetByProjectIdAsync(projectId);

        // Update project with template and site references
        project.TemplateId = templateId;
        
        // Only update SiteId if we found a site specifically for this project
        if (site != null)
        {
            project.SiteId = site.Id;
        }

        // Get template for thumbnail
        var template = await _templateService.GetTemplateByIdAsync(templateId);
        if (template != null)
        {
            project.ThumbnailUrl = template.PreviewImageUrl;
        }

        project.UpdatedAt = DateTime.UtcNow;
        await _projectRepository.UpdateAsync(project);

        _logger.LogInformation("Template {TemplateId} applied to project {ProjectId}", templateId, projectId);

        return await GetProjectByIdAsync(project.Id)
            ?? throw new InvalidOperationException("Failed to retrieve updated project");
    }

    public async Task<ProjectDto> UpdateProjectStatusAsync(Guid projectId, string status, Guid userId)
    {
        _logger.LogInformation("Updating status of project {ProjectId} to {Status}", projectId, status);

        var project = await _projectRepository.GetByIdAsync(projectId);
        if (project == null || project.UserId != userId)
            throw new KeyNotFoundException("Project not found");

        if (!Enum.TryParse<ProjectStatus>(status, out var projectStatus))
            throw new ArgumentException($"Invalid status: {status}");

        project.Status = projectStatus;
        await _projectRepository.UpdateAsync(project);

        _logger.LogInformation("Project {ProjectId} status updated to {Status}", projectId, status);

        return await GetProjectByIdAsync(project.Id)
            ?? throw new InvalidOperationException("Failed to retrieve updated project");
    }

    private static ProjectDto MapToDto(Project project)
    {
        return new ProjectDto
        {
            Id = project.Id,
            TenantId = project.TenantId,
            UserId = project.UserId,
            UserName = project.User != null 
                ? $"{project.User.FirstName} {project.User.LastName}" 
                : string.Empty,
            TemplateId = project.TemplateId,
            TemplateName = project.Template?.Name,
            TemplatePreviewUrl = project.Template?.PreviewImageUrl,
            SiteId = project.SiteId,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status.ToString(),
            ThumbnailUrl = project.ThumbnailUrl ?? project.Template?.PreviewImageUrl,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        };
    }

    private static ProjectListItemDto MapToListItemDto(Project project)
    {
        return new ProjectListItemDto
        {
            Id = project.Id,
            TemplateId = project.TemplateId,
            TemplateName = project.Template?.Name,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status.ToString(),
            ThumbnailUrl = project.ThumbnailUrl ?? project.Template?.PreviewImageUrl,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        };
    }
}
