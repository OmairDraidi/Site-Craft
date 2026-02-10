using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Infrastructure.Services;

public class TenantService : ITenantService
{
    private Guid? _currentTenantId;
    
    public Guid? GetCurrentTenantId() => _currentTenantId;
    
    public Task<Tenant?> GetCurrentTenantAsync()
    {
        // Note: This method is kept for interface compatibility
        // but actual tenant retrieval should be done via DbContext directly in controllers/services
        throw new NotImplementedException("Use DbContext directly to retrieve tenant information");
    }
    
    public void SetCurrentTenant(Guid tenantId)
    {
        _currentTenantId = tenantId;
    }
}
