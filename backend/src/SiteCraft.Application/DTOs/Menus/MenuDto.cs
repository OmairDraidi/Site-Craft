namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Full menu details with nested menu items
/// </summary>
public class MenuDto
{
    public Guid Id { get; set; }
    public Guid SiteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<MenuItemDto> Items { get; set; } = new();
}
