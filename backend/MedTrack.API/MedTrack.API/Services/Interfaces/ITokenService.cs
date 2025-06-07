using MedTrack.API.Models;
using System.Security.Claims;

namespace MedTrack.API.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        RefreshToken GenerateRefreshToken(int userId);
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
