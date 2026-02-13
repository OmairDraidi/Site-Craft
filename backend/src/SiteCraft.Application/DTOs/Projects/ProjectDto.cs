namespace SiteCraft.Application.DTOs.Projects;

public class ProjectDto
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid? TemplateId { get; set; }
    public string? TemplateName { get; set; }
    public string? TemplatePreviewUrl { get; set; }
    public Guid? SiteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
