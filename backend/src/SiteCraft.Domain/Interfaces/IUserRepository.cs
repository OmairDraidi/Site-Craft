using SiteCraft.Domain.Entities;

namespace SiteCraft.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, Guid tenantId);
    Task<User?> GetByIdAsync(Guid id);
    Task<User> CreateAsync(User user);
    Task UpdateAsync(User user);
    Task<bool> EmailExistsAsync(string email, Guid tenantId);
}
