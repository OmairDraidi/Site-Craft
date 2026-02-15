namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Request to create a new menu
/// </summary>
public class CreateMenuRequest
{
    public Guid SiteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
}
