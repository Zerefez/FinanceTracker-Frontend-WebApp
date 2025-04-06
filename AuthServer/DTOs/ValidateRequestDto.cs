using System.ComponentModel.DataAnnotations;

namespace AuthServer.DTOs
{
    public class ValidateRequestDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }
} 