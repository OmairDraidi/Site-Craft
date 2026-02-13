namespace SiteCraft.Application.DTOs.Templates;

public class TemplateFilterRequest
{
    public string? Category { get; set; }
    public bool? IsPremium { get; set; }
    public string? SearchTerm { get; set; }
}
