using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly SiteCraftDbContext _context;

    public ProjectRepository(SiteCraftDbContext context)
    {
        _context = context;
    }

    public async Task<Project?> GetByIdAsync(Guid id)
    {
        return await _context.Projects
            .Include(p => p.User)
            .Include(p => p.Tenant)
            .Include(p => p.Template)
            .Include(p => p.Site)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Project>> GetByUserIdAsync(Guid userId, Guid tenantId)
    {
        return await _context.Projects
            .Include(p => p.User)
            .Include(p => p.Template)
            .Where(p => p.UserId == userId && p.TenantId == tenantId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Project>> GetByTenantIdAsync(Guid tenantId)
    {
        return await _context.Projects
            .Include(p => p.User)
            .Include(p => p.Template)
            .Where(p => p.TenantId == tenantId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Project> CreateAsync(Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task UpdateAsync(Project project)
    {
        project.UpdatedAt = DateTime.UtcNow;
        _context.Projects.Update(project);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project != null)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Projects.AnyAsync(p => p.Id == id);
    }

    public async Task<int> GetCountByUserAsync(Guid userId, Guid tenantId)
    {
        return await _context.Projects
            .CountAsync(p => p.UserId == userId && p.TenantId == tenantId);
    }
}
