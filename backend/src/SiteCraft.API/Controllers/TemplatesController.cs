using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiteCraft.Application.DTOs.Common;
using SiteCraft.Application.DTOs.Templates;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Authorization;

namespace SiteCraft.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/templates")]
public class TemplatesController : ControllerBase
{
    private readonly ITemplateService _templateService;
    private readonly ITenantService _tenantService;
    private readonly ILogger<TemplatesController> _logger;

    public TemplatesController(
        ITemplateService templateService,
        ITenantService tenantService,
        ILogger<TemplatesController> logger)
    {
        _templateService = templateService;
        _tenantService = tenantService;
        _logger = logger;
    }

    /// <summary>
    /// Get all templates with optional filtering (Category, Premium, Search)
    /// </summary>
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TemplateDto>>>> GetTemplates(
        [FromQuery] string? category = null,
        [FromQuery] bool? isPremium = null,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            
            var filter = new TemplateFilterRequest
            {
                Category = category,
                IsPremium = isPremium,
                SearchTerm = searchTerm
            };

            var templates = await _templateService.GetFilteredTemplatesAsync(filter, currentTenantId);

            _logger.LogInformation(
                "Templates retrieved successfully. TenantId: {TenantId}, Category: {Category}, IsPremium: {IsPremium}, Search: {Search}, Count: {Count}",
                currentTenantId, category, isPremium, searchTerm, templates.Count());

            return Ok(ApiResponse<IEnumerable<TemplateDto>>.SuccessResponse(
                templates, 
                "Templates retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving templates");
            return StatusCode(500, ApiResponse<IEnumerable<TemplateDto>>.ErrorResponse(
                "An error occurred while retrieving templates"));
        }
    }

    /// <summary>
    /// Get template by ID
    /// </summary>
    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<TemplateDto>>> GetTemplateById(Guid id)
    {
        try
        {
            var template = await _templateService.GetTemplateByIdAsync(id);

            if (template == null)
            {
                _logger.LogWarning("Template not found. TemplateId: {TemplateId}", id);
                return NotFound(ApiResponse<TemplateDto>.ErrorResponse("Template not found"));
            }

            _logger.LogInformation("Template retrieved successfully. TemplateId: {TemplateId}", id);

            return Ok(ApiResponse<TemplateDto>.SuccessResponse(
                template, 
                "Template retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving template. TemplateId: {TemplateId}", id);
            return StatusCode(500, ApiResponse<TemplateDto>.ErrorResponse(
                "An error occurred while retrieving the template"));
        }
    }

    /// <summary>
    /// Create a new template (Owner/Admin only)
    /// Global templates: TenantId = null
    /// Private templates: TenantId = current tenant
    /// </summary>
    [HttpPost]
    [Authorize(Policy = Policies.RequireAdminRole)]
    public async Task<ActionResult<ApiResponse<TemplateDto>>> CreateTemplate(
        [FromBody] CreateTemplateRequest request)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Only Owner can create global templates (TenantId = null)
            Guid? tenantId = userRole == "Owner" ? null : currentTenantId;

            var template = await _templateService.CreateTemplateAsync(request, tenantId);

            _logger.LogInformation(
                "Template created successfully. TemplateId: {TemplateId}, Name: {Name}, TenantId: {TenantId}, CreatedBy: {UserId}",
                template.Id, template.Name, tenantId, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return CreatedAtAction(
                nameof(GetTemplateById),
                new { id = template.Id },
                ApiResponse<TemplateDto>.SuccessResponse(template, "Template created successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating template. Name: {Name}", request.Name);
            return StatusCode(500, ApiResponse<TemplateDto>.ErrorResponse(
                "An error occurred while creating the template"));
        }
    }

    /// <summary>
    /// Update an existing template (Owner/Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdminRole)]
    public async Task<ActionResult<ApiResponse<TemplateDto>>> UpdateTemplate(
        Guid id,
        [FromBody] UpdateTemplateRequest request)
    {
        try
        {
            var existingTemplate = await _templateService.GetTemplateByIdAsync(id);

            if (existingTemplate == null)
            {
                _logger.LogWarning("Template not found for update. TemplateId: {TemplateId}", id);
                return NotFound(ApiResponse<TemplateDto>.ErrorResponse("Template not found"));
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentTenantId = _tenantService.GetCurrentTenantId();

            // Only Owner can update global templates
            if (existingTemplate.TenantId == null && userRole != "Owner")
            {
                _logger.LogWarning(
                    "Unauthorized attempt to update global template. TemplateId: {TemplateId}, UserId: {UserId}",
                    id, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                return Forbid();
            }

            // Admin can only update templates belonging to their tenant
            if (existingTemplate.TenantId != null && 
                existingTemplate.TenantId != currentTenantId && 
                userRole != "Owner")
            {
                _logger.LogWarning(
                    "Unauthorized attempt to update template from different tenant. TemplateId: {TemplateId}, UserId: {UserId}",
                    id, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                return Forbid();
            }

            var template = await _templateService.UpdateTemplateAsync(id, request);

            _logger.LogInformation(
                "Template updated successfully. TemplateId: {TemplateId}, Name: {Name}, UpdatedBy: {UserId}",
                template.Id, template.Name, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return Ok(ApiResponse<TemplateDto>.SuccessResponse(
                template, 
                "Template updated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating template. TemplateId: {TemplateId}", id);
            return StatusCode(500, ApiResponse<TemplateDto>.ErrorResponse(
                "An error occurred while updating the template"));
        }
    }

    /// <summary>
    /// Delete a template (Owner/Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Policies.RequireAdminRole)]
    public async Task<ActionResult<ApiResponse>> DeleteTemplate(Guid id)
    {
        try
        {
            var existingTemplate = await _templateService.GetTemplateByIdAsync(id);

            if (existingTemplate == null)
            {
                _logger.LogWarning("Template not found for deletion. TemplateId: {TemplateId}", id);
                return NotFound(ApiResponse.ErrorResponse("Template not found"));
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentTenantId = _tenantService.GetCurrentTenantId();

            // Only Owner can delete global templates
            if (existingTemplate.TenantId == null && userRole != "Owner")
            {
                _logger.LogWarning(
                    "Unauthorized attempt to delete global template. TemplateId: {TemplateId}, UserId: {UserId}",
                    id, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                return Forbid();
            }

            // Admin can only delete templates belonging to their tenant
            if (existingTemplate.TenantId != null && 
                existingTemplate.TenantId != currentTenantId && 
                userRole != "Owner")
            {
                _logger.LogWarning(
                    "Unauthorized attempt to delete template from different tenant. TemplateId: {TemplateId}, UserId: {UserId}",
                    id, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                return Forbid();
            }

            var result = await _templateService.DeleteTemplateAsync(id);

            if (!result)
            {
                _logger.LogWarning("Failed to delete template. TemplateId: {TemplateId}", id);
                return BadRequest(ApiResponse.ErrorResponse("Failed to delete template"));
            }

            _logger.LogInformation(
                "Template deleted successfully. TemplateId: {TemplateId}, DeletedBy: {UserId}",
                id, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            return Ok(ApiResponse.SuccessResponse(new { }, "Template deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting template. TemplateId: {TemplateId}", id);
            return StatusCode(500, ApiResponse.ErrorResponse(
                "An error occurred while deleting the template"));
        }
    }

    /// <summary>
    /// Apply a template to the current user's site (requires authentication)
    /// </summary>
    [HttpPost("{id:guid}/apply")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse>> ApplyTemplate(Guid id)
    {
        try
        {
            var template = await _templateService.GetTemplateByIdAsync(id);

            if (template == null)
            {
                _logger.LogWarning("Template not found for apply. TemplateId: {TemplateId}", id);
                return NotFound(ApiResponse.ErrorResponse("Template not found"));
            }

            var currentTenantId = _tenantService.GetCurrentTenantId();

            if (!currentTenantId.HasValue)
            {
                _logger.LogWarning("Tenant not found when applying template. TemplateId: {TemplateId}", id);
                return BadRequest(ApiResponse.ErrorResponse("Tenant not found"));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                _logger.LogWarning("Invalid user ID when applying template. TemplateId: {TemplateId}", id);
                return BadRequest(ApiResponse.ErrorResponse("Invalid user ID"));
            }

            var result = await _templateService.ApplyTemplateAsync(id, userId, currentTenantId.Value);

            if (!result)
            {
                _logger.LogWarning(
                    "Failed to apply template. TemplateId: {TemplateId}, UserId: {UserId}, TenantId: {TenantId}",
                    id, userId, currentTenantId.Value);
                return BadRequest(ApiResponse.ErrorResponse("Failed to apply template"));
            }

            _logger.LogInformation(
                "Template applied successfully. TemplateId: {TemplateId}, UserId: {UserId}, TenantId: {TenantId}",
                id, userId, currentTenantId.Value);

            return Ok(ApiResponse.SuccessResponse(new { }, "Template applied successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access when applying template. TemplateId: {TemplateId}", id);
            return StatusCode(403, ApiResponse.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error applying template. TemplateId: {TemplateId}", id);
            return StatusCode(500, ApiResponse.ErrorResponse(
                "An error occurred while applying the template"));
        }
    }

    /// <summary>
    /// Toggle favorite status for a template (requires authentication)
    /// </summary>
    [HttpPost("{id:guid}/favorite")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<object>>> ToggleFavorite(Guid id)
    {
        try
        {
            var template = await _templateService.GetTemplateByIdAsync(id);

            if (template == null)
            {
                _logger.LogWarning("Template not found for favorite toggle. TemplateId: {TemplateId}", id);
                return NotFound(ApiResponse<object>.ErrorResponse("Template not found"));
            }

            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
            {
                _logger.LogWarning("Tenant not found when toggling favorite. TemplateId: {TemplateId}", id);
                return BadRequest(ApiResponse<object>.ErrorResponse("Tenant not found"));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                _logger.LogWarning("Invalid user ID when toggling favorite. TemplateId: {TemplateId}", id);
                return BadRequest(ApiResponse<object>.ErrorResponse("Invalid user ID"));
            }

            var isFavorited = await _templateService.ToggleFavoriteAsync(id, userId, currentTenantId.Value);

            _logger.LogInformation(
                "Template favorite toggled. TemplateId: {TemplateId}, UserId: {UserId}, IsFavorited: {IsFavorited}",
                id, userId, isFavorited);

            return Ok(ApiResponse<object>.SuccessResponse(
                new { isFavorited }, 
                isFavorited ? "Template added to favorites" : "Template removed from favorites"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling favorite. TemplateId: {TemplateId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "An error occurred while toggling favorite"));
        }
    }

    /// <summary>
    /// Get all favorite templates for the current user (requires authentication)
    /// </summary>
    [HttpGet("favorites")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<IEnumerable<TemplateDto>>>> GetFavorites()
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
            {
                _logger.LogWarning("Tenant not found when getting favorites");
                return BadRequest(ApiResponse<IEnumerable<TemplateDto>>.ErrorResponse("Tenant not found"));
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                _logger.LogWarning("Invalid user ID when getting favorites");
                return BadRequest(ApiResponse<IEnumerable<TemplateDto>>.ErrorResponse("Invalid user ID"));
            }

            var favorites = await _templateService.GetUserFavoritesAsync(userId, currentTenantId.Value);

            _logger.LogInformation(
                "Retrieved {Count} favorites for user {UserId}",
                favorites.Count(), userId);

            return Ok(ApiResponse<IEnumerable<TemplateDto>>.SuccessResponse(favorites));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting favorites");
            return StatusCode(500, ApiResponse<IEnumerable<TemplateDto>>.ErrorResponse(
                "An error occurred while retrieving favorites"));
        }
    }
}
