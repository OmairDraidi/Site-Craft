using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Domain.Entities;

/// <summary>
/// Represents an individual component within a page
/// </summary>
public class Component : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid PageId { get; set; }
    
    /// <summary>
    /// Component type (e.g., "heading", "button", "image", "video", "form")
    /// </summary>
    public string Type { get; set; } = string.Empty;
    
    /// <summary>
    /// JSON structure representing the component content and properties
    /// </summary>
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// Display order within the page
    /// </summary>
    public int Order { get; set; } = 0;
    
    /// <summary>
    /// Whether the component is visible
    /// </summary>
    public bool IsVisible { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation Properties
    public Page Page { get; set; } = null!;
}
