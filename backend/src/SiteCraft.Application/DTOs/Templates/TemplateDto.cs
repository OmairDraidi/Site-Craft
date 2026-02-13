namespace SiteCraft.Application.DTOs.Templates;

public class TemplateDto
{
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string PreviewImageUrl { get; set; } = string.Empty;
    public bool IsPublic { get; set; }
    public bool IsPremium { get; set; }
    public string TemplateData { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public bool IsFavorited { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
