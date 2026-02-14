namespace SiteCraft.Application.DTOs.Pages;

public class ComponentDto
{
    public Guid Id { get; set; }
    public Guid PageId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsVisible { get; set; }
}
