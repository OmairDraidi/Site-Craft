using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

public interface IProjectRepository
{
    Task<Project?> GetByIdAsync(Guid id);
    Task<IEnumerable<Project>> GetByUserIdAsync(Guid userId, Guid tenantId);
    Task<IEnumerable<Project>> GetByTenantIdAsync(Guid tenantId);
    Task<Project> CreateAsync(Project project);
    Task UpdateAsync(Project project);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetCountByUserAsync(Guid userId, Guid tenantId);
}
