namespace SiteCraft.Domain.Entities;

public class Template
{
    public Guid Id { get; set; }
    
    /// <summary>
    /// TenantId is nullable - null means Global template available to all tenants
    /// </summary>
    public Guid? TenantId { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Category: "Business", "Education", "Portfolio", "Services", "Store"
    /// </summary>
    public string Category { get; set; } = string.Empty;
    
    public string PreviewImageUrl { get; set; } = string.Empty;
    
    /// <summary>
    /// IsPublic: whether this template is visible in the gallery
    /// </summary>
    public bool IsPublic { get; set; } = true;
    
    /// <summary>
    /// IsPremium: requires Pro or higher subscription
    /// </summary>
    public bool IsPremium { get; set; } = false;
    
    /// <summary>
    /// TemplateData: JSON structure representing the template content
    /// </summary>
    public string TemplateData { get; set; } = string.Empty;
    
    /// <summary>
    /// UsageCount: tracks how many times this template has been applied
    /// </summary>
    public int UsageCount { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation Properties
    public Tenant? Tenant { get; set; }
}
