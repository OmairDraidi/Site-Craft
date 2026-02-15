using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Domain.Entities;

/// <summary>
/// Represents a site/website created by a tenant using a template
/// </summary>
public class Site : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? TemplateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SiteData { get; set; } = string.Empty; // JSON structure from template
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Branding Fields
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string PrimaryColor { get; set; } = "#000000";
    public string SecondaryColor { get; set; } = "#ffffff";
    public string HeadingFontFamily { get; set; } = "Inter";
    public string BodyFontFamily { get; set; } = "Roboto";
    public string? SocialLinks { get; set; } // JSON: { "facebook": "url", "twitter": "url", ... }
    public string? ContactInfo { get; set; } // JSON: { "email": "...", "phone": "...", "address": "..." }
    public string? Tagline { get; set; }
    
    // Navigation Properties
    public Tenant Tenant { get; set; } = null!;
    public User User { get; set; } = null!;
    public Project? Project { get; set; }
    public Template? Template { get; set; }
    public ICollection<Page> Pages { get; set; } = new List<Page>();
}
