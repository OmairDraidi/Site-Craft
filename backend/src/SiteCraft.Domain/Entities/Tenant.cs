using SiteCraft.Domain.Enums;

namespace SiteCraft.Domain.Entities;

public class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Subdomain { get; set; } = string.Empty; // example.sitecraft.com
    public string? CustomDomain { get; set; } // Optional: custom.com
    public TenantStatus Status { get; set; } = TenantStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation Properties
    public ICollection<User> Users { get; set; } = new List<User>();
}
