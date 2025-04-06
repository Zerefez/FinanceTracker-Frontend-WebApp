using System.ComponentModel.DataAnnotations;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Controllers;

namespace FinanceTracker.DTO
{
    public class ValidateUserDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
} 