using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Domain.Entities;

/// <summary>
/// Represents a page within a site
/// </summary>
public class Page : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SiteId { get; set; }
    public Guid? TemplateId { get; set; }
    
    /// <summary>
    /// Page title
    /// </summary>
    public string Title { get; set; } = string.Empty;
    
    /// <summary>
    /// URL-friendly slug (unique per site)
    /// </summary>
    public string Slug { get; set; } = string.Empty;
    
    /// <summary>
    /// SEO meta description
    /// </summary>
    public string? MetaDescription { get; set; }
    
    /// <summary>
    /// SEO meta keywords
    /// </summary>
    public string? MetaKeywords { get; set; }
    
    /// <summary>
    /// Whether the page is published and publicly visible
    /// </summary>
    public bool IsPublished { get; set; } = false;
    
    /// <summary>
    /// Timestamp when the page was published
    /// </summary>
    public DateTime? PublishedAt { get; set; }
    
    /// <summary>
    /// JSON structure representing the page content (sections and components)
    /// </summary>
    public string PageData { get; set; } = string.Empty;
    
    /// <summary>
    /// Display order within the site
    /// </summary>
    public int Order { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation Properties
    public Site Site { get; set; } = null!;
    public Template? Template { get; set; }
    public ICollection<Component> Components { get; set; } = new List<Component>();
}
