using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiteCraft.Application.DTOs.Common;
using SiteCraft.Application.DTOs.Pages;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Authorization;

namespace SiteCraft.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/pages")]
public class PagesController : ControllerBase
{
    private readonly IPageService _pageService;
    private readonly ITenantService _tenantService;
    private readonly ILogger<PagesController> _logger;

    public PagesController(
        IPageService pageService,
        ITenantService tenantService,
        ILogger<PagesController> logger)
    {
        _pageService = pageService;
        _tenantService = tenantService;
        _logger = logger;
    }

    /// <summary>
    /// Get all pages for a site
    /// </summary>
    [HttpGet]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<IEnumerable<PageListItemDto>>>> GetPages([FromQuery] Guid siteId)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<IEnumerable<PageListItemDto>>.ErrorResponse("Tenant not found"));

            if (siteId == Guid.Empty)
                return BadRequest(ApiResponse<IEnumerable<PageListItemDto>>.ErrorResponse("Site ID is required"));

            var pages = await _pageService.GetPagesAsync(siteId, currentTenantId.Value);

            _logger.LogInformation("Pages retrieved for site {SiteId}. Count: {Count}", siteId, pages.Count());

            return Ok(ApiResponse<IEnumerable<PageListItemDto>>.SuccessResponse(
                pages, "Pages retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pages for site");
            return StatusCode(500, ApiResponse<IEnumerable<PageListItemDto>>.ErrorResponse(
                "An error occurred while retrieving pages"));
        }
    }

    /// <summary>
    /// Get page details by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<PageDto>>> GetPageById(Guid id)
    {
        try
        {
            var page = await _pageService.GetPageByIdAsync(id);
            if (page == null)
                return NotFound(ApiResponse<PageDto>.ErrorResponse("Page not found"));

            _logger.LogInformation("Page retrieved: {PageId}", id);

            return Ok(ApiResponse<PageDto>.SuccessResponse(page, "Page retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving page {PageId}", id);
            return StatusCode(500, ApiResponse<PageDto>.ErrorResponse(
                "An error occurred while retrieving the page"));
        }
    }

    /// <summary>
    /// Create a new page
    /// </summary>
    [HttpPost]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<PageDto>>> CreatePage([FromBody] CreatePageRequest request)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<PageDto>.ErrorResponse("Tenant not found"));

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<PageDto>.ErrorResponse("Invalid user ID"));

            var page = await _pageService.CreatePageAsync(request, userId, currentTenantId.Value);

            _logger.LogInformation("Page created: {PageId} by user {UserId}", page.Id, userId);

            return CreatedAtAction(
                nameof(GetPageById),
                new { id = page.Id },
                ApiResponse<PageDto>.SuccessResponse(page, "Page created successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Site not found during page creation");
            return NotFound(ApiResponse<PageDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized page creation attempt");
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid page creation request");
            return BadRequest(ApiResponse<PageDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating page");
            return StatusCode(500, ApiResponse<PageDto>.ErrorResponse(
                "An error occurred while creating the page"));
        }
    }

    /// <summary>
    /// Update an existing page
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<PageDto>>> UpdatePage(Guid id, [FromBody] UpdatePageRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<PageDto>.ErrorResponse("Invalid user ID"));

            var page = await _pageService.UpdatePageAsync(id, request, userId);

            _logger.LogInformation("Page updated: {PageId} by user {UserId}", id, userId);

            return Ok(ApiResponse<PageDto>.SuccessResponse(page, "Page updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Page not found for update: {PageId}", id);
            return NotFound(ApiResponse<PageDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized page update attempt: {PageId}", id);
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid page update request");
            return BadRequest(ApiResponse<PageDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating page {PageId}", id);
            return StatusCode(500, ApiResponse<PageDto>.ErrorResponse(
                "An error occurred while updating the page"));
        }
    }

    /// <summary>
    /// Delete a page
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<object>>> DeletePage(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<object>.ErrorResponse("Invalid user ID"));

            var deleted = await _pageService.DeletePageAsync(id, userId);
            if (!deleted)
                return NotFound(ApiResponse<object>.ErrorResponse("Page not found"));

            _logger.LogInformation("Page deleted: {PageId} by user {UserId}", id, userId);

            return Ok(ApiResponse<object>.SuccessResponse(null, "Page deleted successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized page deletion attempt: {PageId}", id);
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting page {PageId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "An error occurred while deleting the page"));
        }
    }

    /// <summary>
    /// Publish a page
    /// </summary>
    [HttpPost("{id:guid}/publish")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<PageDto>>> PublishPage(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<PageDto>.ErrorResponse("Invalid user ID"));

            var page = await _pageService.PublishPageAsync(id, userId);

            _logger.LogInformation("Page published: {PageId} by user {UserId}", id, userId);

            return Ok(ApiResponse<PageDto>.SuccessResponse(page, "Page published successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Page not found for publish: {PageId}", id);
            return NotFound(ApiResponse<PageDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized page publish attempt: {PageId}", id);
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing page {PageId}", id);
            return StatusCode(500, ApiResponse<PageDto>.ErrorResponse(
                "An error occurred while publishing the page"));
        }
    }

    /// <summary>
    /// Unpublish a page
    /// </summary>
    [HttpPost("{id:guid}/unpublish")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<PageDto>>> UnpublishPage(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<PageDto>.ErrorResponse("Invalid user ID"));

            var page = await _pageService.UnpublishPageAsync(id, userId);

            _logger.LogInformation("Page unpublished: {PageId} by user {UserId}", id, userId);

            return Ok(ApiResponse<PageDto>.SuccessResponse(page, "Page unpublished successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Page not found for unpublish: {PageId}", id);
            return NotFound(ApiResponse<PageDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized page unpublish attempt: {PageId}", id);
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unpublishing page {PageId}", id);
            return StatusCode(500, ApiResponse<PageDto>.ErrorResponse(
                "An error occurred while unpublishing the page"));
        }
    }
}
