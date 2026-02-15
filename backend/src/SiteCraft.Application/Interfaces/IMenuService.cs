using SiteCraft.Application.DTOs.Menus;

namespace SiteCraft.Application.Interfaces;

public interface IMenuService
{
    // Menu operations
    Task<IEnumerable<MenuListItemDto>> GetMenusAsync(Guid siteId, Guid tenantId);
    Task<MenuDto?> GetMenuByIdAsync(Guid id);
    Task<MenuDto> CreateMenuAsync(CreateMenuRequest request, Guid userId, Guid tenantId);
    Task<MenuDto> UpdateMenuAsync(Guid id, UpdateMenuRequest request, Guid userId);
    Task<bool> DeleteMenuAsync(Guid id, Guid userId);
    
    // MenuItem operations
    Task<MenuItemDto> CreateMenuItemAsync(CreateMenuItemRequest request, Guid userId, Guid tenantId);
    Task<MenuItemDto> UpdateMenuItemAsync(Guid id, UpdateMenuItemRequest request, Guid userId);
    Task<bool> DeleteMenuItemAsync(Guid id, Guid userId);
    Task<MenuDto> ReorderMenuItemsAsync(Guid menuId, ReorderMenuItemsRequest request, Guid userId);
}
