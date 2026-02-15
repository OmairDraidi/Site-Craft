namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Request to update an existing menu item
/// </summary>
public class UpdateMenuItemRequest
{
    public string? Label { get; set; }
    public string? Url { get; set; }
    public Guid? ParentId { get; set; }
    public string? Target { get; set; }
    public bool? IsVisible { get; set; }
}
