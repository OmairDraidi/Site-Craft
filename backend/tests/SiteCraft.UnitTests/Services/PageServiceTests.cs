using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using SiteCraft.Application.DTOs.Pages;
using SiteCraft.Domain.Entities;
using SiteCraft.Domain.Interfaces;
using SiteCraft.Infrastructure.Services;

namespace SiteCraft.UnitTests.Services;

public class PageServiceTests
{
    private readonly Mock<IPageRepository> _mockPageRepository;
    private readonly Mock<ISiteRepository> _mockSiteRepository;
    private readonly Mock<ILogger<PageService>> _mockLogger;
    private readonly PageService _pageService;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Guid _userId = Guid.NewGuid();
    private readonly Guid _siteId = Guid.NewGuid();

    public PageServiceTests()
    {
        _mockPageRepository = new Mock<IPageRepository>();
        _mockSiteRepository = new Mock<ISiteRepository>();
        _mockLogger = new Mock<ILogger<PageService>>();

        _pageService = new PageService(
            _mockPageRepository.Object,
            _mockSiteRepository.Object,
            _mockLogger.Object
        );
    }

    [Fact]
    public async Task GetPagesAsync_ValidSiteId_ReturnsPages()
    {
        // Arrange
        var pages = new List<Page>
        {
            new Page
            {
                Id = Guid.NewGuid(),
                TenantId = _tenantId,
                SiteId = _siteId,
                Title = "Home",
                Slug = "home",
                PageData = "{}",
                IsPublished = true,
                Order = 0,
                CreatedAt = DateTime.UtcNow
            },
            new Page
            {
                Id = Guid.NewGuid(),
                TenantId = _tenantId,
                SiteId = _siteId,
                Title = "About",
                Slug = "about",
                PageData = "{}",
                IsPublished = false,
                Order = 1,
                CreatedAt = DateTime.UtcNow
            }
        };

        _mockPageRepository
            .Setup(r => r.GetBySiteIdAsync(_siteId))
            .ReturnsAsync(pages);

        // Act
        var result = await _pageService.GetPagesAsync(_siteId, _tenantId);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.First().Title.Should().Be("Home");
        _mockPageRepository.Verify(r => r.GetBySiteIdAsync(_siteId), Times.Once);
    }

    [Fact]
    public async Task GetPageByIdAsync_ExistingId_ReturnsPage()
    {
        // Arrange
        var pageId = Guid.NewGuid();
        var page = new Page
        {
            Id = pageId,
            TenantId = _tenantId,
            SiteId = _siteId,
            Title = "Test Page",
            Slug = "test-page",
            MetaDescription = "Test description",
            PageData = "{\"sections\":[]}",
            IsPublished = false,
            Components = new List<Component>(),
            CreatedAt = DateTime.UtcNow
        };

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(pageId))
            .ReturnsAsync(page);

        // Act
        var result = await _pageService.GetPageByIdAsync(pageId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(pageId);
        result.Title.Should().Be("Test Page");
        result.Slug.Should().Be("test-page");
        result.ComponentCount.Should().Be(0);
    }

    [Fact]
    public async Task GetPageByIdAsync_NonExistingId_ReturnsNull()
    {
        // Arrange
        var pageId = Guid.NewGuid();
        _mockPageRepository
            .Setup(r => r.GetByIdAsync(pageId))
            .ReturnsAsync((Page?)null);

        // Act
        var result = await _pageService.GetPageByIdAsync(pageId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreatePageAsync_ValidData_ReturnsCreatedPage()
    {
        // Arrange
        var request = new CreatePageRequest
        {
            Title = "New Page",
            SiteId = _siteId,
            MetaDescription = "New page description",
            PageData = "{\"sections\":[]}"
        };

        var site = new Site
        {
            Id = _siteId,
            TenantId = _tenantId,
            UserId = _userId,
            Name = "Test Site",
            SiteData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync(site);

        _mockPageRepository
            .Setup(r => r.SlugExistsAsync(It.IsAny<string>(), _siteId, null))
            .ReturnsAsync(false);

        _mockPageRepository
            .Setup(r => r.CreateAsync(It.IsAny<Page>()))
            .ReturnsAsync((Page p) => p);

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Guid id) => new Page
            {
                Id = id,
                TenantId = _tenantId,
                SiteId = _siteId,
                Title = request.Title,
                Slug = "new-page",
                MetaDescription = request.MetaDescription,
                PageData = request.PageData,
                IsPublished = false,
                Components = new List<Component>(),
                CreatedAt = DateTime.UtcNow
            });

        // Act
        var result = await _pageService.CreatePageAsync(request, _userId, _tenantId);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("New Page");
        result.Slug.Should().Be("new-page");
        result.IsPublished.Should().BeFalse();
        _mockPageRepository.Verify(r => r.CreateAsync(It.IsAny<Page>()), Times.Once);
    }

    [Fact]
    public async Task CreatePageAsync_GeneratesUniqueSlug()
    {
        // Arrange
        var request = new CreatePageRequest
        {
            Title = "Test Page",
            SiteId = _siteId
        };

        var site = new Site
        {
            Id = _siteId,
            TenantId = _tenantId,
            UserId = _userId,
            Name = "Test Site",
            SiteData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync(site);

        // First slug exists, second doesn't
        _mockPageRepository
            .SetupSequence(r => r.SlugExistsAsync(It.IsAny<string>(), _siteId, null))
            .ReturnsAsync(true)
            .ReturnsAsync(false);

        _mockPageRepository
            .Setup(r => r.CreateAsync(It.IsAny<Page>()))
            .ReturnsAsync((Page p) => p);

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Guid id) => new Page
            {
                Id = id,
                TenantId = _tenantId,
                SiteId = _siteId,
                Title = request.Title,
                Slug = "test-page-2",
                PageData = "{\"sections\":[]}",
                IsPublished = false,
                Components = new List<Component>(),
                CreatedAt = DateTime.UtcNow
            });

        // Act
        var result = await _pageService.CreatePageAsync(request, _userId, _tenantId);

        // Assert
        result.Should().NotBeNull();
        result.Slug.Should().Be("test-page-2");
        _mockPageRepository.Verify(r => r.SlugExistsAsync(It.IsAny<string>(), _siteId, null), Times.Exactly(2));
    }

    [Fact]
    public async Task CreatePageAsync_SiteNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var request = new CreatePageRequest
        {
            Title = "New Page",
            SiteId = _siteId
        };

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync((Site?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(
            async () => await _pageService.CreatePageAsync(request, _userId, _tenantId)
        );
    }

    [Fact]
    public async Task CreatePageAsync_WrongUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var request = new CreatePageRequest
        {
            Title = "New Page",
            SiteId = _siteId
        };

        var site = new Site
        {
            Id = _siteId,
            TenantId = _tenantId,
            UserId = Guid.NewGuid(), // Different user
            Name = "Test Site",
            SiteData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync(site);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await _pageService.CreatePageAsync(request, _userId, _tenantId)
        );
    }

    [Fact]
    public async Task UpdatePageAsync_ValidData_ReturnsUpdatedPage()
    {
        // Arrange
        var pageId = Guid.NewGuid();
        var request = new UpdatePageRequest
        {
            Title = "Updated Page",
            MetaDescription = "Updated description",
            PageData = "{\"sections\":[{\"id\":\"1\"}]}"
        };

        var page = new Page
        {
            Id = pageId,
            TenantId = _tenantId,
            SiteId = _siteId,
            Title = "Original Page",
            Slug = "original-page",
            PageData = "{}",
            IsPublished = false,
            Components = new List<Component>(),
            CreatedAt = DateTime.UtcNow
        };

        var site = new Site
        {
            Id = _siteId,
            TenantId = _tenantId,
            UserId = _userId,
            Name = "Test Site",
            SiteData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(pageId))
            .ReturnsAsync(page);

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync(site);

        _mockPageRepository
            .Setup(r => r.SlugExistsAsync(It.IsAny<string>(), _siteId, pageId))
            .ReturnsAsync(false);

        _mockPageRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Page>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _pageService.UpdatePageAsync(pageId, request, _userId);

        // Assert
        result.Should().NotBeNull();
        _mockPageRepository.Verify(r => r.UpdateAsync(It.IsAny<Page>()), Times.Once);
    }

    [Fact]
    public async Task UpdatePageAsync_NonExistingId_ThrowsKeyNotFoundException()
    {
        // Arrange
        var pageId = Guid.NewGuid();
        var request = new UpdatePageRequest
        {
            Title = "Updated Page",
            PageData = "{}"
        };

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(pageId))
            .ReturnsAsync((Page?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(
            async () => await _pageService.UpdatePageAsync(pageId, request, _userId)
        );
    }

    [Fact]
    public async Task DeletePageAsync_ValidId_ReturnsTrue()
    {
        // Arrange
        var pageId = Guid.NewGuid();
        var page = new Page
        {
            Id = pageId,
            TenantId = _tenantId,
            SiteId = _siteId,
            Title = "Page to Delete",
            Slug = "page-to-delete",
            PageData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        var site = new Site
        {
            Id = _siteId,
            TenantId = _tenantId,
            UserId = _userId,
            Name = "Test Site",
            SiteData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(pageId))
            .ReturnsAsync(page);

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync(site);

        _mockPageRepository
            .Setup(r => r.DeleteAsync(pageId))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _pageService.DeletePageAsync(pageId, _userId);

        // Assert
        result.Should().BeTrue();
        _mockPageRepository.Verify(r => r.DeleteAsync(pageId), Times.Once);
    }

    [Fact]
    public async Task PublishPageAsync_SetsIsPublishedAndDate()
    {
        // Arrange
        var pageId = Guid.NewGuid();
        var page = new Page
        {
            Id = pageId,
            TenantId = _tenantId,
            SiteId = _siteId,
            Title = "Page to Publish",
            Slug = "page-to-publish",
            PageData = "{}",
            IsPublished = false,
            PublishedAt = null,
            Components = new List<Component>(),
            CreatedAt = DateTime.UtcNow
        };

        var site = new Site
        {
            Id = _siteId,
            TenantId = _tenantId,
            UserId = _userId,
            Name = "Test Site",
            SiteData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(pageId))
            .ReturnsAsync(page);

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync(site);

        _mockPageRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Page>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _pageService.PublishPageAsync(pageId, _userId);

        // Assert
        result.Should().NotBeNull();
        result.IsPublished.Should().BeTrue();
        result.PublishedAt.Should().NotBeNull();
        _mockPageRepository.Verify(r => r.UpdateAsync(It.Is<Page>(p => p.IsPublished && p.PublishedAt.HasValue)), Times.Once);
    }

    [Fact]
    public async Task UnpublishPageAsync_ClearsPublishedState()
    {
        // Arrange
        var pageId = Guid.NewGuid();
        var page = new Page
        {
            Id = pageId,
            TenantId = _tenantId,
            SiteId = _siteId,
            Title = "Page to Unpublish",
            Slug = "page-to-unpublish",
            PageData = "{}",
            IsPublished = true,
            PublishedAt = DateTime.UtcNow,
            Components = new List<Component>(),
            CreatedAt = DateTime.UtcNow
        };

        var site = new Site
        {
            Id = _siteId,
            TenantId = _tenantId,
            UserId = _userId,
            Name = "Test Site",
            SiteData = "{}",
            CreatedAt = DateTime.UtcNow
        };

        _mockPageRepository
            .Setup(r => r.GetByIdAsync(pageId))
            .ReturnsAsync(page);

        _mockSiteRepository
            .Setup(r => r.GetByIdAsync(_siteId))
            .ReturnsAsync(site);

        _mockPageRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Page>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _pageService.UnpublishPageAsync(pageId, _userId);

        // Assert
        result.Should().NotBeNull();
        result.IsPublished.Should().BeFalse();
        result.PublishedAt.Should().BeNull();
        _mockPageRepository.Verify(r => r.UpdateAsync(It.Is<Page>(p => !p.IsPublished && !p.PublishedAt.HasValue)), Times.Once);
    }
}
