using System.ComponentModel.DataAnnotations;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Controllers;

namespace FinanceTracker.DTO
{
    public class LoginDTO
    {
        [Required] public string? Username { get; set; }
        [Required] public string? Password { get; set; }

    }
}
