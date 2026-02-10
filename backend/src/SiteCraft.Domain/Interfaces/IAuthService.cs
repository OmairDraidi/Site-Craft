namespace SiteCraft.Domain.Interfaces;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(string email, string password, string firstName, string lastName, Guid tenantId);
    Task<AuthResult> LoginAsync(string email, string password, Guid tenantId);
    Task<AuthResult> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(Guid userId);
}

public class AuthResult
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public Guid? UserId { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Role { get; set; }
    public Guid? TenantId { get; set; }
}
