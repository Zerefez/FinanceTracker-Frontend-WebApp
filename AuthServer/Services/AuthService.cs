using AuthServer.DTOs;
using AuthServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

namespace AuthServer.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AuthService> _logger;
        private readonly IOptions<JwtSettings> _jwtSettings;
        
        public AuthService(
            IUserService userService, 
            ITokenService tokenService,
            IHttpContextAccessor httpContextAccessor,
            ILogger<AuthService> logger,
            IOptions<JwtSettings> jwtSettings)
        {
            _userService = userService;
            _tokenService = tokenService;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _jwtSettings = jwtSettings;
        }
        
        public async Task<(AuthResponseDto Response, string? Token)> LoginAsync(LoginRequestDto loginDto)
        {
            var response = new AuthResponseDto();
            
            try
            {
                // Validate credentials
                var isValid = await _userService.ValidateCredentialsAsync(loginDto.Email, loginDto.Password);
                if (!isValid)
                {
                    response.Success = false;
                    response.Error = "Invalid email or password";
                    return (response, null);
                }
                
                // Get user
                var user = await _userService.GetByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    response.Success = false;
                    response.Error = "User not found";
                    return (response, null);
                }
                
                // Update last login
                await _userService.UpdateLastLoginAsync(user);
                
                // Generate JWT token
                var token = _tokenService.GenerateJwtToken(user);
                
                // Generate refresh token
                var refreshToken = _tokenService.GenerateRefreshToken(user.Id);
                
                // Save refresh token
                await _tokenService.SaveRefreshTokenAsync(refreshToken);
                
                // Set HttpOnly cookie with JWT token
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Set to true in production with HTTPS
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.Value.TokenExpirationMinutes)
                };
                
                _httpContextAccessor.HttpContext?.Response.Cookies.Append("auth-token", token, cookieOptions);
                
                // Set CSRF token header for security
                _httpContextAccessor.HttpContext?.Response.Headers.Append("X-CSRF-Token", Guid.NewGuid().ToString());
                
                // Return successful response with user info
                response.Success = true;
                response.User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    LastLoginAt = user.LastLoginAt
                };
                
                return (response, refreshToken.Token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login");
                response.Success = false;
                response.Error = "An error occurred during login";
                return (response, null);
            }
        }
        
        public async Task<bool> ValidateUserAsync(ValidateRequestDto validateDto)
        {
            try
            {
                return await _userService.ValidateUserExistsAsync(validateDto.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating user");
                return false;
            }
        }
        
        public async Task<bool> VerifyTokenAsync()
        {
            try
            {
                var token = _httpContextAccessor.HttpContext?.Request.Cookies["auth-token"];
                if (string.IsNullOrEmpty(token))
                {
                    return false;
                }
                
                return _tokenService.ValidateToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying token");
                return false;
            }
        }
        
        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            var response = new AuthResponseDto();
            
            try
            {
                var token = await _tokenService.GetRefreshTokenAsync(refreshToken);
                if (token == null || !token.IsActive)
                {
                    response.Success = false;
                    response.Error = "Invalid refresh token";
                    return response;
                }
                
                var user = token.User;
                if (user == null)
                {
                    response.Success = false;
                    response.Error = "User not found";
                    return response;
                }
                
                // Revoke the current refresh token
                await _tokenService.RevokeRefreshTokenAsync(refreshToken);
                
                // Generate a new JWT token
                var newJwtToken = _tokenService.GenerateJwtToken(user);
                
                // Generate a new refresh token
                var newRefreshToken = _tokenService.GenerateRefreshToken(user.Id);
                
                // Save the new refresh token
                await _tokenService.SaveRefreshTokenAsync(newRefreshToken);
                
                // Set HttpOnly cookie with the new JWT token
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.Value.TokenExpirationMinutes)
                };
                
                _httpContextAccessor.HttpContext?.Response.Cookies.Append("auth-token", newJwtToken, cookieOptions);
                
                // Set CSRF token header
                _httpContextAccessor.HttpContext?.Response.Headers.Append("X-CSRF-Token", Guid.NewGuid().ToString());
                
                // Return successful response
                response.Success = true;
                response.User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    LastLoginAt = user.LastLoginAt
                };
                
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                response.Success = false;
                response.Error = "An error occurred while refreshing the token";
                return response;
            }
        }
        
        public async Task LogoutAsync()
        {
            try
            {
                // Remove auth cookie
                _httpContextAccessor.HttpContext?.Response.Cookies.Delete("auth-token");
                
                // Remove CSRF cookie
                _httpContextAccessor.HttpContext?.Response.Cookies.Delete("CSRF-TOKEN");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                throw;
            }
        }
        
        public async Task<bool> IsAuthenticatedAsync()
        {
            return await VerifyTokenAsync();
        }
    }
} 