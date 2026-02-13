using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiteCraft.Application.DTOs.Common;
using SiteCraft.Application.DTOs.Projects;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Authorization;

namespace SiteCraft.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/projects")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly ITenantService _tenantService;
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(
        IProjectService projectService,
        ITenantService tenantService,
        ILogger<ProjectsController> logger)
    {
        _projectService = projectService;
        _tenantService = tenantService;
        _logger = logger;
    }

    /// <summary>
    /// Get all projects for the authenticated user
    /// </summary>
    [HttpGet]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProjectListItemDto>>>> GetProjects()
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<IEnumerable<ProjectListItemDto>>.ErrorResponse("Tenant not found"));

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<IEnumerable<ProjectListItemDto>>.ErrorResponse("Invalid user ID"));

            var projects = await _projectService.GetUserProjectsAsync(userId, currentTenantId.Value);

            _logger.LogInformation("Projects retrieved for user {UserId}. Count: {Count}", userId, projects.Count());

            return Ok(ApiResponse<IEnumerable<ProjectListItemDto>>.SuccessResponse(
                projects, "Projects retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving projects");
            return StatusCode(500, ApiResponse<IEnumerable<ProjectListItemDto>>.ErrorResponse(
                "An error occurred while retrieving projects"));
        }
    }

    /// <summary>
    /// Get project by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> GetProjectById(Guid id)
    {
        try
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null)
                return NotFound(ApiResponse<ProjectDto>.ErrorResponse("Project not found"));

            return Ok(ApiResponse<ProjectDto>.SuccessResponse(project, "Project retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving project {ProjectId}", id);
            return StatusCode(500, ApiResponse<ProjectDto>.ErrorResponse(
                "An error occurred while retrieving the project"));
        }
    }

    /// <summary>
    /// Create a new project
    /// </summary>
    [HttpPost]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> CreateProject(
        [FromBody] CreateProjectRequest request)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<ProjectDto>.ErrorResponse("Tenant not found"));

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<ProjectDto>.ErrorResponse("Invalid user ID"));

            var project = await _projectService.CreateProjectAsync(request, userId, currentTenantId.Value);

            _logger.LogInformation("Project created: {ProjectId} by user {UserId}", project.Id, userId);

            return CreatedAtAction(
                nameof(GetProjectById),
                new { id = project.Id },
                ApiResponse<ProjectDto>.SuccessResponse(project, "Project created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating project");
            return StatusCode(500, ApiResponse<ProjectDto>.ErrorResponse(
                "An error occurred while creating the project"));
        }
    }

    /// <summary>
    /// Update an existing project
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> UpdateProject(
        Guid id, [FromBody] UpdateProjectRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<ProjectDto>.ErrorResponse("Invalid user ID"));

            var project = await _projectService.UpdateProjectAsync(id, request, userId);

            _logger.LogInformation("Project updated: {ProjectId} by user {UserId}", project.Id, userId);

            return Ok(ApiResponse<ProjectDto>.SuccessResponse(project, "Project updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<ProjectDto>.ErrorResponse("Project not found"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, ApiResponse<ProjectDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating project {ProjectId}", id);
            return StatusCode(500, ApiResponse<ProjectDto>.ErrorResponse(
                "An error occurred while updating the project"));
        }
    }

    /// <summary>
    /// Delete a project
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProject(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<object>.ErrorResponse("Invalid user ID"));

            var result = await _projectService.DeleteProjectAsync(id, userId);
            if (!result)
                return NotFound(ApiResponse<object>.ErrorResponse("Project not found"));

            _logger.LogInformation("Project deleted: {ProjectId} by user {UserId}", id, userId);

            return Ok(ApiResponse<object>.SuccessResponse(new { }, "Project deleted successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting project {ProjectId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "An error occurred while deleting the project"));
        }
    }

    /// <summary>
    /// Apply a template to an existing project
    /// </summary>
    [HttpPost("{id:guid}/apply-template/{templateId:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> ApplyTemplateToProject(
        Guid id, 
        Guid templateId)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<ProjectDto>.ErrorResponse("Tenant not found"));

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<ProjectDto>.ErrorResponse("Invalid user ID"));

            var project = await _projectService.ApplyTemplateToProjectAsync(
                id, templateId, userId, currentTenantId.Value);

            _logger.LogInformation(
                "Template {TemplateId} applied to project {ProjectId} by user {UserId}", 
                templateId, id, userId);

            return Ok(ApiResponse<ProjectDto>.SuccessResponse(
                project, "Template applied successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<ProjectDto>.ErrorResponse("Project not found"));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Premium template access denied for project {ProjectId}", id);
            return StatusCode(403, ApiResponse<ProjectDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error applying template to project {ProjectId}", id);
            return StatusCode(500, ApiResponse<ProjectDto>.ErrorResponse(
                "An error occurred while applying the template"));
        }
    }

    /// <summary>
    /// Update project status
    /// </summary>
    [HttpPut("{id:guid}/status")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<ProjectDto>>> UpdateProjectStatus(
        Guid id, 
        [FromBody] UpdateProjectStatusRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<ProjectDto>.ErrorResponse("Invalid user ID"));

            var project = await _projectService.UpdateProjectStatusAsync(id, request.Status, userId);

            _logger.LogInformation(
                "Project {ProjectId} status updated to {Status} by user {UserId}", 
                id, request.Status, userId);

            return Ok(ApiResponse<ProjectDto>.SuccessResponse(
                project, "Status updated successfully"));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(ApiResponse<ProjectDto>.ErrorResponse("Project not found"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ProjectDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating project status {ProjectId}", id);
            return StatusCode(500, ApiResponse<ProjectDto>.ErrorResponse(
                "An error occurred while updating the status"));
        }
    }

    /// <summary>
    /// Get project pages (placeholder for future)
    /// </summary>
    [HttpGet("{id:guid}/pages")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<object>>> GetProjectPages(Guid id)
    {
        // TODO: Implement in Phase 9 (Page Builder)
        await Task.CompletedTask;
        return Ok(ApiResponse<object>.SuccessResponse(
            new { pages = Array.Empty<object>(), message = "Coming soon" }, 
            "Feature coming in Phase 9"));
    }
}
