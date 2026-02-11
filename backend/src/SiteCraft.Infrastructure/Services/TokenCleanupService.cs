using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SiteCraft.Infrastructure.Data;

namespace SiteCraft.Infrastructure.Services;

/// <summary>
/// Background service that periodically cleans up expired and revoked refresh tokens
/// Runs every hour to keep the database clean
/// </summary>
public class TokenCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TokenCleanupService> _logger;
    private readonly TimeSpan _cleanupInterval = TimeSpan.FromHours(1);

    public TokenCleanupService(
        IServiceProvider serviceProvider,
        ILogger<TokenCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Token Cleanup Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CleanupExpiredTokens();
                
                // Wait for the next cleanup interval
                await Task.Delay(_cleanupInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Token Cleanup Service is stopping");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during token cleanup");
                
                // Wait a bit before retrying in case of error
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }

    private async Task CleanupExpiredTokens()
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<SiteCraftDbContext>();

        try
        {
            var cutoffDate = DateTime.UtcNow;
            
            // Find expired and revoked tokens
            var tokensToDelete = await dbContext.RefreshTokens
                .Where(t => 
                    t.ExpiresAt < cutoffDate ||  // Expired tokens
                    t.RevokedAt != null)          // Revoked tokens
                .ToListAsync();

            if (tokensToDelete.Any())
            {
                _logger.LogInformation(
                    "Cleaning up {Count} expired/revoked tokens. Expired: {Expired}, Revoked: {Revoked}",
                    tokensToDelete.Count,
                    tokensToDelete.Count(t => t.ExpiresAt < cutoffDate && t.RevokedAt == null),
                    tokensToDelete.Count(t => t.RevokedAt != null));

                dbContext.RefreshTokens.RemoveRange(tokensToDelete);
                await dbContext.SaveChangesAsync();

                _logger.LogInformation("Token cleanup completed successfully");
            }
            else
            {
                _logger.LogDebug("No expired tokens found during cleanup");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to cleanup expired tokens");
            throw;
        }
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Token Cleanup Service is stopping");
        await base.StopAsync(stoppingToken);
    }
}
