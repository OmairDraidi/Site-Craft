namespace SiteCraft.Application.DTOs.Responses;

/// <summary>
/// Response DTO for file upload operations
/// </summary>
public class FileUploadResponse
{
    public string FileUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
}
