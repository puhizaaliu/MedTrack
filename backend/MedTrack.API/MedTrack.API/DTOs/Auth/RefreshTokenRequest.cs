using System.ComponentModel.DataAnnotations;

namespace MedTrack.API.Dtos.Auth
{
    public class RefreshTokenRequest
    {
        [Required]
    public string AccessToken { get; set; } = null!;    // <-- the JWT
    [Required]
    public string RefreshToken { get; set; } = null!;   // <-- the random string
    }
}
