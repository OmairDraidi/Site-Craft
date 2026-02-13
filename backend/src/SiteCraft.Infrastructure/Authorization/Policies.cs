namespace SiteCraft.Infrastructure.Authorization;

/// <summary>
/// Authorization policy names used throughout the application
/// </summary>
public static class Policies
{
    /// <summary>
    /// Requires Owner role (SuperAdmin)
    /// </summary>
    public const string RequireOwnerRole = "RequireOwnerRole";
    
    /// <summary>
    /// Requires Admin or Owner role
    /// </summary>
    public const string RequireAdminRole = "RequireAdminRole";
    
    /// <summary>
    /// Requires any authenticated user (Member, Admin, or Owner)
    /// </summary>
    public const string RequireAuthenticatedUser = "RequireAuthenticatedUser";
}
