using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace SiteCraft.Infrastructure.Services;

/// <summary>
/// Service for managing token blacklist using Redis
/// Used for immediate logout and token invalidation
/// </summary>
public interface ITokenBlacklistService
{
    Task BlacklistTokenAsync(string token, TimeSpan? expiration = null);
    Task<bool> IsTokenBlacklistedAsync(string token);
    Task BlacklistUserTokensAsync(Guid userId);
    Task<bool> IsUserBlacklistedAsync(Guid userId);
}

public class TokenBlacklistService : ITokenBlacklistService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<TokenBlacklistService> _logger;
    private const string TokenPrefix = "blacklist:token:";
    private const string UserPrefix = "blacklist:user:";

    public TokenBlacklistService(
        IDistributedCache cache,
        ILogger<TokenBlacklistService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Add a token to the blacklist
    /// </summary>
    public async Task BlacklistTokenAsync(string token, TimeSpan? expiration = null)
    {
        if (string.IsNullOrEmpty(token))
        {
            throw new ArgumentException("Token cannot be null or empty", nameof(token));
        }

        try
        {
            var key = $"{TokenPrefix}{GetTokenHash(token)}";
            var options = new DistributedCacheEntryOptions
            {
                // Default to 1 hour, or use the token's actual expiration
                AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromHours(1)
            };

            await _cache.SetStringAsync(key, DateTime.UtcNow.ToString("O"), options);
            
            _logger.LogInformation("Token blacklisted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to blacklist token");
            throw;
        }
    }

    /// <summary>
    /// Check if a token is blacklisted
    /// </summary>
    public async Task<bool> IsTokenBlacklistedAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return false;
        }

        try
        {
            var key = $"{TokenPrefix}{GetTokenHash(token)}";
            var value = await _cache.GetStringAsync(key);
            return !string.IsNullOrEmpty(value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check token blacklist status");
            // In case of error, allow the request to proceed (fail open)
            return false;
        }
    }

    /// <summary>
    /// Blacklist all tokens for a specific user (useful for immediate logout across all devices)
    /// </summary>
    public async Task BlacklistUserTokensAsync(Guid userId)
    {
        try
        {
            var key = $"{UserPrefix}{userId}";
            var options = new DistributedCacheEntryOptions
            {
                // Keep user blacklist for 24 hours
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
            };

            var data = new
            {
                BlacklistedAt = DateTime.UtcNow,
                Reason = "User logout - all sessions invalidated"
            };

            await _cache.SetStringAsync(key, JsonSerializer.Serialize(data), options);
            
            _logger.LogInformation("All tokens for user {UserId} have been blacklisted", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to blacklist user tokens for {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Check if a user's tokens are blacklisted
    /// </summary>
    public async Task<bool> IsUserBlacklistedAsync(Guid userId)
    {
        try
        {
            var key = $"{UserPrefix}{userId}";
            var value = await _cache.GetStringAsync(key);
            return !string.IsNullOrEmpty(value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check user blacklist status for {UserId}", userId);
            // In case of error, allow the request to proceed (fail open)
            return false;
        }
    }

    /// <summary>
    /// Generate a hash of the token for storage (to avoid storing full tokens)
    /// </summary>
    private string GetTokenHash(string token)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hashBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(hashBytes);
    }
}
