using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Enums;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.Infrastructure.Middleware;

public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolutionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService, SiteCraftDbContext dbContext)
    {
        // استخراج TenantId من:
        // 1. Subdomain (example.sitecraft.com)
        // 2. Custom Domain
        // 3. JWT Token (بعد تطبيق Auth)
        // 4. Header (X-Tenant-Id) - للتطوير فقط
        
        var tenantIdentifier = ExtractTenantIdentifier(context);
        
        if (!string.IsNullOrEmpty(tenantIdentifier))
        {
            var tenant = await dbContext.Tenants
                .FirstOrDefaultAsync(t => 
                    t.Subdomain == tenantIdentifier || 
                    t.CustomDomain == tenantIdentifier);
            
            if (tenant != null && tenant.Status == TenantStatus.Active)
            {
                tenantService.SetCurrentTenant(tenant.Id);
            }
        }
        
        await _next(context);
    }
    
    private string? ExtractTenantIdentifier(HttpContext context)
    {
        // Development: من Header
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var headerId))
            return headerId;
        
        // Production: من Subdomain
        var host = context.Request.Host.Host;
        if (host.Contains(".sitecraft.com"))
        {
            return host.Split('.')[0]; // استخراج subdomain
        }
        
        return null;
    }
}
