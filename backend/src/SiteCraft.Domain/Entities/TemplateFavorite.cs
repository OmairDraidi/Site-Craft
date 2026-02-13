using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Domain.Entities;

/// <summary>
/// Represents a user's favorite template
/// </summary>
public class TemplateFavorite : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TenantId { get; set; }
    public Guid TemplateId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Template Template { get; set; } = null!;
}
