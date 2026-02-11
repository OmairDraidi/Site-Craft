using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System.Net;

namespace SiteCraft.Infrastructure.Middleware;

/// <summary>
/// Simple rate limiting middleware for authentication endpoints
/// Prevents brute force attacks on login/register endpoints
/// </summary>
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IDistributedCache _cache;
    private readonly ILogger<RateLimitingMiddleware> _logger;

    // Rate limit configuration
    private const int MaxRequestsPerMinute = 10;
    private const int MaxRequestsPer5Minutes = 30;
    private const int MaxRequestsPerHour = 100;

    public RateLimitingMiddleware(
        RequestDelegate next,
        IDistributedCache cache,
        ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _cache = cache;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Only apply rate limiting to auth endpoints
        var path = context.Request.Path.ToString().ToLower();
        if (!path.Contains("/api/v1/auth/login") && 
            !path.Contains("/api/v1/auth/register") &&
            !path.Contains("/api/v1/auth/refresh"))
        {
            await _next(context);
            return;
        }

        // Get client identifier (IP address + endpoint)
        var clientId = GetClientIdentifier(context);
        var endpoint = context.Request.Path.ToString();
        var key = $"ratelimit:{clientId}:{endpoint}";

        // Check rate limits
        if (await IsRateLimited(key))
        {
            _logger.LogWarning("Rate limit exceeded for {ClientId} on {Endpoint}", clientId, endpoint);
            
            context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            context.Response.ContentType = "application/json";
            
            await context.Response.WriteAsJsonAsync(new
            {
                success = false,
                message = "Too many requests. Please try again later.",
                retryAfter = 60
            });
            
            return;
        }

        // Increment request counter
        await IncrementRequestCount(key);

        await _next(context);
    }

    private string GetClientIdentifier(HttpContext context)
    {
        // Try to get real IP from headers (for reverse proxy scenarios)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        
        var clientIp = forwardedFor ?? realIp ?? context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        
        return clientIp;
    }

    private async Task<bool> IsRateLimited(string key)
    {
        // Check 1 minute limit
        var count1Min = await GetCount($"{key}:1min");
        if (count1Min >= MaxRequestsPerMinute)
        {
            return true;
        }

        // Check 5 minute limit
        var count5Min = await GetCount($"{key}:5min");
        if (count5Min >= MaxRequestsPer5Minutes)
        {
            return true;
        }

        // Check 1 hour limit
        var count1Hour = await GetCount($"{key}:1hour");
        if (count1Hour >= MaxRequestsPerHour)
        {
            return true;
        }

        return false;
    }

    private async Task IncrementRequestCount(string key)
    {
        // Increment counters with different TTLs
        await IncrementCounter($"{key}:1min", TimeSpan.FromMinutes(1));
        await IncrementCounter($"{key}:5min", TimeSpan.FromMinutes(5));
        await IncrementCounter($"{key}:1hour", TimeSpan.FromHours(1));
    }

    private async Task<int> GetCount(string key)
    {
        var value = await _cache.GetStringAsync(key);
        return string.IsNullOrEmpty(value) ? 0 : int.Parse(value);
    }

    private async Task IncrementCounter(string key, TimeSpan expiration)
    {
        var currentCount = await GetCount(key);
        var newCount = currentCount + 1;
        
        await _cache.SetStringAsync(
            key,
            newCount.ToString(),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration
            });
    }
}
