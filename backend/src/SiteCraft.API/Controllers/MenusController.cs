using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiteCraft.Application.DTOs.Common;
using SiteCraft.Application.DTOs.Menus;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Authorization;

namespace SiteCraft.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/menus")]
public class MenusController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly ITenantService _tenantService;
    private readonly ILogger<MenusController> _logger;

    public MenusController(
        IMenuService menuService,
        ITenantService tenantService,
        ILogger<MenusController> logger)
    {
        _menuService = menuService;
        _tenantService = tenantService;
        _logger = logger;
    }

    /// <summary>
    /// Get all menus for a site
    /// </summary>
    [HttpGet]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<IEnumerable<MenuListItemDto>>>> GetMenus([FromQuery] Guid siteId)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<IEnumerable<MenuListItemDto>>.ErrorResponse("Tenant not found"));

            if (siteId == Guid.Empty)
                return BadRequest(ApiResponse<IEnumerable<MenuListItemDto>>.ErrorResponse("Site ID is required"));

            var menus = await _menuService.GetMenusAsync(siteId, currentTenantId.Value);

            _logger.LogInformation("Menus retrieved for site {SiteId}. Count: {Count}", siteId, menus.Count());

            return Ok(ApiResponse<IEnumerable<MenuListItemDto>>.SuccessResponse(
                menus, "Menus retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menus for site");
            return StatusCode(500, ApiResponse<IEnumerable<MenuListItemDto>>.ErrorResponse(
                "An error occurred while retrieving menus"));
        }
    }

    /// <summary>
    /// Get menu details by ID with items
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<MenuDto>>> GetMenuById(Guid id)
    {
        try
        {
            var menu = await _menuService.GetMenuByIdAsync(id);
            if (menu == null)
                return NotFound(ApiResponse<MenuDto>.ErrorResponse("Menu not found"));

            _logger.LogInformation("Menu retrieved: {MenuId}", id);

            return Ok(ApiResponse<MenuDto>.SuccessResponse(menu, "Menu retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving menu {MenuId}", id);
            return StatusCode(500, ApiResponse<MenuDto>.ErrorResponse(
                "An error occurred while retrieving the menu"));
        }
    }

    /// <summary>
    /// Create a new menu
    /// </summary>
    [HttpPost]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<MenuDto>>> CreateMenu([FromBody] CreateMenuRequest request)
    {
        try
        {
            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<MenuDto>.ErrorResponse("Tenant not found"));

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<MenuDto>.ErrorResponse("Invalid user ID"));

            var menu = await _menuService.CreateMenuAsync(request, userId, currentTenantId.Value);

            _logger.LogInformation("Menu created: {MenuId} by user {UserId}", menu.Id, userId);

            return CreatedAtAction(
                nameof(GetMenuById),
                new { id = menu.Id },
                ApiResponse<MenuDto>.SuccessResponse(menu, "Menu created successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Site not found during menu creation");
            return NotFound(ApiResponse<MenuDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized menu creation attempt");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating menu");
            return StatusCode(500, ApiResponse<MenuDto>.ErrorResponse(
                "An error occurred while creating the menu"));
        }
    }

    /// <summary>
    /// Update an existing menu
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<MenuDto>>> UpdateMenu(Guid id, [FromBody] UpdateMenuRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<MenuDto>.ErrorResponse("Invalid user ID"));

            var menu = await _menuService.UpdateMenuAsync(id, request, userId);

            _logger.LogInformation("Menu updated: {MenuId} by user {UserId}", id, userId);

            return Ok(ApiResponse<MenuDto>.SuccessResponse(menu, "Menu updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Menu not found during update");
            return NotFound(ApiResponse<MenuDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized menu update attempt");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating menu {MenuId}", id);
            return StatusCode(500, ApiResponse<MenuDto>.ErrorResponse(
                "An error occurred while updating the menu"));
        }
    }

    /// <summary>
    /// Delete a menu
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteMenu(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<bool>.ErrorResponse("Invalid user ID"));

            var result = await _menuService.DeleteMenuAsync(id, userId);
            if (!result)
                return NotFound(ApiResponse<bool>.ErrorResponse("Menu not found"));

            _logger.LogInformation("Menu deleted: {MenuId} by user {UserId}", id, userId);

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Menu deleted successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized menu deletion attempt");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting menu {MenuId}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                "An error occurred while deleting the menu"));
        }
    }

    /// <summary>
    /// Add a new item to a menu
    /// </summary>
    [HttpPost("{id:guid}/items")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<MenuItemDto>>> CreateMenuItem(Guid id, [FromBody] CreateMenuItemRequest request)
    {
        try
        {
            // Ensure MenuId in request matches the URL parameter
            request.MenuId = id;

            var currentTenantId = _tenantService.GetCurrentTenantId();
            if (!currentTenantId.HasValue)
                return BadRequest(ApiResponse<MenuItemDto>.ErrorResponse("Tenant not found"));

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<MenuItemDto>.ErrorResponse("Invalid user ID"));

            var menuItem = await _menuService.CreateMenuItemAsync(request, userId, currentTenantId.Value);

            _logger.LogInformation("Menu item created: {ItemId} for menu {MenuId}", menuItem.Id, id);

            return Created($"/api/v1/menu-items/{menuItem.Id}",
                ApiResponse<MenuItemDto>.SuccessResponse(menuItem, "Menu item created successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Menu or parent not found during item creation");
            return NotFound(ApiResponse<MenuItemDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized menu item creation attempt");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating menu item");
            return StatusCode(500, ApiResponse<MenuItemDto>.ErrorResponse(
                "An error occurred while creating the menu item"));
        }
    }

    /// <summary>
    /// Update an existing menu item
    /// </summary>
    [HttpPut("items/{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<MenuItemDto>>> UpdateMenuItem(Guid id, [FromBody] UpdateMenuItemRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<MenuItemDto>.ErrorResponse("Invalid user ID"));

            var menuItem = await _menuService.UpdateMenuItemAsync(id, request, userId);

            _logger.LogInformation("Menu item updated: {ItemId}", id);

            return Ok(ApiResponse<MenuItemDto>.SuccessResponse(menuItem, "Menu item updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Menu item or parent not found during update");
            return NotFound(ApiResponse<MenuItemDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized menu item update attempt");
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument during menu item update");
            return BadRequest(ApiResponse<MenuItemDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating menu item {ItemId}", id);
            return StatusCode(500, ApiResponse<MenuItemDto>.ErrorResponse(
                "An error occurred while updating the menu item"));
        }
    }

    /// <summary>
    /// Delete a menu item
    /// </summary>
    [HttpDelete("items/{id:guid}")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteMenuItem(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<bool>.ErrorResponse("Invalid user ID"));

            var result = await _menuService.DeleteMenuItemAsync(id, userId);
            if (!result)
                return NotFound(ApiResponse<bool>.ErrorResponse("Menu item not found"));

            _logger.LogInformation("Menu item deleted: {ItemId}", id);

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Menu item deleted successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized menu item deletion attempt");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting menu item {ItemId}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                "An error occurred while deleting the menu item"));
        }
    }

    /// <summary>
    /// Reorder menu items
    /// </summary>
    [HttpPut("{id:guid}/reorder")]
    [Authorize(Policy = Policies.RequireAuthenticatedUser)]
    public async Task<ActionResult<ApiResponse<MenuDto>>> ReorderMenuItems(Guid id, [FromBody] ReorderMenuItemsRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return BadRequest(ApiResponse<MenuDto>.ErrorResponse("Invalid user ID"));

            var menu = await _menuService.ReorderMenuItemsAsync(id, request, userId);

            _logger.LogInformation("Menu items reordered for menu {MenuId}", id);

            return Ok(ApiResponse<MenuDto>.SuccessResponse(menu, "Menu items reordered successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Menu not found during reorder");
            return NotFound(ApiResponse<MenuDto>.ErrorResponse(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized menu items reorder attempt");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reordering menu items for menu {MenuId}", id);
            return StatusCode(500, ApiResponse<MenuDto>.ErrorResponse(
                "An error occurred while reordering menu items"));
        }
    }
}
