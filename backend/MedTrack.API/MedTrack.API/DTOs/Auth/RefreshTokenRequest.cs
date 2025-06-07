using System.ComponentModel.DataAnnotations;

namespace MedTrack.API.Dtos.Auth
{
    public class RefreshTokenRequest
    {
        [Required]
        public string Token { get; set; } = null!;
    }
}
