namespace SiteCraft.Application.DTOs.Responses;

/// <summary>
/// Response DTO for site with branding information
/// </summary>
public class SiteDto
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? TemplateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Branding
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string PrimaryColor { get; set; } = string.Empty;
    public string SecondaryColor { get; set; } = string.Empty;
    public string HeadingFontFamily { get; set; } = string.Empty;
    public string BodyFontFamily { get; set; } = string.Empty;
    public string? SocialLinks { get; set; }
    public string? ContactInfo { get; set; }
}
