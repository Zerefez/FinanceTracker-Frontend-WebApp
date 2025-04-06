using FinanceTracker.DataAccess;
using FinanceTracker.DTO;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace FinanceTracker.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly FinanceTrackerContext _context;
        private readonly ILogger<AccountController> _logger;
        private readonly IConfiguration _configuration;
        private readonly UserManager<FinanceUser> _userManager;
        private readonly SignInManager<FinanceUser> _signInManager;
        private readonly string _csrfTokenHeader = "X-CSRF-Token";
        private readonly int _tokenExpiryMinutes = 15;

        public AccountController(FinanceTrackerContext context, ILogger<AccountController> logger,
            IConfiguration configuration, UserManager<FinanceUser> userManager,
            SignInManager<FinanceUser> signInManager)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<ActionResult> Register(RegisterDTO input)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var newUser = new FinanceUser();
                    newUser.UserName = input.Email;
                    newUser.Email = input.Email;
                    var result = await _userManager.CreateAsync(
                    newUser, input.Password);
                    if (result.Succeeded)
                    {
                        _logger.LogInformation(
                        "User {userName} ({email}) has been created.",
                        newUser.UserName, newUser.Email);
                        return StatusCode(201,
                        $"User '{newUser.UserName}' has been created.");
                    }
                    else
                        throw new Exception(
                        string.Format("Error: {0}", string.Join(" ",
                        result.Errors.Select(e => e.Description))));
                }
                else
                {
                    var details = new ValidationProblemDetails(ModelState);
                    details.Type =
                    "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                    details.Status = StatusCodes.Status400BadRequest;
                    return new BadRequestObjectResult(details);
                }
            }
            catch (Exception e)
            {
                var exceptionDetails = new ProblemDetails();
                exceptionDetails.Detail = e.Message;
                exceptionDetails.Status =
                StatusCodes.Status500InternalServerError;
                exceptionDetails.Type =
                "https://tools.ietf.org/html/rfc7231#section-6.6.1";
                return StatusCode(
                StatusCodes.Status500InternalServerError,
                exceptionDetails);
            }
        }

        [HttpPost("login")]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<ActionResult> Login(LoginDTO input)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByNameAsync(input.Username);
                    if (user == null || !await _userManager.CheckPasswordAsync(user, input.Password))
                        throw new Exception("Invalid login attempt.");
                    
                    // Generate JWT token
                    var token = GenerateJwtToken(user);
                    
                    // Generate CSRF token
                    var csrfToken = Guid.NewGuid().ToString();
                    
                    // Set the JWT token in an HTTP-only cookie
                    SetAuthCookie(token);
                    
                    // Set CSRF token in response header
                    Response.Headers.Add(_csrfTokenHeader, csrfToken);
                    
                    var userData = new
                    {
                        id = user.Id,
                        email = user.Email,
                        name = user.UserName
                    };

                    return Ok(new { user = userData, success = true });
                }
                else
                {
                    var details = new ValidationProblemDetails(ModelState);
                    details.Type =
                    "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                    details.Status = StatusCodes.Status400BadRequest;
                    return new BadRequestObjectResult(details);
                }
            }
            catch (Exception e)
            {
                var exceptionDetails = new ProblemDetails();
                exceptionDetails.Detail = e.Message;
                exceptionDetails.Status =
                StatusCodes.Status401Unauthorized;
                exceptionDetails.Type =
                "https://tools.ietf.org/html/rfc7231#section-6.6.1";
                return StatusCode(
                    StatusCodes.Status401Unauthorized, exceptionDetails);
            }
        }

        [HttpPost("validate")]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<ActionResult> ValidateUser([FromBody] ValidateUserDTO input)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(input.Email);
                return Ok(new { success = user != null });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error validating user");
                return Ok(new { success = false });
            }
        }

        [HttpPost("logout")]
        [ResponseCache(CacheProfileName = "NoCache")]
        public ActionResult Logout()
        {
            // Clear the auth cookie
            Response.Cookies.Delete("auth-token");
            return Ok(new { success = true });
        }

        [HttpGet("verify")]
        [ResponseCache(CacheProfileName = "NoCache")]
        public ActionResult VerifyToken()
        {
            try
            {
                // Get the token from the cookie
                if (!Request.Cookies.TryGetValue("auth-token", out var token))
                {
                    return Unauthorized();
                }

                // Validate the token
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JWT:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"])),
                    ValidateLifetime = true
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

                // Success - token is valid
                return Ok();
            }
            catch
            {
                return Unauthorized();
            }
        }

        [HttpPost("refresh")]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<ActionResult> RefreshToken()
        {
            try
            {
                // Get the token from the cookie
                if (!Request.Cookies.TryGetValue("auth-token", out var token))
                {
                    return Unauthorized();
                }

                // Validate the token (but ignore expiration)
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JWT:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"])),
                    ValidateLifetime = false // Don't validate lifetime for refresh
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

                // Extract user info from the token
                var username = principal.Identity.Name;
                var user = await _userManager.FindByNameAsync(username);

                if (user == null)
                {
                    return Unauthorized();
                }

                // Generate a new token
                var newToken = GenerateJwtToken(user);
                
                // Generate new CSRF token
                var csrfToken = Guid.NewGuid().ToString();
                
                // Set the new token in the cookie
                SetAuthCookie(newToken);
                
                // Set new CSRF token in response header
                Response.Headers.Add(_csrfTokenHeader, csrfToken);

                return Ok();
            }
            catch
            {
                return Unauthorized();
            }
        }

        #region Private Helper Methods
        private string GenerateJwtToken(FinanceUser user)
        {
            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"])),
                SecurityAlgorithms.HmacSha256);
            
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email)
            };
            
            var jwtObject = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(_tokenExpiryMinutes),
                signingCredentials: signingCredentials);
            
            return new JwtSecurityTokenHandler().WriteToken(jwtObject);
        }

        private void SetAuthCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // For HTTPS
                SameSite = SameSiteMode.None, // Changed from Strict to None for cross-site requests
                Expires = DateTime.Now.AddMinutes(_tokenExpiryMinutes)
            };
            
            Response.Cookies.Append("auth-token", token, cookieOptions);
        }
        #endregion
    }
}
