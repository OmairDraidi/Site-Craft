namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Request to update an existing menu
/// </summary>
public class UpdateMenuRequest
{
    public string? Name { get; set; }
    public string? Location { get; set; }
}
