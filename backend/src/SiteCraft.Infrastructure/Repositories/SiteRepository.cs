using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.Infrastructure.Repositories;

public class SiteRepository : ISiteRepository
{
    private readonly SiteCraftDbContext _context;

    public SiteRepository(SiteCraftDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Site>> GetByTenantIdAsync(Guid tenantId)
    {
        return await _context.Sites
            .Include(s => s.Template)
            .Include(s => s.User)
            .Where(s => s.TenantId == tenantId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<Site?> GetByIdAsync(Guid id)
    {
        return await _context.Sites
            .Include(s => s.Template)
            .Include(s => s.User)
            .Include(s => s.Tenant)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<bool> ExistsByTenantIdAsync(Guid tenantId)
    {
        return await _context.Sites.AnyAsync(s => s.TenantId == tenantId);
    }

    public async Task<Site?> GetFirstByTenantIdAsync(Guid tenantId)
    {
        return await _context.Sites
            .Include(s => s.Template)
            .Where(s => s.TenantId == tenantId)
            .OrderBy(s => s.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<Site?> GetByProjectIdAsync(Guid projectId)
    {
        return await _context.Sites
            .Include(s => s.Template)
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.ProjectId == projectId);
    }

    public async Task<Site> CreateAsync(Site site)
    {
        _context.Sites.Add(site);
        await _context.SaveChangesAsync();
        return site;
    }

    public async Task UpdateAsync(Site site)
    {
        site.UpdatedAt = DateTime.UtcNow;
        _context.Sites.Update(site);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var site = await _context.Sites.FindAsync(id);
        if (site != null)
        {
            _context.Sites.Remove(site);
            await _context.SaveChangesAsync();
        }
    }
}
