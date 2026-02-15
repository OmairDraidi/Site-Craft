namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Request to create a new menu item
/// </summary>
public class CreateMenuItemRequest
{
    public Guid MenuId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public string Target { get; set; } = "_self";
    public int? Order { get; set; }
}
