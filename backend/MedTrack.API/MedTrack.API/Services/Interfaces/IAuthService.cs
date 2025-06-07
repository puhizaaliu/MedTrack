using MedTrack.API.Dtos.Auth;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest dto);
        Task<AuthResponse> LoginAsync(AuthRequest dto);
        Task<AuthResponse> RefreshAsync(RefreshTokenRequest dto);
        Task LogoutAsync(RefreshTokenRequest dto);
    }
}
