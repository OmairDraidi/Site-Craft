using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using SiteCraft.Domain.Enums;

namespace SiteCraft.Infrastructure.Authorization;

/// <summary>
/// Handler for Owner role requirement
/// </summary>
public class OwnerRoleHandler : AuthorizationHandler<OwnerRoleRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        OwnerRoleRequirement requirement)
    {
        var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (roleClaim == UserRole.Owner.ToString())
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

/// <summary>
/// Handler for Admin role requirement (Admin or Owner)
/// </summary>
public class AdminRoleHandler : AuthorizationHandler<AdminRoleRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        AdminRoleRequirement requirement)
    {
        var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (roleClaim == UserRole.Owner.ToString() || 
            roleClaim == UserRole.Admin.ToString())
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
