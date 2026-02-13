using Microsoft.AspNetCore.Authorization;

namespace SiteCraft.Infrastructure.Authorization;

/// <summary>
/// Authorization requirement for Owner role (SuperAdmin)
/// </summary>
public class OwnerRoleRequirement : IAuthorizationRequirement
{
}

/// <summary>
/// Authorization requirement for Admin or Owner roles
/// </summary>
public class AdminRoleRequirement : IAuthorizationRequirement
{
}
