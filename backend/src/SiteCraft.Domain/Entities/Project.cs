using SiteCraft.Domain.Enums;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Domain.Entities;

/// <summary>
/// Represents a user's project (a collection of sites/pages)
/// </summary>
public class Project : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid? TemplateId { get; set; }
    public Guid? SiteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; } = ProjectStatus.Draft;
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    public Tenant Tenant { get; set; } = null!;
    public User User { get; set; } = null!;
    public Template? Template { get; set; }
    public Site? Site { get; set; }
}
