using System.IdentityModel.Tokens.Jwt;
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
        // 1. Header (X-Tenant-Id) - للتطوير فقط (أولوية عالية)
        // 2. JWT Token Claims (tenant_id)
        // 3. Subdomain (example.sitecraft.com)
        // 4. Custom Domain
        // 5. Default Tenant (Development mode only)
        
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
        else
        {
            // محاولة استخراج TenantId من JWT Token
            var tenantIdFromToken = ExtractTenantIdFromJwt(context);
            if (tenantIdFromToken.HasValue)
            {
                var tenant = await dbContext.Tenants
                    .FirstOrDefaultAsync(t => t.Id == tenantIdFromToken.Value);
                
                if (tenant != null && tenant.Status == TenantStatus.Active)
                {
                    tenantService.SetCurrentTenant(tenant.Id);
                }
            }
            else
            {
                // 🚀 Development: استخدام Default Tenant تلقائياً
                var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
                if (isDevelopment)
                {
                    var defaultTenant = await dbContext.Tenants
                        .FirstOrDefaultAsync(t => t.Subdomain == "default" && t.Status == TenantStatus.Active);
                    
                    if (defaultTenant != null)
                    {
                        tenantService.SetCurrentTenant(defaultTenant.Id);
                    }
                }
            }
        }
        
        await _next(context);
    }
    
    private string? ExtractTenantIdentifier(HttpContext context)
    {
        // Development: من Header (highest priority)
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
    
    private Guid? ExtractTenantIdFromJwt(HttpContext context)
    {
        try
        {
            // استخراج Token من Authorization Header
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return null;
            
            var token = authHeader.Substring("Bearer ".Length).Trim();
            
            // Parse JWT token بدون validation (Validation يتم في Authentication Middleware)
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token))
                return null;
            
            var jwtToken = handler.ReadJwtToken(token);
            var tenantIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "tenant_id");
            
            if (tenantIdClaim != null && Guid.TryParse(tenantIdClaim.Value, out var tenantId))
            {
                return tenantId;
            }
        }
        catch
        {
            // إذا فشل parsing، نتجاهل ونواصل
        }
        
        return null;
    }
}
