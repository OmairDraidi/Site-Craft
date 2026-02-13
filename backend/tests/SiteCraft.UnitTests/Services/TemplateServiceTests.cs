using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using SiteCraft.Application.DTOs.Templates;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Enums;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Services;

namespace SiteCraft.UnitTests.Services;

public class TemplateServiceTests
{
    private readonly Mock<ITemplateRepository> _mockTemplateRepository;
    private readonly Mock<ISiteRepository> _mockSiteRepository;
    private readonly Mock<ITenantService> _mockTenantService;
    private readonly Mock<ILogger<TemplateService>> _mockLogger;
    private readonly TemplateService _templateService;

    public TemplateServiceTests()
    {
        _mockTemplateRepository = new Mock<ITemplateRepository>();
        _mockSiteRepository = new Mock<ISiteRepository>();
        _mockTenantService = new Mock<ITenantService>();
        _mockLogger = new Mock<ILogger<TemplateService>>();
        
        _templateService = new TemplateService(
            _mockTemplateRepository.Object,
            _mockSiteRepository.Object,
            _mockTenantService.Object,
            null!, // DbContext not needed for most tests
            _mockLogger.Object
        );
    }

    [Fact]
    public async Task GetTemplateByIdAsync_ExistingId_ReturnsTemplate()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        var template = new Template
        {
            Id = templateId,
            Name = "Test Template",
            Description = "Test Description",
            Category = "Business",
            PreviewImageUrl = "https://example.com/image.jpg",
            IsPublic = true,
            IsPremium = false,
            TemplateData = "{}",
            UsageCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync(template);

        _mockTemplateRepository
            .Setup(r => r.IsFavoritedAsync(templateId, It.IsAny<Guid>()))
            .ReturnsAsync(false);

        // Act
        var result = await _templateService.GetTemplateByIdAsync(templateId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(templateId.ToString());
        result.Name.Should().Be("Test Template");
    }

    [Fact]
    public async Task GetTemplateByIdAsync_NonExistingId_ReturnsNull()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync((Template?)null);

        // Act
        var result = await _templateService.GetTemplateByIdAsync(templateId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateTemplateAsync_ValidData_ReturnsCreatedTemplate()
    {
        // Arrange
        var request = new CreateTemplateRequest
        {
            Name = "New Template",
            Description = "New Description",
            Category = "Education",
            PreviewImageUrl = "https://example.com/preview.jpg",
            IsPublic = true,
            IsPremium = false,
            TemplateData = "{\"version\":\"1.0\"}"
        };

        var createdTemplate = new Template
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            PreviewImageUrl = request.PreviewImageUrl,
            IsPublic = request.IsPublic,
            IsPremium = request.IsPremium,
            TemplateData = request.TemplateData,
            UsageCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _mockTemplateRepository
            .Setup(r => r.CreateAsync(It.IsAny<Template>()))
            .ReturnsAsync(createdTemplate);

        // Act
        var result = await _templateService.CreateTemplateAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(request.Name);
        result.Category.Should().Be(request.Category);
        _mockTemplateRepository.Verify(r => r.CreateAsync(It.IsAny<Template>()), Times.Once);
    }

    [Fact]
    public async Task CreateTemplateAsync_InvalidJson_ThrowsException()
    {
        // Arrange
        var request = new CreateTemplateRequest
        {
            Name = "Invalid Template",
            Description = "Invalid JSON",
            Category = "Business",
            PreviewImageUrl = "https://example.com/preview.jpg",
            IsPublic = true,
            IsPremium = false,
            TemplateData = "not valid json"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            async () => await _templateService.CreateTemplateAsync(request)
        );
    }

    [Fact]
    public async Task DeleteTemplateAsync_ExistingId_ReturnsTrue()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        _mockTemplateRepository
            .Setup(r => r.ExistsAsync(templateId))
            .ReturnsAsync(true);

        // Act
        var result = await _templateService.DeleteTemplateAsync(templateId);

        // Assert
        result.Should().BeTrue();
        _mockTemplateRepository.Verify(r => r.DeleteAsync(templateId), Times.Once);
    }

    [Fact]
    public async Task ApplyTemplateAsync_FreeTemplate_CreatesNewSite()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var tenantId = Guid.NewGuid();

        var template = new Template
        {
            Id = templateId,
            Name = "Free Template",
            IsPremium = false,
            TemplateData = "{\"pages\":[]}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync(template);

        _mockSiteRepository
            .Setup(r => r.GetFirstByTenantIdAsync(tenantId))
            .ReturnsAsync((Site?)null);

        _mockSiteRepository
            .Setup(r => r.CreateAsync(It.IsAny<Site>()))
            .ReturnsAsync((Site s) => s);

        // Act
        var result = await _templateService.ApplyTemplateAsync(templateId, userId, tenantId);

        // Assert
        result.Should().BeTrue();
        _mockSiteRepository.Verify(r => r.CreateAsync(It.IsAny<Site>()), Times.Once);
        _mockTemplateRepository.Verify(r => r.IncrementUsageCountAsync(templateId), Times.Once);
    }

    [Fact]
    public async Task ApplyTemplateAsync_PremiumTemplate_FreeTenant_ThrowsException()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var tenantId = Guid.NewGuid();

        var template = new Template
        {
            Id = templateId,
            Name = "Premium Template",
            IsPremium = true,
            TemplateData = "{}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var tenant = new Tenant
        {
            Id = tenantId,
            Name = "Test Tenant",
            Subdomain = "test",
            SubscriptionPlan = SubscriptionPlan.Free
        };

        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync(template);

        _mockTenantService
            .Setup(s => s.GetCurrentTenantAsync())
            .ReturnsAsync(tenant);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await _templateService.ApplyTemplateAsync(templateId, userId, tenantId)
        );
    }

    [Fact]
    public async Task ApplyTemplateAsync_PremiumTemplate_ProTenant_Succeeds()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var tenantId = Guid.NewGuid();

        var template = new Template
        {
            Id = templateId,
            Name = "Premium Template",
            IsPremium = true,
            TemplateData = "{}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var tenant = new Tenant
        {
            Id = tenantId,
            Name = "Pro Tenant",
            Subdomain = "pro",
            SubscriptionPlan = SubscriptionPlan.Pro
        };

        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync(template);

        _mockTenantService
            .Setup(s => s.GetCurrentTenantAsync())
            .ReturnsAsync(tenant);

        _mockSiteRepository
            .Setup(r => r.GetFirstByTenantIdAsync(tenantId))
            .ReturnsAsync((Site?)null);

        _mockSiteRepository
            .Setup(r => r.CreateAsync(It.IsAny<Site>()))
            .ReturnsAsync((Site s) => s);

        // Act
        var result = await _templateService.ApplyTemplateAsync(templateId, userId, tenantId);

        // Assert
        result.Should().BeTrue();
        _mockSiteRepository.Verify(r => r.CreateAsync(It.IsAny<Site>()), Times.Once);
    }

    [Fact]
    public async Task ApplyTemplateAsync_ExistingSite_UpdatesSiteData()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var tenantId = Guid.NewGuid();

        var template = new Template
        {
            Id = templateId,
            Name = "Updated Template",
            IsPremium = false,
            TemplateData = "{\"updated\":true}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var existingSite = new Site
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            UserId = userId,
            Name = "Existing Site",
            SiteData = "{\"old\":true}",
            CreatedAt = DateTime.UtcNow
        };

        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync(template);

        _mockSiteRepository
            .Setup(r => r.GetFirstByTenantIdAsync(tenantId))
            .ReturnsAsync(existingSite);

        // Act
        var result = await _templateService.ApplyTemplateAsync(templateId, userId, tenantId);

        // Assert
        result.Should().BeTrue();
        _mockSiteRepository.Verify(r => r.UpdateAsync(It.IsAny<Site>()), Times.Once);
        _mockSiteRepository.Verify(r => r.CreateAsync(It.IsAny<Site>()), Times.Never);
    }

    [Fact]
    public async Task ToggleFavoriteAsync_NotFavorited_AddsFavorite()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var tenantId = Guid.NewGuid();

        var template = new Template
        {
            Id = templateId,
            Name = "Favorite Template",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync(template);

        _mockTemplateRepository
            .Setup(r => r.ToggleFavoriteAsync(templateId, userId, tenantId))
            .ReturnsAsync(true);

        // Act
        var result = await _templateService.ToggleFavoriteAsync(templateId, userId, tenantId);

        // Assert
        result.Should().BeTrue();
        _mockTemplateRepository.Verify(r => r.ToggleFavoriteAsync(templateId, userId, tenantId), Times.Once);
    }

    [Fact]
    public async Task ToggleFavoriteAsync_AlreadyFavorited_RemovesFavorite()
    {
        // Arrange
        var templateId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var tenantId = Guid.NewGuid();

        var template = new Template
        {
            Id = templateId,
            Name = "Favorite Template",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _mockTemplateRepository
            .Setup(r => r.GetByIdAsync(templateId))
            .ReturnsAsync(template);

        _mockTemplateRepository
            .Setup(r => r.ToggleFavoriteAsync(templateId, userId, tenantId))
            .ReturnsAsync(false);

        // Act
        var result = await _templateService.ToggleFavoriteAsync(templateId, userId, tenantId);

        // Assert
        result.Should().BeFalse();
        _mockTemplateRepository.Verify(r => r.ToggleFavoriteAsync(templateId, userId, tenantId), Times.Once);
    }
}
