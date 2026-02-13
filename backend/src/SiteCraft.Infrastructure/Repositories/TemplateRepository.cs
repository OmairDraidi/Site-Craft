using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.Infrastructure.Repositories;

public class TemplateRepository : ITemplateRepository
{
    private readonly SiteCraftDbContext _context;

    public TemplateRepository(SiteCraftDbContext context)
    {
        _context = context;
    }

    public async Task<Template?> GetByIdAsync(Guid id)
    {
        return await _context.Templates
            .Include(t => t.Tenant)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Template>> GetAllAsync(Guid? tenantId = null)
    {
        var query = _context.Templates.AsQueryable();

        if (tenantId.HasValue)
        {
            // Get templates for specific tenant (their private templates + global templates)
            query = query.Where(t => t.TenantId == tenantId || t.TenantId == null);
        }

        return await query
            .Include(t => t.Tenant)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Template>> GetPublicTemplatesAsync()
    {
        return await _context.Templates
            .Where(t => t.IsPublic && t.TenantId == null) // Only global public templates
            .Include(t => t.Tenant)
            .OrderByDescending(t => t.UsageCount)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Template>> GetByFilterAsync(
        string? category = null,
        bool? isPremium = null,
        string? searchTerm = null,
        Guid? tenantId = null)
    {
        var query = _context.Templates.AsQueryable();

        // Tenant filtering: show global templates + tenant's private templates
        if (tenantId.HasValue)
        {
            query = query.Where(t => t.TenantId == null || t.TenantId == tenantId);
        }
        else
        {
            // If no tenant specified, show only global templates
            query = query.Where(t => t.TenantId == null);
        }

        // Only public templates
        query = query.Where(t => t.IsPublic);

        // Category filter
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(t => t.Category == category);
        }

        // Premium filter
        if (isPremium.HasValue)
        {
            query = query.Where(t => t.IsPremium == isPremium.Value);
        }

        // Search filter (Name or Description)
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(t =>
                t.Name.Contains(searchTerm) ||
                t.Description.Contains(searchTerm));
        }

        return await query
            .Include(t => t.Tenant)
            .OrderByDescending(t => t.UsageCount)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<Template> CreateAsync(Template template)
    {
        template.CreatedAt = DateTime.UtcNow;
        template.UpdatedAt = DateTime.UtcNow;
        
        _context.Templates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task UpdateAsync(Template template)
    {
        template.UpdatedAt = DateTime.UtcNow;
        _context.Templates.Update(template);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var template = await _context.Templates.FindAsync(id);
        if (template != null)
        {
            _context.Templates.Remove(template);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Templates.AnyAsync(t => t.Id == id);
    }

    public async Task IncrementUsageCountAsync(Guid id)
    {
        var template = await _context.Templates.FindAsync(id);
        if (template != null)
        {
            template.UsageCount++;
            template.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ToggleFavoriteAsync(Guid templateId, Guid userId, Guid tenantId)
    {
        var existingFavorite = await _context.TemplateFavorites
            .FirstOrDefaultAsync(tf => tf.TemplateId == templateId && tf.UserId == userId);

        if (existingFavorite != null)
        {
            // Remove favorite
            _context.TemplateFavorites.Remove(existingFavorite);
            await _context.SaveChangesAsync();
            return false; // Unfavorited
        }
        else
        {
            // Add favorite
            var favorite = new TemplateFavorite
            {
                Id = Guid.NewGuid(),
                TemplateId = templateId,
                UserId = userId,
                TenantId = tenantId,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.TemplateFavorites.Add(favorite);
            await _context.SaveChangesAsync();
            return true; // Favorited
        }
    }

    public async Task<IEnumerable<Template>> GetFavoritesByUserAsync(Guid userId, Guid tenantId)
    {
        return await _context.TemplateFavorites
            .Where(tf => tf.UserId == userId && tf.TenantId == tenantId)
            .Include(tf => tf.Template)
            .ThenInclude(t => t!.Tenant)
            .Select(tf => tf.Template!)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> IsFavoritedAsync(Guid templateId, Guid userId)
    {
        return await _context.TemplateFavorites
            .AnyAsync(tf => tf.TemplateId == templateId && tf.UserId == userId);
    }
}
