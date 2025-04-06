using AuthServer.Models;

namespace AuthServer.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(User user);
        RefreshToken GenerateRefreshToken(int userId);
        Task RevokeRefreshTokenAsync(string token);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
        Task SaveRefreshTokenAsync(RefreshToken refreshToken);
        bool ValidateToken(string token);
    }
} 