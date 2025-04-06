using System.ComponentModel.DataAnnotations;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Controllers;

namespace FinanceTracker.DTO
{
    public class RegisterDTO
    {
        [Required] public string? FullName { get; set; }
        [Required][EmailAddress] public string? Email { get; set; }
        [Required] public string? Password { get; set; }

    }
}
