using AuthServer.DTOs;
using AuthServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthServer.Controllers
{
    /// <summary>
    /// Authentication API controller for managing user authentication
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        /// <summary>
        /// Authenticates a user with their email and password
        /// </summary>
        /// <param name="loginDto">Login credentials</param>
        /// <returns>User information and sets auth cookie if successful</returns>
        /// <response code="200">Returns the user data when login is successful</response>
        /// <response code="401">If the credentials are invalid</response>
        /// <response code="400">If the request is invalid</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        [ProducesResponseType(typeof(AuthResponseDto), 401)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var (response, refreshToken) = await _authService.LoginAsync(loginDto);
            
            if (!response.Success)
            {
                return Unauthorized(response);
            }
            
            return Ok(response);
        }
        
        /// <summary>
        /// Validates if a user exists in the database
        /// </summary>
        /// <param name="validateDto">The email to validate</param>
        /// <returns>Success status indicating if the user exists</returns>
        /// <response code="200">Returns success status</response>
        /// <response code="400">If the request is invalid</response>
        [HttpPost("validate")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Validate([FromBody] ValidateRequestDto validateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var isValid = await _authService.ValidateUserAsync(validateDto);
            
            return Ok(new { success = isValid });
        }
        
        /// <summary>
        /// Verifies if the current authentication token is valid
        /// </summary>
        /// <returns>Success status indicating if the token is valid</returns>
        /// <response code="200">Returns success status</response>
        [HttpGet("verify")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> Verify()
        {
            var isValid = await _authService.VerifyTokenAsync();
            
            return Ok(new { success = isValid });
        }
        
        /// <summary>
        /// Refreshes an expired authentication token
        /// </summary>
        /// <param name="refreshToken">The refresh token to use</param>
        /// <returns>New auth token via cookie and user information</returns>
        /// <response code="200">Returns user data and sets new auth cookie</response>
        /// <response code="401">If the refresh token is invalid</response>
        /// <response code="400">If the refresh token is missing</response>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        [ProducesResponseType(typeof(AuthResponseDto), 401)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Refresh([FromBody] string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest(new { message = "Refresh token is required" });
            }
            
            var response = await _authService.RefreshTokenAsync(refreshToken);
            
            if (!response.Success)
            {
                return Unauthorized(response);
            }
            
            return Ok(response);
        }
        
        /// <summary>
        /// Logs out the current user
        /// </summary>
        /// <returns>Success status</returns>
        /// <response code="200">Always returns success</response>
        [HttpPost("logout")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> Logout()
        {
            await _authService.LogoutAsync();
            
            return Ok(new { success = true, message = "Logged out successfully" });
        }
        
        /// <summary>
        /// Checks if the user is authenticated (protected endpoint)
        /// </summary>
        /// <returns>Authentication status</returns>
        /// <response code="200">Returns authenticated status if token is valid</response>
        /// <response code="401">If not authenticated or token is invalid</response>
        [Authorize]
        [HttpGet("check")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CheckAuth()
        {
            return Ok(new { isAuthenticated = true });
        }
    }
} 