using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SiteCraft.Application.DTOs.Auth;
using SiteCraft.Application.DTOs.Common;
using SiteCraft.Domain.Interfaces;

namespace SiteCraft.API.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ITenantService _tenantService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        ITenantService tenantService,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _tenantService = tenantService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> Register([FromBody] RegisterRequestDTO request)
    {
        try
        {
            var tenantId = _tenantService.GetCurrentTenantId();
            if (!tenantId.HasValue)
            {
                return BadRequest(ApiResponse<AuthResponseDTO>.ErrorResponse("Tenant not found. Please provide X-Tenant-Id header."));
            }

            var result = await _authService.RegisterAsync(
                request.Email,
                request.Password,
                request.FirstName,
                request.LastName,
                tenantId.Value
            );

            if (!result.Success)
            {
                return BadRequest(ApiResponse<AuthResponseDTO>.ErrorResponse(result.Message ?? "Registration failed"));
            }

            var response = new AuthResponseDTO
            {
                AccessToken = result.AccessToken!,
                RefreshToken = result.RefreshToken!,
                ExpiresAt = result.ExpiresAt!.Value,
                User = new UserDTO
                {
                    Id = result.UserId!.Value,
                    Email = result.Email!,
                    FirstName = result.FirstName!,
                    LastName = result.LastName!,
                    Role = result.Role!,
                    TenantId = result.TenantId!.Value
                }
            };

            return Ok(ApiResponse<AuthResponseDTO>.SuccessResponse(response, "Registration successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, ApiResponse<AuthResponseDTO>.ErrorResponse("An error occurred during registration"));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> Login([FromBody] LoginRequestDTO request)
    {
        try
        {
            var tenantId = _tenantService.GetCurrentTenantId();
            if (!tenantId.HasValue)
            {
                return BadRequest(ApiResponse<AuthResponseDTO>.ErrorResponse("Tenant not found. Please provide X-Tenant-Id header."));
            }

            var result = await _authService.LoginAsync(
                request.Email,
                request.Password,
                tenantId.Value
            );

            if (!result.Success)
            {
                return Unauthorized(ApiResponse<AuthResponseDTO>.ErrorResponse(result.Message ?? "Login failed"));
            }

            var response = new AuthResponseDTO
            {
                AccessToken = result.AccessToken!,
                RefreshToken = result.RefreshToken!,
                ExpiresAt = result.ExpiresAt!.Value,
                User = new UserDTO
                {
                    Id = result.UserId!.Value,
                    Email = result.Email!,
                    FirstName = result.FirstName!,
                    LastName = result.LastName!,
                    Role = result.Role!,
                    TenantId = result.TenantId!.Value
                }
            };

            return Ok(ApiResponse<AuthResponseDTO>.SuccessResponse(response, "Login successful"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, ApiResponse<AuthResponseDTO>.ErrorResponse("An error occurred during login"));
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<AuthResponseDTO>>> RefreshToken([FromBody] RefreshTokenRequestDTO request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);

            if (!result.Success)
            {
                return Unauthorized(ApiResponse<AuthResponseDTO>.ErrorResponse(result.Message ?? "Token refresh failed"));
            }

            var response = new AuthResponseDTO
            {
                AccessToken = result.AccessToken!,
                RefreshToken = result.RefreshToken!,
                ExpiresAt = result.ExpiresAt!.Value,
                User = new UserDTO
                {
                    Id = result.UserId!.Value,
                    Email = result.Email!,
                    FirstName = result.FirstName!,
                    LastName = result.LastName!,
                    Role = result.Role!,
                    TenantId = result.TenantId!.Value
                }
            };

            return Ok(ApiResponse<AuthResponseDTO>.SuccessResponse(response, "Token refreshed successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, ApiResponse<AuthResponseDTO>.ErrorResponse("An error occurred during token refresh"));
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse>> Logout()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));
            }

            var userId = Guid.Parse(userIdClaim.Value);
            await _authService.LogoutAsync(userId);

            return Ok(new ApiResponse { Success = true, Message = "Logout successful" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, ApiResponse.ErrorResponse("An error occurred during logout"));
        }
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<ApiResponse<UserDTO>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var emailClaim = User.FindFirst(ClaimTypes.Email);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            var tenantIdClaim = User.FindFirst("tenant_id");

            if (userIdClaim == null || emailClaim == null)
            {
                return Unauthorized(ApiResponse<UserDTO>.ErrorResponse("User not authenticated"));
            }

            var userDto = new UserDTO
            {
                Id = Guid.Parse(userIdClaim.Value),
                Email = emailClaim.Value,
                FirstName = "", // These would need to be included in JWT claims if needed
                LastName = "",
                Role = roleClaim?.Value ?? "",
                TenantId = tenantIdClaim != null ? Guid.Parse(tenantIdClaim.Value) : Guid.Empty
            };

            return Ok(ApiResponse<UserDTO>.SuccessResponse(userDto, "User retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving current user");
            return StatusCode(500, ApiResponse<UserDTO>.ErrorResponse("An error occurred"));
        }
    }
}
