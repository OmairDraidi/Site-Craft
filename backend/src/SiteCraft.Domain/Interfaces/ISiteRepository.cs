using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

/// <summary>
/// Repository interface for Site entity operations
/// </summary>
public interface ISiteRepository
{
    /// <summary>
    /// Gets all sites for a specific tenant
    /// </summary>
    Task<IEnumerable<Site>> GetByTenantIdAsync(Guid tenantId);
    
    /// <summary>
    /// Gets a site by its ID
    /// </summary>
    Task<Site?> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Checks if a tenant already has a site
    /// </summary>
    Task<bool> ExistsByTenantIdAsync(Guid tenantId);
    
    /// <summary>
    /// Gets the first site for a tenant (primary site)
    /// </summary>
    Task<Site?> GetFirstByTenantIdAsync(Guid tenantId);
    
    /// <summary>
    /// Gets a site by its associated project ID
    /// </summary>
    Task<Site?> GetByProjectIdAsync(Guid projectId);
    
    /// <summary>
    /// Creates a new site
    /// </summary>
    Task<Site> CreateAsync(Site site);
    
    /// <summary>
    /// Updates an existing site
    /// </summary>
    Task UpdateAsync(Site site);
    
    /// <summary>
    /// Deletes a site
    /// </summary>
    Task DeleteAsync(Guid id);
}
