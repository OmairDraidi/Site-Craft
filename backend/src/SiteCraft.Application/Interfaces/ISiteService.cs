using Microsoft.AspNetCore.Http;
using SiteCraft.Application.DTOs.Requests;
using SiteCraft.Application.DTOs.Responses;

namespace SiteCraft.Application.Interfaces;

/// <summary>
/// Service interface for site management operations
/// </summary>
public interface ISiteService
{
    /// <summary>
    /// Get site by ID with branding information
    /// </summary>
    Task<SiteDto?> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Update site branding settings
    /// </summary>
    Task<SiteDto> UpdateBrandingAsync(Guid id, UpdateSiteBrandingRequest request);
    
    /// <summary>
    /// Upload logo or favicon for a site
    /// </summary>
    /// <param name="siteId">Site ID</param>
    /// <param name="file">File to upload</param>
    /// <param name="type">File type: "logo" or "favicon"</param>
    Task<FileUploadResponse> UploadFileAsync(Guid siteId, IFormFile file, string type);
}
