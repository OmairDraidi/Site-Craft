using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken> CreateAsync(RefreshToken token);
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task RevokeAsync(Guid tokenId);
    Task RevokeAllForUserAsync(Guid userId);
}
