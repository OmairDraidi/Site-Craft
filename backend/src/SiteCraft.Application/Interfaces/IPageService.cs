using SiteCraft.Application.DTOs.Pages;

namespace SiteCraft.Application.Interfaces;

public interface IPageService
{
    Task<IEnumerable<PageListItemDto>> GetPagesAsync(Guid siteId, Guid tenantId);
    Task<PageDto?> GetPageByIdAsync(Guid id);
    Task<PageDto> CreatePageAsync(CreatePageRequest request, Guid userId, Guid tenantId);
    Task<PageDto> UpdatePageAsync(Guid id, UpdatePageRequest request, Guid userId);
    Task<bool> DeletePageAsync(Guid id, Guid userId);
    Task<PageDto> PublishPageAsync(Guid id, Guid userId);
    Task<PageDto> UnpublishPageAsync(Guid id, Guid userId);
}
