using System.Security.Cryptography;
using System.Text;

namespace AuthServer.Models
{
    public class DataSeeder
    {
        private readonly AppDbContext _context;
        
        public DataSeeder(AppDbContext context)
        {
            _context = context;
        }
        
        public void SeedData()
        {
            if (!_context.Users.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        Email = "test@example.com",
                        PasswordHash = HashPassword("password123"),
                        Name = "Test User"
                    },
                    new User
                    {
                        Email = "admin@example.com",
                        PasswordHash = HashPassword("admin123"),
                        Name = "Admin User"
                    }
                };
                
                _context.Users.AddRange(users);
                _context.SaveChanges();
            }
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