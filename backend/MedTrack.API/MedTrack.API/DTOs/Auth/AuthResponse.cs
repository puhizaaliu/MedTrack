namespace MedTrack.API.Dtos.Auth
{
    public class AuthResponse
    {
        public string AccessToken { get; set; } = null!;
        public DateTime AccessTokenExpires { get; set; }
        public string RefreshToken { get; set; } = null!;
        // Opsional: User info
        public int UserId { get; set; }
        public string Role { get; set; } = null!;
    }
}
