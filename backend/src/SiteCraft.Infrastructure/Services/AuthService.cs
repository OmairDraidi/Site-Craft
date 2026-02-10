using BCrypt.Net;
using SiteCraft.Application.Interfaces;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResult> RegisterAsync(string email, string password, string firstName, string lastName, Guid tenantId)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(email, tenantId))
        {
            return new AuthResult
            {
                Success = false,
                Message = "Email already exists"
            };
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            PasswordHash = passwordHash,
            Role = Domain.Enums.UserRole.Member,
            IsActive = true,
            EmailVerified = false,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);

        // Generate tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        var expiresAt = _jwtTokenService.GetTokenExpiryTime();

        // Save refresh token
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TenantId = user.TenantId,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };

        await _refreshTokenRepository.CreateAsync(refreshTokenEntity);

        return new AuthResult
        {
            Success = true,
            Message = "Registration successful",
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString(),
            TenantId = user.TenantId
        };
    }

    public async Task<AuthResult> LoginAsync(string email, string password, Guid tenantId)
    {
        // Get user
        var user = await _userRepository.GetByEmailAsync(email, tenantId);
        if (user == null)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return new AuthResult
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        // Check if user is active
        if (!user.IsActive)
        {
            return new AuthResult
            {
                Success = false,
                Message = "User account is inactive"
            };
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Generate tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();
        var expiresAt = _jwtTokenService.GetTokenExpiryTime();

        // Save refresh token
        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TenantId = user.TenantId,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };

        await _refreshTokenRepository.CreateAsync(refreshTokenEntity);

        return new AuthResult
        {
            Success = true,
            Message = "Login successful",
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString(),
            TenantId = user.TenantId
        };
    }

    public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
    {
        // Get refresh token
        var tokenEntity = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
        if (tokenEntity == null)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Invalid refresh token"
            };
        }

        // Check if token is revoked or expired
        if (tokenEntity.IsRevoked)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Refresh token has been revoked"
            };
        }

        if (tokenEntity.IsExpired)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Refresh token has expired"
            };
        }

        // Get user
        var user = await _userRepository.GetByIdAsync(tokenEntity.UserId);
        if (user == null || !user.IsActive)
        {
            return new AuthResult
            {
                Success = false,
                Message = "User not found or inactive"
            };
        }

        // Revoke old refresh token
        await _refreshTokenRepository.RevokeAsync(tokenEntity.Id);

        // Generate new tokens
        var accessToken = _jwtTokenService.GenerateAccessToken(user);
        var newRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var expiresAt = _jwtTokenService.GetTokenExpiryTime();

        // Save new refresh token
        var newRefreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TenantId = user.TenantId,
            Token = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };

        await _refreshTokenRepository.CreateAsync(newRefreshTokenEntity);

        return new AuthResult
        {
            Success = true,
            Message = "Token refreshed successfully",
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = expiresAt,
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString(),
            TenantId = user.TenantId
        };
    }

    public async Task LogoutAsync(Guid userId)
    {
        await _refreshTokenRepository.RevokeAllForUserAsync(userId);
    }
}
