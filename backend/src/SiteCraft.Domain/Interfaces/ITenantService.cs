using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

public interface ITenantService
{
    Guid? GetCurrentTenantId();
    Task<Tenant?> GetCurrentTenantAsync();
    void SetCurrentTenant(Guid tenantId);
}
