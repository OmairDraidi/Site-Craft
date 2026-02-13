namespace SiteCraft.Application.DTOs.Projects;

public class ProjectListItemDto
{
    public Guid Id { get; set; }
    public Guid? TemplateId { get; set; }
    public string? TemplateName { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
