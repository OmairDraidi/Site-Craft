namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Menu item with nested children (recursive structure)
/// </summary>
public class MenuItemDto
{
    public Guid Id { get; set; }
    public Guid MenuId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public int Order { get; set; }
    public string Target { get; set; } = "_self";
    public bool IsVisible { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<MenuItemDto> Children { get; set; } = new();
}
