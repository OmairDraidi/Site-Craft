namespace SiteCraft.Application.DTOs.Menus;

/// <summary>
/// Request to reorder menu items with optional parent change
/// </summary>
public class ReorderMenuItemsRequest
{
    public List<ReorderItem> Items { get; set; } = new();
}

public class ReorderItem
{
    public Guid Id { get; set; }
    public int NewOrder { get; set; }
    public Guid? NewParentId { get; set; }
}
