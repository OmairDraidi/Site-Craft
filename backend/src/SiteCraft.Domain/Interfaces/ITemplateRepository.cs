using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

public interface ITemplateRepository
{
    Task<Template?> GetByIdAsync(Guid id);
    Task<IEnumerable<Template>> GetAllAsync(Guid? tenantId = null);
    Task<IEnumerable<Template>> GetPublicTemplatesAsync();
    Task<IEnumerable<Template>> GetByFilterAsync(
        string? category = null, 
        bool? isPremium = null, 
        string? searchTerm = null,
        Guid? tenantId = null);
    Task<Template> CreateAsync(Template template);
    Task UpdateAsync(Template template);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task IncrementUsageCountAsync(Guid id);
    
    // Favorite operations
    Task<bool> ToggleFavoriteAsync(Guid templateId, Guid userId, Guid tenantId);
    Task<IEnumerable<Template>> GetFavoritesByUserAsync(Guid userId, Guid tenantId);
    Task<bool> IsFavoritedAsync(Guid templateId, Guid userId);
}
