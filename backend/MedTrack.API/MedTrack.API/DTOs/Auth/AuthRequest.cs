using System.ComponentModel.DataAnnotations;

namespace MedTrack.API.Dtos.Auth
{
    public class AuthRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
