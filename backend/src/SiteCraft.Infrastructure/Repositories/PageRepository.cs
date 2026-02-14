using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.Infrastructure.Repositories;

public class PageRepository : IPageRepository
{
    private readonly SiteCraftDbContext _context;

    public PageRepository(SiteCraftDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Page>> GetBySiteIdAsync(Guid siteId)
    {
        return await _context.Pages
            .Where(p => p.SiteId == siteId)
            .OrderBy(p => p.Order)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Page?> GetByIdAsync(Guid id)
    {
        return await _context.Pages
            .Include(p => p.Components)
            .Include(p => p.Site)
            .Include(p => p.Template)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Page?> GetBySlugAsync(string slug, Guid siteId)
    {
        return await _context.Pages
            .Include(p => p.Components)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.SiteId == siteId);
    }

    public async Task<bool> SlugExistsAsync(string slug, Guid siteId, Guid? excludePageId = null)
    {
        var query = _context.Pages.Where(p => p.Slug == slug && p.SiteId == siteId);
        
        if (excludePageId.HasValue)
        {
            query = query.Where(p => p.Id != excludePageId.Value);
        }
        
        return await query.AnyAsync();
    }

    public async Task<Page> CreateAsync(Page page)
    {
        _context.Pages.Add(page);
        await _context.SaveChangesAsync();
        return page;
    }

    public async Task UpdateAsync(Page page)
    {
        page.UpdatedAt = DateTime.UtcNow;
        _context.Pages.Update(page);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var page = await _context.Pages.FindAsync(id);
        if (page != null)
        {
            _context.Pages.Remove(page);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Pages.AnyAsync(p => p.Id == id);
    }

    public async Task<int> GetCountBySiteAsync(Guid siteId)
    {
        return await _context.Pages.CountAsync(p => p.SiteId == siteId);
    }
}
