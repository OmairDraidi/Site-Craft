namespace SiteCraft.Application.DTOs.Pages;

public class PageDto
{
    public Guid Id { get; set; }
    public Guid SiteId { get; set; }
    public Guid? TemplateId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string PageData { get; set; } = string.Empty;
    public int Order { get; set; }
    public int ComponentCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
