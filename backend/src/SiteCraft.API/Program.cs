using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Application.Interfaces;
using SiteCraft.Infrastructure.Data;
using SiteCraft.Infrastructure.Data.Extensions;
using SiteCraft.Infrastructure.Services;
using SiteCraft.Infrastructure.Middleware;
using SiteCraft.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel - Docker will override with environment variable
// builder.WebHost.UseUrls("http://localhost:5000"); // Commented for Docker compatibility

// ============================================
// Serilog Configuration
// ============================================
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/sitecraft-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ============================================
// Services Configuration
// ============================================

// Add Controllers
builder.Services.AddControllers();

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<SiteCraft.Application.Validators.RegisterRequestValidator>();
builder.Services.AddFluentValidationAutoValidation();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SiteCraft API",
        Version = "v1",
        Description = "AI-Powered Website Builder Platform API"
    });
    
    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token"
    });
    
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("CorsOrigins").Get<string[]>() ?? new[] { "http://localhost:5173" })
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add Database Context (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SiteCraftDbContext>(options =>
{
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21)));
});

// Add Tenant Service (Multi-Tenancy)
builder.Services.AddScoped<ITenantService, TenantService>();

// Add Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();
builder.Services.AddScoped<ISiteRepository, SiteRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();

// Add Application Services
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenBlacklistService, TokenBlacklistService>();
builder.Services.AddScoped<ITemplateService, TemplateService>();
builder.Services.AddScoped<IProjectService, ProjectService>();

// Add Background Services
builder.Services.AddHostedService<ConfigurationValidationService>(); // Validates configuration on startup
builder.Services.AddHostedService<TokenCleanupService>(); // Cleans up expired tokens hourly

// Add Redis (StackExchange.Redis)
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetValue<string>("Redis:ConnectionString");
    options.InstanceName = "SiteCraft_";
});

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("SecretKey");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
    };
});

// Add Authorization with Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(SiteCraft.Infrastructure.Authorization.Policies.RequireOwnerRole, policy =>
        policy.Requirements.Add(new SiteCraft.Infrastructure.Authorization.OwnerRoleRequirement()));
    
    options.AddPolicy(SiteCraft.Infrastructure.Authorization.Policies.RequireAdminRole, policy =>
        policy.Requirements.Add(new SiteCraft.Infrastructure.Authorization.AdminRoleRequirement()));
    
    options.AddPolicy(SiteCraft.Infrastructure.Authorization.Policies.RequireAuthenticatedUser, policy =>
        policy.RequireAuthenticatedUser());
});

// Register Authorization Handlers
builder.Services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationHandler, SiteCraft.Infrastructure.Authorization.OwnerRoleHandler>();
builder.Services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationHandler, SiteCraft.Infrastructure.Authorization.AdminRoleHandler>();

// Add Health Checks
builder.Services.AddHealthChecks();

// ============================================
// Middleware Pipeline
// ============================================

var app = builder.Build();

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<SiteCraftDbContext>();
        Log.Information("Applying database migrations...");
        dbContext.Database.Migrate();
        Log.Information("Database migrations applied successfully");
        
        // Seed default templates
        Log.Information("Seeding default templates...");
        dbContext.SeedTemplates();
        Log.Information("Templates seeded successfully");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while migrating the database");
    }
}

// Development Environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SiteCraft API v1");
        c.RoutePrefix = "swagger";
    });
}

// Request Logging
app.UseSerilogRequestLogging();

// CORS
app.UseCors("AllowFrontend");

// Rate Limiting (must be before authentication)
app.UseMiddleware<RateLimitingMiddleware>();

// Multi-Tenancy Resolution
app.UseMiddleware<TenantResolutionMiddleware>();

// HTTPS Redirection (optional in development)
// app.UseHttpsRedirection();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

// Health Check Endpoint
app.MapHealthChecks("/api/health");

// Simple test endpoint
app.MapGet("/api/hello", () => new { message = "Hello from SiteCraft API!", timestamp = DateTime.UtcNow });

// ============================================
// Run Application
// ============================================

try
{
    Log.Information("Starting SiteCraft API...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
