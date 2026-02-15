using Microsoft.Extensions.Logging;
using SiteCraft.Application.DTOs.Menus;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Infrastructure.Services;

public class MenuService : IMenuService
{
    private readonly IMenuRepository _menuRepository;
    private readonly ISiteRepository _siteRepository;
    private readonly ILogger<MenuService> _logger;

    public MenuService(
        IMenuRepository menuRepository,
        ISiteRepository siteRepository,
        ILogger<MenuService> logger)
    {
        _menuRepository = menuRepository;
        _siteRepository = siteRepository;
        _logger = logger;
    }

    // Menu operations
    public async Task<IEnumerable<MenuListItemDto>> GetMenusAsync(Guid siteId, Guid tenantId)
    {
        _logger.LogInformation("Getting menus for site {SiteId} in tenant {TenantId}", siteId, tenantId);
        var menus = await _menuRepository.GetBySiteIdAsync(siteId);
        
        var menuList = new List<MenuListItemDto>();
        foreach (var menu in menus)
        {
            var itemCount = await _menuRepository.GetItemCountByMenuIdAsync(menu.Id);
            menuList.Add(new MenuListItemDto
            {
                Id = menu.Id,
                Name = menu.Name,
                Location = menu.Location,
                ItemCount = itemCount,
                CreatedAt = menu.CreatedAt
            });
        }
        
        return menuList;
    }

    public async Task<MenuDto?> GetMenuByIdAsync(Guid id)
    {
        _logger.LogInformation("Getting menu by ID: {MenuId}", id);
        var menu = await _menuRepository.GetByIdAsync(id);
        if (menu == null) return null;
        
        return MapToDto(menu);
    }

    public async Task<MenuDto> CreateMenuAsync(CreateMenuRequest request, Guid userId, Guid tenantId)
    {
        _logger.LogInformation("Creating menu: {MenuName} for site {SiteId}", request.Name, request.SiteId);

        // Validate site exists and belongs to user
        var site = await _siteRepository.GetByIdAsync(request.SiteId);
        if (site == null)
            throw new KeyNotFoundException($"Site with ID {request.SiteId} not found");
        
        if (site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to create menus for this site");

        var menu = new Menu
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            SiteId = request.SiteId,
            Name = request.Name,
            Location = request.Location,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _menuRepository.CreateAsync(menu);
        _logger.LogInformation("Menu created successfully: {MenuId}", created.Id);

        return await GetMenuByIdAsync(created.Id)
            ?? throw new InvalidOperationException("Failed to retrieve created menu");
    }

    public async Task<MenuDto> UpdateMenuAsync(Guid id, UpdateMenuRequest request, Guid userId)
    {
        _logger.LogInformation("Updating menu: {MenuId}", id);
        var menu = await _menuRepository.GetByIdAsync(id);
        if (menu == null)
            throw new KeyNotFoundException($"Menu with ID {id} not found");

        // Validate ownership through site
        var site = await _siteRepository.GetByIdAsync(menu.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to update this menu");

        // Partial update
        if (!string.IsNullOrWhiteSpace(request.Name))
            menu.Name = request.Name;

        if (!string.IsNullOrWhiteSpace(request.Location))
            menu.Location = request.Location;

        await _menuRepository.UpdateAsync(menu);
        _logger.LogInformation("Menu updated successfully: {MenuId}", id);

        return await GetMenuByIdAsync(menu.Id)
            ?? throw new InvalidOperationException("Failed to retrieve updated menu");
    }

    public async Task<bool> DeleteMenuAsync(Guid id, Guid userId)
    {
        _logger.LogInformation("Deleting menu: {MenuId}", id);
        var menu = await _menuRepository.GetByIdAsync(id);
        if (menu == null) return false;

        // Validate ownership through site
        var site = await _siteRepository.GetByIdAsync(menu.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this menu");

        await _menuRepository.DeleteAsync(id);
        _logger.LogInformation("Menu deleted successfully: {MenuId}", id);
        return true;
    }

    // MenuItem operations
    public async Task<MenuItemDto> CreateMenuItemAsync(CreateMenuItemRequest request, Guid userId, Guid tenantId)
    {
        _logger.LogInformation("Creating menu item: {Label} for menu {MenuId}", request.Label, request.MenuId);

        // Validate menu exists and ownership
        var menu = await _menuRepository.GetByIdAsync(request.MenuId);
        if (menu == null)
            throw new KeyNotFoundException($"Menu with ID {request.MenuId} not found");
        
        var site = await _siteRepository.GetByIdAsync(menu.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to create items for this menu");

        // Validate parent exists if specified
        if (request.ParentId.HasValue)
        {
            var parentExists = await _menuRepository.MenuItemExistsAsync(request.ParentId.Value);
            if (!parentExists)
                throw new KeyNotFoundException($"Parent menu item with ID {request.ParentId.Value} not found");
        }

        // Calculate order
        var items = await _menuRepository.GetMenuItemsByMenuIdAsync(request.MenuId);
        var order = request.Order ?? items.Count();

        var menuItem = new MenuItem
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            MenuId = request.MenuId,
            Label = request.Label,
            Url = request.Url,
            ParentId = request.ParentId,
            Target = request.Target ?? "_self",
            Order = order,
            IsVisible = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _menuRepository.CreateMenuItemAsync(menuItem);
        _logger.LogInformation("Menu item created successfully: {ItemId}", created.Id);

        return MapMenuItemToDto(created);
    }

    public async Task<MenuItemDto> UpdateMenuItemAsync(Guid id, UpdateMenuItemRequest request, Guid userId)
    {
        _logger.LogInformation("Updating menu item: {ItemId}", id);
        var item = await _menuRepository.GetMenuItemByIdAsync(id);
        if (item == null)
            throw new KeyNotFoundException($"Menu item with ID {id} not found");

        // Validate ownership through menu -> site
        var menu = await _menuRepository.GetByIdAsync(item.MenuId);
        if (menu == null)
            throw new KeyNotFoundException("Associated menu not found");
        
        var site = await _siteRepository.GetByIdAsync(menu.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to update this menu item");

        // Validate parent if changing
        if (request.ParentId.HasValue)
        {
            if (request.ParentId.Value == item.Id)
                throw new ArgumentException("Menu item cannot be its own parent");
            
            var parentExists = await _menuRepository.MenuItemExistsAsync(request.ParentId.Value);
            if (!parentExists)
                throw new KeyNotFoundException($"Parent menu item with ID {request.ParentId.Value} not found");
        }

        // Partial update
        if (!string.IsNullOrWhiteSpace(request.Label))
            item.Label = request.Label;

        if (!string.IsNullOrWhiteSpace(request.Url))
            item.Url = request.Url;

        if (request.ParentId.HasValue)
            item.ParentId = request.ParentId;

        if (!string.IsNullOrWhiteSpace(request.Target))
            item.Target = request.Target;

        if (request.IsVisible.HasValue)
            item.IsVisible = request.IsVisible.Value;

        await _menuRepository.UpdateMenuItemAsync(item);
        _logger.LogInformation("Menu item updated successfully: {ItemId}", id);

        return MapMenuItemToDto(item);
    }

    public async Task<bool> DeleteMenuItemAsync(Guid id, Guid userId)
    {
        _logger.LogInformation("Deleting menu item: {ItemId}", id);
        var item = await _menuRepository.GetMenuItemByIdAsync(id);
        if (item == null) return false;

        // Validate ownership through menu -> site
        var menu = await _menuRepository.GetByIdAsync(item.MenuId);
        if (menu == null)
            return false;
        
        var site = await _siteRepository.GetByIdAsync(menu.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this menu item");

        await _menuRepository.DeleteMenuItemAsync(id);
        _logger.LogInformation("Menu item deleted successfully: {ItemId}", id);
        return true;
    }

    public async Task<MenuDto> ReorderMenuItemsAsync(Guid menuId, ReorderMenuItemsRequest request, Guid userId)
    {
        _logger.LogInformation("Reordering items for menu: {MenuId}", menuId);
        
        // Validate menu exists and ownership
        var menu = await _menuRepository.GetByIdAsync(menuId);
        if (menu == null)
            throw new KeyNotFoundException($"Menu with ID {menuId} not found");
        
        var site = await _siteRepository.GetByIdAsync(menu.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to reorder items in this menu");

        // Fetch all items to update
        var itemsToUpdate = new List<MenuItem>();
        foreach (var reorderItem in request.Items)
        {
            var item = await _menuRepository.GetMenuItemByIdAsync(reorderItem.Id);
            if (item != null && item.MenuId == menuId)
            {
                item.Order = reorderItem.NewOrder;
                item.ParentId = reorderItem.NewParentId;
                itemsToUpdate.Add(item);
            }
        }

        await _menuRepository.ReorderItemsAsync(itemsToUpdate);
        _logger.LogInformation("Menu items reordered successfully: {MenuId}", menuId);

        return await GetMenuByIdAsync(menuId)
            ?? throw new InvalidOperationException("Failed to retrieve menu after reordering");
    }

    // Helper methods
    private MenuDto MapToDto(Menu menu)
    {
        var allItems = menu.Items.ToList();
        var rootItems = allItems.Where(i => i.ParentId == null).OrderBy(i => i.Order);
        
        return new MenuDto
        {
            Id = menu.Id,
            SiteId = menu.SiteId,
            Name = menu.Name,
            Location = menu.Location,
            CreatedAt = menu.CreatedAt,
            UpdatedAt = menu.UpdatedAt,
            Items = rootItems.Select(item => MapMenuItemToDtoRecursive(item, allItems)).ToList()
        };
    }

    private MenuItemDto MapMenuItemToDtoRecursive(MenuItem item, List<MenuItem> allItems)
    {
        var children = allItems.Where(i => i.ParentId == item.Id).OrderBy(i => i.Order);
        
        return new MenuItemDto
        {
            Id = item.Id,
            MenuId = item.MenuId,
            Label = item.Label,
            Url = item.Url,
            ParentId = item.ParentId,
            Order = item.Order,
            Target = item.Target,
            IsVisible = item.IsVisible,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
            Children = children.Select(child => MapMenuItemToDtoRecursive(child, allItems)).ToList()
        };
    }

    private MenuItemDto MapMenuItemToDto(MenuItem item)
    {
        return new MenuItemDto
        {
            Id = item.Id,
            MenuId = item.MenuId,
            Label = item.Label,
            Url = item.Url,
            ParentId = item.ParentId,
            Order = item.Order,
            Target = item.Target,
            IsVisible = item.IsVisible,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
            Children = new List<MenuItemDto>()
        };
    }
}
