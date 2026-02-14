namespace SiteCraft.Application.DTOs.Pages;

public class UpdatePageRequest
{
    public string Title { get; set; } = string.Empty;
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string PageData { get; set; } = string.Empty;
}
