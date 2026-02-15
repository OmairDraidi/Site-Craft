using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

/// <summary>
/// Repository interface for Menu and MenuItem entity operations
/// </summary>
public interface IMenuRepository
{
    // Menu operations
    Task<IEnumerable<Menu>> GetBySiteIdAsync(Guid siteId);
    Task<Menu?> GetByIdAsync(Guid id);
    Task<Menu> CreateAsync(Menu menu);
    Task UpdateAsync(Menu menu);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    
    // MenuItem operations
    Task<MenuItem?> GetMenuItemByIdAsync(Guid id);
    Task<IEnumerable<MenuItem>> GetMenuItemsByMenuIdAsync(Guid menuId);
    Task<MenuItem> CreateMenuItemAsync(MenuItem item);
    Task UpdateMenuItemAsync(MenuItem item);
    Task DeleteMenuItemAsync(Guid id);
    Task<bool> MenuItemExistsAsync(Guid id);
    
    // Special operations
    Task<int> GetItemCountByMenuIdAsync(Guid menuId);
    Task ReorderItemsAsync(List<MenuItem> items);
}
