using System.Security.Cryptography;
using System.Text;
using AuthServer.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        
        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<bool> ValidateUserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> ValidateCredentialsAsync(string email, string password)
        {
            var user = await GetByEmailAsync(email);
            if (user == null)
            {
                return false;
            }

            var passwordHash = HashPassword(password);
            return user.PasswordHash == passwordHash;
        }

        public async Task UpdateLastLoginAsync(User user)
        {
            user.LastLoginAt = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        private string HashPassword(string password)
        {
            // This is a simple hash for demo purposes only
            // In a real application, use a proper password hasher like BCrypt
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
} 