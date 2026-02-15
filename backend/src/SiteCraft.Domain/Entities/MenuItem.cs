using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Domain.Entities;

/// <summary>
/// Represents an individual item within a navigation menu
/// </summary>
public class MenuItem : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid MenuId { get; set; }
    
    /// <summary>
    /// Display label for the menu item
    /// </summary>
    public string Label { get; set; } = string.Empty;
    
    /// <summary>
    /// URL or path (internal or external)
    /// </summary>
    public string Url { get; set; } = string.Empty;
    
    /// <summary>
    /// Parent menu item ID for nested menus (null for top-level items)
    /// </summary>
    public Guid? ParentId { get; set; }
    
    /// <summary>
    /// Display order within the menu or parent item
    /// </summary>
    public int Order { get; set; } = 0;
    
    /// <summary>
    /// Link target (_self or _blank)
    /// </summary>
    public string Target { get; set; } = "_self";
    
    /// <summary>
    /// Whether the menu item is visible
    /// </summary>
    public bool IsVisible { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation Properties
    public Menu Menu { get; set; } = null!;
    public MenuItem? Parent { get; set; }
    public ICollection<MenuItem> Children { get; set; } = new List<MenuItem>();
}
