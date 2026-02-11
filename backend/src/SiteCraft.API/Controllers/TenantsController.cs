using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Enums;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/tenants")]
public class TenantsController : ControllerBase
{
    private readonly ITenantService _tenantService;
    private readonly SiteCraftDbContext _context;
    
    public TenantsController(ITenantService tenantService, SiteCraftDbContext context)
    {
        _tenantService = tenantService;
        _context = context;
    }
    
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentTenant()
    {
        var currentTenantId = _tenantService.GetCurrentTenantId();
        
        if (!currentTenantId.HasValue)
            return NotFound(new { message = "No tenant found" });
        
        var tenant = await _context.Tenants
            .FirstOrDefaultAsync(t => t.Id == currentTenantId.Value);
            
        if (tenant == null)
            return NotFound(new { message = "Tenant not found" });
            
        return Ok(new
        {
            id = tenant.Id,
            name = tenant.Name,
            subdomain = tenant.Subdomain,
            customDomain = tenant.CustomDomain,
            status = tenant.Status.ToString(),
            createdAt = tenant.CreatedAt
        });
    }
    
#if DEBUG
    [HttpPost("seed-demo")]
    public async Task<IActionResult> SeedDemoTenant()
    {
        // للتطوير فقط - إنشاء tenant تجريبي
        var existingTenant = _context.Tenants
            .FirstOrDefault(t => t.Subdomain == "demo");
        
        if (existingTenant != null)
        {
            return Ok(new 
            { 
                message = "Demo tenant already exists", 
                tenantId = existingTenant.Id,
                subdomain = existingTenant.Subdomain
            });
        }
        
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = "Demo Company",
            Subdomain = "demo",
            Status = TenantStatus.Active,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();
        
        return Ok(new 
        { 
            message = "Demo tenant created successfully", 
            tenantId = tenant.Id,
            subdomain = tenant.Subdomain,
            instructions = "Use header 'X-Tenant-Id: demo' to test multi-tenancy"
        });
    }
#endif
    
#if DEBUG
    [HttpPost("seed-second")]
    public async Task<IActionResult> SeedSecondTenant()
    {
        var existingTenant = _context.Tenants
            .FirstOrDefault(t => t.Subdomain == "companyb");
        
        if (existingTenant != null)
        {
            return Ok(new 
            { 
                message = "Second tenant already exists", 
                tenantId = existingTenant.Id,
                subdomain = existingTenant.Subdomain
            });
        }
        
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = "Company B",
            Subdomain = "companyb",
            Status = TenantStatus.Active,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();
        
        return Ok(new 
        { 
            message = "Second tenant created successfully", 
            tenantId = tenant.Id,
            subdomain = tenant.Subdomain,
            instructions = "Use header 'X-Tenant-Id: companyb' to test multi-tenancy"
        });
    }
#endif
    
    [HttpGet]
    public IActionResult GetAllTenants()
    {
        var tenants = _context.Tenants
            .Select(t => new
            {
                id = t.Id,
                name = t.Name,
                subdomain = t.Subdomain,
                status = t.Status.ToString(),
                createdAt = t.CreatedAt
            })
            .ToList();
        
        return Ok(new { count = tenants.Count, tenants });
    }
}
