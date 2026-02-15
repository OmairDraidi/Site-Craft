using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using SiteCraft.Application.DTOs.Pages;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Infrastructure.Services;

public class PageService : IPageService
{
    private readonly IPageRepository _pageRepository;
    private readonly ISiteRepository _siteRepository;
    private readonly ILogger<PageService> _logger;

    public PageService(
        IPageRepository pageRepository,
        ISiteRepository siteRepository,
        ILogger<PageService> logger)
    {
        _pageRepository = pageRepository;
        _siteRepository = siteRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<PageListItemDto>> GetPagesAsync(Guid siteId, Guid tenantId)
    {
        _logger.LogInformation("Getting pages for site {SiteId} in tenant {TenantId}", siteId, tenantId);
        var pages = await _pageRepository.GetBySiteIdAsync(siteId);
        return pages.Select(MapToListItemDto);
    }

    public async Task<PageDto?> GetPageByIdAsync(Guid id)
    {
        _logger.LogInformation("Getting page by ID: {PageId}", id);
        var page = await _pageRepository.GetByIdAsync(id);
        if (page == null) return null;
        return MapToDto(page);
    }

    public async Task<PageDto> CreatePageAsync(CreatePageRequest request, Guid userId, Guid tenantId)
    {
        _logger.LogInformation("Creating page: {PageTitle} for site {SiteId}", request.Title, request.SiteId);

        // Validate site exists and belongs to tenant
        var site = await _siteRepository.GetByIdAsync(request.SiteId);
        if (site == null)
            throw new KeyNotFoundException($"Site with ID {request.SiteId} not found");
        
        if (site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to create pages for this site");

        // Generate unique slug
        var slug = await GenerateUniqueSlugAsync(request.Title, request.SiteId);

        // Set default PageData if not provided
        var pageData = string.IsNullOrWhiteSpace(request.PageData) 
            ? "{\"sections\":[]}" 
            : request.PageData;

        var page = new Page
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            SiteId = request.SiteId,
            TemplateId = request.TemplateId,
            Title = request.Title,
            Slug = slug,
            MetaDescription = request.MetaDescription,
            MetaKeywords = request.MetaKeywords,
            PageData = pageData,
            IsPublished = false,
            Order = 0,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _pageRepository.CreateAsync(page);
        _logger.LogInformation("Page created successfully: {PageId}", created.Id);

        return await GetPageByIdAsync(created.Id)
            ?? throw new InvalidOperationException("Failed to retrieve created page");
    }

    public async Task<PageDto> UpdatePageAsync(Guid id, UpdatePageRequest request, Guid userId)
    {
        _logger.LogInformation("Updating page: {PageId}", id);
        var page = await _pageRepository.GetByIdAsync(id);
        if (page == null)
            throw new KeyNotFoundException($"Page with ID {id} not found");

        // Validate ownership through site
        var site = await _siteRepository.GetByIdAsync(page.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to update this page");

        // Only update fields that are provided (partial update support)
        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            // Regenerate slug if title changed
            if (page.Title != request.Title)
            {
                page.Slug = await GenerateUniqueSlugAsync(request.Title, page.SiteId, page.Id);
            }
            page.Title = request.Title;
        }

        if (request.MetaDescription != null)
        {
            page.MetaDescription = request.MetaDescription;
        }

        if (request.MetaKeywords != null)
        {
            page.MetaKeywords = request.MetaKeywords;
        }

        if (request.PageData != null)
        {
            page.PageData = request.PageData;
        }

        await _pageRepository.UpdateAsync(page);
        _logger.LogInformation("Page updated successfully: {PageId}", id);

        return await GetPageByIdAsync(page.Id)
            ?? throw new InvalidOperationException("Failed to retrieve updated page");
    }

    public async Task<bool> DeletePageAsync(Guid id, Guid userId)
    {
        _logger.LogInformation("Deleting page: {PageId}", id);
        var page = await _pageRepository.GetByIdAsync(id);
        if (page == null) return false;

        // Validate ownership through site
        var site = await _siteRepository.GetByIdAsync(page.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this page");

        await _pageRepository.DeleteAsync(id);
        _logger.LogInformation("Page deleted successfully: {PageId}", id);
        return true;
    }

    public async Task<PageDto> PublishPageAsync(Guid id, Guid userId)
    {
        _logger.LogInformation("Publishing page: {PageId}", id);
        var page = await _pageRepository.GetByIdAsync(id);
        if (page == null)
            throw new KeyNotFoundException($"Page with ID {id} not found");

        // Validate ownership through site
        var site = await _siteRepository.GetByIdAsync(page.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to publish this page");

        page.IsPublished = true;
        page.PublishedAt = DateTime.UtcNow;

        await _pageRepository.UpdateAsync(page);
        _logger.LogInformation("Page published successfully: {PageId}", id);

        return await GetPageByIdAsync(page.Id)
            ?? throw new InvalidOperationException("Failed to retrieve published page");
    }

    public async Task<PageDto> UnpublishPageAsync(Guid id, Guid userId)
    {
        _logger.LogInformation("Unpublishing page: {PageId}", id);
        var page = await _pageRepository.GetByIdAsync(id);
        if (page == null)
            throw new KeyNotFoundException($"Page with ID {id} not found");

        // Validate ownership through site
        var site = await _siteRepository.GetByIdAsync(page.SiteId);
        if (site == null || site.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to unpublish this page");

        page.IsPublished = false;
        page.PublishedAt = null;

        await _pageRepository.UpdateAsync(page);
        _logger.LogInformation("Page unpublished successfully: {PageId}", id);

        return await GetPageByIdAsync(page.Id)
            ?? throw new InvalidOperationException("Failed to retrieve unpublished page");
    }

    private async Task<string> GenerateUniqueSlugAsync(string title, Guid siteId, Guid? excludePageId = null)
    {
        var baseSlug = GenerateSlug(title);
        var slug = baseSlug;
        var counter = 2;

        while (await _pageRepository.SlugExistsAsync(slug, siteId, excludePageId))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }

    private static string GenerateSlug(string title)
    {
        // Convert to lowercase
        var slug = title.ToLowerInvariant();

        // Remove diacritics
        slug = RemoveDiacritics(slug);

        // Replace spaces with hyphens
        slug = Regex.Replace(slug, @"\s+", "-");

        // Remove invalid characters
        slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");

        // Remove consecutive hyphens
        slug = Regex.Replace(slug, @"-+", "-");

        // Trim hyphens from start and end
        slug = slug.Trim('-');

        // Ensure slug is not empty
        if (string.IsNullOrEmpty(slug))
        {
            slug = "page";
        }

        return slug;
    }

    private static string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }

    private static PageDto MapToDto(Page page)
    {
        return new PageDto
        {
            Id = page.Id,
            SiteId = page.SiteId,
            TemplateId = page.TemplateId,
            Title = page.Title,
            Slug = page.Slug,
            MetaDescription = page.MetaDescription,
            MetaKeywords = page.MetaKeywords,
            IsPublished = page.IsPublished,
            PublishedAt = page.PublishedAt,
            PageData = page.PageData,
            Order = page.Order,
            ComponentCount = page.Components?.Count ?? 0,
            CreatedAt = page.CreatedAt,
            UpdatedAt = page.UpdatedAt
        };
    }

    private static PageListItemDto MapToListItemDto(Page page)
    {
        return new PageListItemDto
        {
            Id = page.Id,
            Title = page.Title,
            Slug = page.Slug,
            IsPublished = page.IsPublished,
            PublishedAt = page.PublishedAt,
            Order = page.Order,
            CreatedAt = page.CreatedAt,
            UpdatedAt = page.UpdatedAt
        };
    }
}
