using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.DTO
{
    public class DomainDTO
    {
        [Required]
        public int Id { get; set; }

        public string? Name { get; set; }
    }
}
