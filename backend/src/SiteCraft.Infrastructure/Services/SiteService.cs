using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SiteCraft.Application.DTOs.Requests;
using SiteCraft.Application.DTOs.Responses;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Infrastructure.Services;

/// <summary>
/// Service for site management operations
/// </summary>
public class SiteService : ISiteService
{
    private readonly ISiteRepository _siteRepository;
    private readonly string _uploadsPath;

    public SiteService(ISiteRepository siteRepository, IWebHostEnvironment env)
    {
        _siteRepository = siteRepository;
        _uploadsPath = Path.Combine(env.WebRootPath, "uploads", "sites");
        
        // Ensure uploads directory exists
        if (!Directory.Exists(_uploadsPath))
        {
            Directory.CreateDirectory(_uploadsPath);
        }
    }

    public async Task<SiteDto?> GetByIdAsync(Guid id)
    {
        var site = await _siteRepository.GetByIdAsync(id);
        if (site == null) return null;

        return new SiteDto
        {
            Id = site.Id,
            TenantId = site.TenantId,
            UserId = site.UserId,
            ProjectId = site.ProjectId,
            TemplateId = site.TemplateId,
            Name = site.Name,
            Tagline = site.Tagline,
            IsActive = site.IsActive,
            CreatedAt = site.CreatedAt,
            UpdatedAt = site.UpdatedAt,
            LogoUrl = site.LogoUrl,
            FaviconUrl = site.FaviconUrl,
            PrimaryColor = site.PrimaryColor,
            SecondaryColor = site.SecondaryColor,
            HeadingFontFamily = site.HeadingFontFamily,
            BodyFontFamily = site.BodyFontFamily,
            SocialLinks = site.SocialLinks,
            ContactInfo = site.ContactInfo
        };
    }

    public async Task<SiteDto> UpdateBrandingAsync(Guid id, UpdateSiteBrandingRequest request)
    {
        var site = await _siteRepository.GetByIdAsync(id);
        if (site == null)
        {
            throw new KeyNotFoundException($"Site with ID {id} not found");
        }

        // Update only provided fields
        if (request.Name != null) site.Name = request.Name;
        if (request.Tagline != null) site.Tagline = request.Tagline;
        if (request.PrimaryColor != null) site.PrimaryColor = request.PrimaryColor;
        if (request.SecondaryColor != null) site.SecondaryColor = request.SecondaryColor;
        if (request.HeadingFontFamily != null) site.HeadingFontFamily = request.HeadingFontFamily;
        if (request.BodyFontFamily != null) site.BodyFontFamily = request.BodyFontFamily;
        if (request.SocialLinks != null) site.SocialLinks = request.SocialLinks;
        if (request.ContactInfo != null) site.ContactInfo = request.ContactInfo;

        await _siteRepository.UpdateAsync(site);

        return (await GetByIdAsync(id))!;
    }

    public async Task<FileUploadResponse> UploadFileAsync(Guid siteId, IFormFile file, string type)
    {
        // Validate file
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is required");
        }

        // Validate file size (max 2MB)
        const long maxFileSize = 2 * 1024 * 1024;
        if (file.Length > maxFileSize)
        {
            throw new ArgumentException("File size exceeds 2MB limit");
        }

        // Validate file type
        var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".svg" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            throw new ArgumentException("Only PNG, JPG, JPEG, and SVG files are allowed");
        }

        // Validate type parameter
        if (type != "logo" && type != "favicon")
        {
            throw new ArgumentException("Type must be 'logo' or 'favicon'");
        }

        // Get site to ensure it exists
        var site = await _siteRepository.GetByIdAsync(siteId);
        if (site == null)
        {
            throw new KeyNotFoundException($"Site with ID {siteId} not found");
        }

        // Create site-specific directory
        var siteUploadPath = Path.Combine(_uploadsPath, siteId.ToString());
        if (!Directory.Exists(siteUploadPath))
        {
            Directory.CreateDirectory(siteUploadPath);
        }

        // Generate unique filename
        var fileName = $"{type}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
        var filePath = Path.Combine(siteUploadPath, fileName);

        // Delete old file if exists
        var oldFileUrl = type == "logo" ? site.LogoUrl : site.FaviconUrl;
        if (!string.IsNullOrEmpty(oldFileUrl))
        {
            var oldFileName = Path.GetFileName(oldFileUrl);
            var oldFilePath = Path.Combine(siteUploadPath, oldFileName);
            if (File.Exists(oldFilePath))
            {
                File.Delete(oldFilePath);
            }
        }

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Generate URL
        var fileUrl = $"/uploads/sites/{siteId}/{fileName}";

        // Update site entity
        if (type == "logo")
        {
            site.LogoUrl = fileUrl;
        }
        else
        {
            site.FaviconUrl = fileUrl;
        }
        await _siteRepository.UpdateAsync(site);

        return new FileUploadResponse
        {
            FileUrl = fileUrl,
            FileName = fileName,
            FileSize = file.Length,
            ContentType = file.ContentType
        };
    }
}
