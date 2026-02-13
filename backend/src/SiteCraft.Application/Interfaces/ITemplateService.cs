using SiteCraft.Application.DTOs.Templates;

namespace SiteCraft.Application.Interfaces;

public interface ITemplateService
{
    Task<TemplateDto?> GetTemplateByIdAsync(Guid id);
    Task<IEnumerable<TemplateDto>> GetAllTemplatesAsync(Guid? currentTenantId = null);
    Task<IEnumerable<TemplateDto>> GetPublicTemplatesAsync();
    Task<IEnumerable<TemplateDto>> GetFilteredTemplatesAsync(
        TemplateFilterRequest filter, 
        Guid? currentTenantId = null);
    Task<TemplateDto> CreateTemplateAsync(CreateTemplateRequest request, Guid? tenantId = null);
    Task<TemplateDto> UpdateTemplateAsync(Guid id, UpdateTemplateRequest request);
    Task<bool> DeleteTemplateAsync(Guid id);
    Task<bool> ApplyTemplateAsync(Guid templateId, Guid userId, Guid tenantId, Guid? projectId = null);
    
    // Favorite operations
    Task<bool> ToggleFavoriteAsync(Guid templateId, Guid userId, Guid tenantId);
    Task<IEnumerable<TemplateDto>> GetUserFavoritesAsync(Guid userId, Guid tenantId);
    Task<TemplateDto?> GetTemplateByIdAsync(Guid id, Guid? userId = null);
}
