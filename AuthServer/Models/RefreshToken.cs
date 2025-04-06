namespace AuthServer.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public required string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ReplacedByToken { get; set; }
        public DateTime? RevokedAt { get; set; }
        
        // Foreign key for user
        public int UserId { get; set; }
        public User? User { get; set; }
        
        public bool IsExpired => DateTime.UtcNow >= ExpiryDate;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
} 