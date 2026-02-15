using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Domain.Entities;

/// <summary>
/// Represents a navigation menu within a site
/// </summary>
public class Menu : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SiteId { get; set; }
    
    /// <summary>
    /// Menu name (e.g., "Main Menu", "Footer Links")
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Menu location (e.g., "Header", "Footer")
    /// </summary>
    public string Location { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation Properties
    public Site Site { get; set; } = null!;
    public ICollection<MenuItem> Items { get; set; } = new List<MenuItem>();
}
