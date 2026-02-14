namespace SiteCraft.Application.DTOs.Pages;

public class CreatePageRequest
{
    public string Title { get; set; } = string.Empty;
    public Guid SiteId { get; set; }
    public Guid? TemplateId { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string? PageData { get; set; }
}
