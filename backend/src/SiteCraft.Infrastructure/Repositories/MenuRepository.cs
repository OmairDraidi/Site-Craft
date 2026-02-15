using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.Infrastructure.Repositories;

public class MenuRepository : IMenuRepository
{
    private readonly SiteCraftDbContext _context;

    public MenuRepository(SiteCraftDbContext context)
    {
        _context = context;
    }

    // Menu operations
    public async Task<IEnumerable<Menu>> GetBySiteIdAsync(Guid siteId)
    {
        return await _context.Menus
            .Where(m => m.SiteId == siteId)
            .OrderBy(m => m.Location)
            .ThenBy(m => m.Name)
            .ToListAsync();
    }

    public async Task<Menu?> GetByIdAsync(Guid id)
    {
        return await _context.Menus
            .Include(m => m.Items.OrderBy(i => i.Order))
            .Include(m => m.Site)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<Menu> CreateAsync(Menu menu)
    {
        _context.Menus.Add(menu);
        await _context.SaveChangesAsync();
        return menu;
    }

    public async Task UpdateAsync(Menu menu)
    {
        menu.UpdatedAt = DateTime.UtcNow;
        _context.Menus.Update(menu);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var menu = await _context.Menus.FindAsync(id);
        if (menu != null)
        {
            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Menus.AnyAsync(m => m.Id == id);
    }

    // MenuItem operations
    public async Task<MenuItem?> GetMenuItemByIdAsync(Guid id)
    {
        return await _context.MenuItems
            .Include(mi => mi.Menu)
            .Include(mi => mi.Parent)
            .Include(mi => mi.Children)
            .FirstOrDefaultAsync(mi => mi.Id == id);
    }

    public async Task<IEnumerable<MenuItem>> GetMenuItemsByMenuIdAsync(Guid menuId)
    {
        return await _context.MenuItems
            .Where(mi => mi.MenuId == menuId)
            .OrderBy(mi => mi.Order)
            .ToListAsync();
    }

    public async Task<MenuItem> CreateMenuItemAsync(MenuItem item)
    {
        _context.MenuItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task UpdateMenuItemAsync(MenuItem item)
    {
        item.UpdatedAt = DateTime.UtcNow;
        _context.MenuItems.Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteMenuItemAsync(Guid id)
    {
        var item = await _context.MenuItems.FindAsync(id);
        if (item != null)
        {
            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> MenuItemExistsAsync(Guid id)
    {
        return await _context.MenuItems.AnyAsync(mi => mi.Id == id);
    }

    // Special operations
    public async Task<int> GetItemCountByMenuIdAsync(Guid menuId)
    {
        return await _context.MenuItems.CountAsync(mi => mi.MenuId == menuId);
    }

    public async Task ReorderItemsAsync(List<MenuItem> items)
    {
        foreach (var item in items)
        {
            item.UpdatedAt = DateTime.UtcNow;
            _context.MenuItems.Update(item);
        }
        await _context.SaveChangesAsync();
    }
}
