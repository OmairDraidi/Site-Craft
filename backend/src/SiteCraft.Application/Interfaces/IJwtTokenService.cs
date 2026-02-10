using SiteCraft.Domain.Entities;

namespace SiteCraft.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    DateTime GetTokenExpiryTime();
}
