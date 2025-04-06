using AuthServer.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AuthServer.Services
{
    public interface IAuthService
    {
        Task<(AuthResponseDto Response, string? Token)> LoginAsync(LoginRequestDto loginDto);
        Task<bool> ValidateUserAsync(ValidateRequestDto validateDto);
        Task<bool> VerifyTokenAsync();
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
        Task LogoutAsync();
        Task<bool> IsAuthenticatedAsync();
    }
} 