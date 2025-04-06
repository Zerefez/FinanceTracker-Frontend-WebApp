namespace AuthServer.DTOs
{
    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public UserDto? User { get; set; }
        public string? Error { get; set; }
    }
} 