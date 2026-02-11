using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace SiteCraft.Infrastructure.Services;

/// <summary>
/// Validates required environment variables and configuration on application startup
/// Prevents deployment with missing or invalid configuration
/// </summary>
public class ConfigurationValidationService : IHostedService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ConfigurationValidationService> _logger;
    private readonly IHostApplicationLifetime _lifetime;

    public ConfigurationValidationService(
        IConfiguration configuration,
        ILogger<ConfigurationValidationService> logger,
        IHostApplicationLifetime lifetime)
    {
        _configuration = configuration;
        _logger = logger;
        _lifetime = lifetime;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting configuration validation...");

        try
        {
            ValidateConfiguration();
            _logger.LogInformation("✅ Configuration validation passed");
            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex, "❌ Configuration validation failed. Application will not start.");
            
            // Stop the application if validation fails
            _lifetime.StopApplication();
            throw;
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private void ValidateConfiguration()
    {
        var errors = new List<string>();

        // Validate Database Connection
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrEmpty(connectionString))
        {
            errors.Add("Database connection string is missing");
        }

        // Validate Redis Connection
        var redisConnection = _configuration.GetValue<string>("Redis:ConnectionString");
        if (string.IsNullOrEmpty(redisConnection))
        {
            errors.Add("Redis connection string is missing");
        }

        // Validate JWT Settings
        var jwtSecret = _configuration.GetValue<string>("JwtSettings:SecretKey");
        if (string.IsNullOrEmpty(jwtSecret))
        {
            errors.Add("JWT SecretKey is missing");
        }
        else if (jwtSecret.Length < 32)
        {
            errors.Add("JWT SecretKey must be at least 32 characters long");
        }
        else if (jwtSecret.Contains("YOUR_SUPER_SECRET_KEY") || jwtSecret.Contains("CHANGE_THIS"))
        {
            _logger.LogWarning("⚠️ JWT SecretKey appears to be using default value. Please change it for production!");
        }

        var jwtIssuer = _configuration.GetValue<string>("JwtSettings:Issuer");
        if (string.IsNullOrEmpty(jwtIssuer))
        {
            errors.Add("JWT Issuer is missing");
        }

        var jwtAudience = _configuration.GetValue<string>("JwtSettings:Audience");
        if (string.IsNullOrEmpty(jwtAudience))
        {
            errors.Add("JWT Audience is missing");
        }

        var jwtExpiry = _configuration.GetValue<int?>("JwtSettings:ExpiryMinutes");
        if (!jwtExpiry.HasValue || jwtExpiry.Value <= 0)
        {
            errors.Add("JWT ExpiryMinutes must be a positive number");
        }

        // Validate CORS Origins
        var corsOrigins = _configuration.GetSection("CorsOrigins").Get<string[]>();
        if (corsOrigins == null || corsOrigins.Length == 0)
        {
            _logger.LogWarning("⚠️ No CORS origins configured. This may cause issues in production.");
        }
        else
        {
            foreach (var origin in corsOrigins)
            {
                if (string.IsNullOrEmpty(origin))
                {
                    errors.Add("CORS origin cannot be empty");
                }
                else if (!Uri.TryCreate(origin, UriKind.Absolute, out _))
                {
                    errors.Add($"Invalid CORS origin format: {origin}");
                }
            }
        }

        // Validate Rate Limiting Settings
        var maxRequestsPerMinute = _configuration.GetValue<int?>("RateLimiting:MaxRequestsPerMinute");
        if (maxRequestsPerMinute.HasValue && maxRequestsPerMinute.Value <= 0)
        {
            errors.Add("RateLimiting:MaxRequestsPerMinute must be positive");
        }

        // If any errors, throw exception
        if (errors.Any())
        {
            var errorMessage = string.Join(Environment.NewLine + "  - ", errors);
            throw new InvalidOperationException(
                $"Configuration validation failed:{Environment.NewLine}  - {errorMessage}");
        }

        // Log configuration summary
        _logger.LogInformation("Configuration Summary:");
        _logger.LogInformation("  - Database: {Database}", 
            connectionString?.Split(';').FirstOrDefault(x => x.StartsWith("Database="))?.Replace("Database=", "") ?? "Unknown");
        _logger.LogInformation("  - Redis: {Redis}", redisConnection);
        _logger.LogInformation("  - JWT Issuer: {Issuer}", jwtIssuer);
        _logger.LogInformation("  - JWT Expiry: {Expiry} minutes", jwtExpiry);
        _logger.LogInformation("  - CORS Origins: {Count} configured", corsOrigins?.Length ?? 0);
        _logger.LogInformation("  - Rate Limiting: {Enabled}", 
            _configuration.GetValue<bool>("RateLimiting:EnableRateLimiting") ? "Enabled" : "Disabled");
    }
}
