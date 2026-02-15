namespace SiteCraft.Application.DTOs.Requests;

/// <summary>
/// Request DTO for updating site branding settings
/// </summary>
public class UpdateSiteBrandingRequest
{
    public string? Name { get; set; }
    public string? Tagline { get; set; }
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? HeadingFontFamily { get; set; }
    public string? BodyFontFamily { get; set; }
    public string? SocialLinks { get; set; } // JSON string
    public string? ContactInfo { get; set; } // JSON string
}
