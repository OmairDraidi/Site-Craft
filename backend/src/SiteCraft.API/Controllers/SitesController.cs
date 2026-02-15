using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiteCraft.Application.DTOs.Requests;
using SiteCraft.Application.Interfaces;

namespace SiteCraft.API.Controllers;

/// <summary>
/// Controller for site management operations
/// </summary>
[ApiController]
[Route("api/v1/sites")]
[Authorize]
public class SitesController : ControllerBase
{
    private readonly ISiteService _siteService;

    public SitesController(ISiteService siteService)
    {
        _siteService = siteService;
    }

    /// <summary>
    /// Get site by ID with branding information
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSite(Guid id)
    {
        try
        {
            var site = await _siteService.GetByIdAsync(id);
            if (site == null)
            {
                return NotFound(new { message = "Site not found" });
            }

            return Ok(site);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the site", error = ex.Message });
        }
    }

    /// <summary>
    /// Update site branding settings
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSite(Guid id, [FromBody] UpdateSiteBrandingRequest request)
    {
        try
        {
            var updatedSite = await _siteService.UpdateBrandingAsync(id, request);
            return Ok(updatedSite);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the site", error = ex.Message });
        }
    }

    /// <summary>
    /// Upload logo or favicon for a site
    /// </summary>
    /// <param name="id">Site ID</param>
    /// <param name="file">File to upload</param>
    /// <param name="type">File type: "logo" or "favicon"</param>
    [HttpPost("{id}/upload")]
    public async Task<IActionResult> UploadFile(Guid id, IFormFile file, [FromQuery] string type)
    {
        try
        {
            var result = await _siteService.UploadFileAsync(id, file, type);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while uploading the file", error = ex.Message });
        }
    }
}
