using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Enums;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.API.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UsersController : ControllerBase
{
    private readonly ITenantService _tenantService;
    private readonly SiteCraftDbContext _context;
    
    public UsersController(ITenantService tenantService, SiteCraftDbContext context)
    {
        _tenantService = tenantService;
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var currentTenantId = _tenantService.GetCurrentTenantId();
        
        if (!currentTenantId.HasValue)
            return BadRequest(new { message = "No tenant context found. Use X-Tenant-Id header." });
        
        // Global Query Filter will automatically filter by TenantId
        var users = await _context.Users
            .Select(u => new
            {
                id = u.Id,
                tenantId = u.TenantId,
                email = u.Email,
                firstName = u.FirstName,
                lastName = u.LastName,
                role = u.Role.ToString(),
                isActive = u.IsActive,
                createdAt = u.CreatedAt
            })
            .ToListAsync();
        
        return Ok(new 
        { 
            tenantId = currentTenantId,
            count = users.Count, 
            users 
        });
    }
    
    [HttpPost("seed-demo-user")]
    public async Task<IActionResult> SeedDemoUser()
    {
        var currentTenantId = _tenantService.GetCurrentTenantId();
        
        if (!currentTenantId.HasValue)
            return BadRequest(new { message = "No tenant context found. Use X-Tenant-Id header." });
        
        var tenant = await _context.Tenants
            .FirstOrDefaultAsync(t => t.Id == currentTenantId.Value);
            
        if (tenant == null)
            return NotFound(new { message = "Tenant not found" });
        
        // Check if user already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == $"admin@{tenant.Subdomain}.com");
        
        if (existingUser != null)
        {
            return Ok(new 
            { 
                message = "Demo user already exists", 
                userId = existingUser.Id,
                email = existingUser.Email
            });
        }
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = currentTenantId.Value,
            Email = $"admin@{tenant.Subdomain}.com",
            FirstName = "Admin",
            LastName = "User",
            PasswordHash = "hashed_password_here", // In real scenario, use proper hashing
            Role = UserRole.Owner,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        return Ok(new 
        { 
            message = "Demo user created successfully", 
            userId = user.Id,
            email = user.Email,
            tenantId = user.TenantId
        });
    }
}
