using Microsoft.Extensions.Logging;
using SiteCraft.Application.DTOs.Templates;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Enums;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Data;
using System.Text.Json;

namespace SiteCraft.Infrastructure.Services;

public class TemplateService : ITemplateService
{
    private readonly ITemplateRepository _templateRepository;
    private readonly ISiteRepository _siteRepository;
    private readonly ITenantService _tenantService;
    private readonly SiteCraftDbContext _context;
    private readonly ILogger<TemplateService> _logger;

    public TemplateService(
        ITemplateRepository templateRepository,
        ISiteRepository siteRepository,
        ITenantService tenantService,
        SiteCraftDbContext context,
        ILogger<TemplateService> logger)
    {
        _templateRepository = templateRepository;
        _siteRepository = siteRepository;
        _tenantService = tenantService;
        _context = context;
        _logger = logger;
    }

    public async Task<TemplateDto?> GetTemplateByIdAsync(Guid id)
    {
        return await GetTemplateByIdAsync(id, null);
    }

    public async Task<TemplateDto?> GetTemplateByIdAsync(Guid id, Guid? userId = null)
    {
        _logger.LogInformation("Getting template by ID: {TemplateId}", id);
        
        var template = await _templateRepository.GetByIdAsync(id);
        if (template == null)
            return null;

        var isFavorited = userId.HasValue 
            ? await _templateRepository.IsFavoritedAsync(id, userId.Value)
            : false;

        return MapToDto(template, isFavorited);
    }

    public async Task<IEnumerable<TemplateDto>> GetAllTemplatesAsync(Guid? currentTenantId = null)
    {
        _logger.LogInformation("Getting all templates for tenant: {TenantId}", currentTenantId);
        
        var templates = await _templateRepository.GetAllAsync(currentTenantId);
        return templates.Select(t => MapToDto(t));
    }

    public async Task<IEnumerable<TemplateDto>> GetPublicTemplatesAsync()
    {
        _logger.LogInformation("Getting public templates");
        
        var templates = await _templateRepository.GetPublicTemplatesAsync();
        return templates.Select(t => MapToDto(t));
    }

    public async Task<IEnumerable<TemplateDto>> GetFilteredTemplatesAsync(
        TemplateFilterRequest filter,
        Guid? currentTenantId = null)
    {
        _logger.LogInformation(
            "Filtering templates - Category: {Category}, Premium: {IsPremium}, SearchTerm: {SearchTerm}, TenantId: {TenantId}",
            filter.Category, filter.IsPremium, filter.SearchTerm, currentTenantId);
        
        var templates = await _templateRepository.GetByFilterAsync(
            filter.Category,
            filter.IsPremium,
            filter.SearchTerm,
            currentTenantId);
        
        return templates.Select(t => MapToDto(t));
    }

    public async Task<TemplateDto> CreateTemplateAsync(CreateTemplateRequest request, Guid? tenantId = null)
    {
        _logger.LogInformation("Creating new template: {TemplateName} for tenant: {TenantId}", 
            request.Name, tenantId);

        // Validate JSON structure
        if (!IsValidJson(request.TemplateData))
        {
            _logger.LogWarning("Invalid JSON structure in TemplateData");
            throw new ArgumentException("Invalid JSON structure in TemplateData");
        }

        var template = new Template
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId, // null = global template
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            PreviewImageUrl = request.PreviewImageUrl,
            IsPublic = request.IsPublic,
            IsPremium = request.IsPremium,
            TemplateData = request.TemplateData,
            UsageCount = 0
        };

        var createdTemplate = await _templateRepository.CreateAsync(template);
        
        _logger.LogInformation("Template created successfully: {TemplateId}", createdTemplate.Id);
        
        return MapToDto(createdTemplate);
    }

    public async Task<TemplateDto> UpdateTemplateAsync(Guid id, UpdateTemplateRequest request)
    {
        _logger.LogInformation("Updating template: {TemplateId}", id);

        var template = await _templateRepository.GetByIdAsync(id);
        if (template == null)
        {
            _logger.LogWarning("Template not found: {TemplateId}", id);
            throw new KeyNotFoundException($"Template with ID {id} not found");
        }

        // Validate JSON structure
        if (!IsValidJson(request.TemplateData))
        {
            _logger.LogWarning("Invalid JSON structure in TemplateData");
            throw new ArgumentException("Invalid JSON structure in TemplateData");
        }

        // Update properties
        template.Name = request.Name;
        template.Description = request.Description;
        template.Category = request.Category;
        template.PreviewImageUrl = request.PreviewImageUrl;
        template.IsPublic = request.IsPublic;
        template.IsPremium = request.IsPremium;
        template.TemplateData = request.TemplateData;

        await _templateRepository.UpdateAsync(template);
        
        _logger.LogInformation("Template updated successfully: {TemplateId}", id);
        
        return MapToDto(template);
    }

    public async Task<bool> DeleteTemplateAsync(Guid id)
    {
        _logger.LogInformation("Deleting template: {TemplateId}", id);

        var exists = await _templateRepository.ExistsAsync(id);
        if (!exists)
        {
            _logger.LogWarning("Template not found: {TemplateId}", id);
            return false;
        }

        await _templateRepository.DeleteAsync(id);
        
        _logger.LogInformation("Template deleted successfully: {TemplateId}", id);
        
        return true;
    }

    public async Task<bool> ApplyTemplateAsync(Guid templateId, Guid userId, Guid tenantId, Guid? projectId = null)
    {
        _logger.LogInformation(
            "Applying template {TemplateId} for user {UserId} in tenant {TenantId}",
            templateId, userId, tenantId);

        var template = await _templateRepository.GetByIdAsync(templateId);
        if (template == null)
        {
            _logger.LogWarning("Template not found: {TemplateId}", templateId);
            throw new InvalidOperationException($"Template {templateId} not found");
        }

        // Premium check - verify if tenant has Pro subscription for premium templates
        if (template.IsPremium)
        {
            // Query tenant directly using the tenantId parameter
            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null)
            {
                _logger.LogWarning("Tenant not found: {TenantId}", tenantId);
                throw new InvalidOperationException("Tenant not found");
            }

            if (tenant.SubscriptionPlan == SubscriptionPlan.Free)
            {
                _logger.LogWarning(
                    "Premium template {TemplateId} requires Pro or Enterprise subscription. Current: {Plan}",
                    templateId, tenant.SubscriptionPlan);
                throw new UnauthorizedAccessException(
                    "This premium template requires a Pro or Enterprise subscription. Please upgrade to continue.");
            }

            _logger.LogInformation(
                "Premium template access granted for tenant {TenantId} with plan {Plan}",
                tenantId, tenant.SubscriptionPlan);
        }

        // Check if site already exists for this project or tenant
        Site? existingSite = null;
        
        // First, check for project-specific site
        if (projectId.HasValue)
        {
            existingSite = await _siteRepository.GetByProjectIdAsync(projectId.Value);
        }
        
        // If no project-specific site, check for tenant-level site that's not assigned to another project
        if (existingSite == null)
        {
            var tenantSite = await _siteRepository.GetFirstByTenantIdAsync(tenantId);
            // Only use tenant site if it's not already assigned to a different project
            if (tenantSite != null && (!tenantSite.ProjectId.HasValue || tenantSite.ProjectId == projectId))
            {
                existingSite = tenantSite;
            }
        }

        if (existingSite != null)
        {
            // Update existing site
            existingSite.TemplateId = templateId;
            existingSite.SiteData = template.TemplateData;
            existingSite.UpdatedAt = DateTime.UtcNow;
            
            // Update project reference if provided
            if (projectId.HasValue)
            {
                existingSite.ProjectId = projectId.Value;
            }
            
            await _siteRepository.UpdateAsync(existingSite);
            
            _logger.LogInformation(
                "Updated existing site {SiteId} with template {TemplateId}",
                existingSite.Id, templateId);
        }
        else
        {
            // Create new site
            var newSite = new Site
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                UserId = userId,
                TemplateId = templateId,
                ProjectId = projectId,
                Name = $"{template.Name} Site",
                SiteData = template.TemplateData,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _siteRepository.CreateAsync(newSite);
            
            _logger.LogInformation(
                "Created new site {SiteId} with template {TemplateId}",
                newSite.Id, templateId);
        }

        // Increment usage count
        await _templateRepository.IncrementUsageCountAsync(templateId);
        
        _logger.LogInformation("Template applied successfully: {TemplateId}", templateId);
        
        return true;
    }

    public async Task<bool> ToggleFavoriteAsync(Guid templateId, Guid userId, Guid tenantId)
    {
        _logger.LogInformation(
            "Toggling favorite for template {TemplateId}, user {UserId}",
            templateId, userId);

        var template = await _templateRepository.GetByIdAsync(templateId);
        if (template == null)
        {
            _logger.LogWarning("Template not found: {TemplateId}", templateId);
            throw new InvalidOperationException($"Template {templateId} not found");
        }

        var isFavorited = await _templateRepository.ToggleFavoriteAsync(templateId, userId, tenantId);
        
        _logger.LogInformation(
            "Template {TemplateId} favorite status: {IsFavorited}",
            templateId, isFavorited);

        return isFavorited;
    }

    public async Task<IEnumerable<TemplateDto>> GetUserFavoritesAsync(Guid userId, Guid tenantId)
    {
        _logger.LogInformation("Getting favorites for user {UserId}", userId);
        
        var favorites = await _templateRepository.GetFavoritesByUserAsync(userId, tenantId);
        return favorites.Select(t => MapToDto(t, isFavorited: true));
    }

    private static TemplateDto MapToDto(Template template, bool isFavorited = false)
    {
        return new TemplateDto
        {
            Id = template.Id,
            TenantId = template.TenantId,
            Name = template.Name,
            Description = template.Description,
            Category = template.Category,
            PreviewImageUrl = template.PreviewImageUrl,
            IsPublic = template.IsPublic,
            IsPremium = template.IsPremium,
            TemplateData = template.TemplateData,
            UsageCount = template.UsageCount,
            IsFavorited = isFavorited,
            CreatedAt = template.CreatedAt,
            UpdatedAt = template.UpdatedAt
        };
    }

    private static bool IsValidJson(string jsonString)
    {
        if (string.IsNullOrWhiteSpace(jsonString))
            return false;

        try
        {
            JsonDocument.Parse(jsonString);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }
}
