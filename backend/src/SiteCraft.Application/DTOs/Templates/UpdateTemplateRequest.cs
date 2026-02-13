namespace SiteCraft.Application.DTOs.Templates;

public class UpdateTemplateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string PreviewImageUrl { get; set; } = string.Empty;
    public bool IsPublic { get; set; }
    public bool IsPremium { get; set; }
    public string TemplateData { get; set; } = string.Empty;
}
