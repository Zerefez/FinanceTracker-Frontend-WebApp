using AuthServer.Models;

namespace AuthServer.Services
{
    public interface IUserService
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<bool> ValidateUserExistsAsync(string email);
        Task<bool> ValidateCredentialsAsync(string email, string password);
        Task UpdateLastLoginAsync(User user);
    }
} 