namespace AuthServer.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
} 