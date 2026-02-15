namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Lightweight menu item for list views
/// </summary>
public class MenuListItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int ItemCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
