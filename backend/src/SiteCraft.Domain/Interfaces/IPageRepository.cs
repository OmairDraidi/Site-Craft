using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

/// <summary>
/// Repository interface for Page entity operations
/// </summary>
public interface IPageRepository
{
    Task<IEnumerable<Page>> GetBySiteIdAsync(Guid siteId);
    Task<Page?> GetByIdAsync(Guid id);
    Task<Page?> GetBySlugAsync(string slug, Guid siteId);
    Task<bool> SlugExistsAsync(string slug, Guid siteId, Guid? excludePageId = null);
    Task<Page> CreateAsync(Page page);
    Task UpdateAsync(Page page);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetCountBySiteAsync(Guid siteId);
}
