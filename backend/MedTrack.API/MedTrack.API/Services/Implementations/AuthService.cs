using System.IdentityModel.Tokens.Jwt;
using MedTrack.API.Data;
using MedTrack.API.Dtos.Auth;
using MedTrack.API.Models;
using MedTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext db, ITokenService tokenService, IConfiguration config)
        {
            _db = db;
            _tokenService = tokenService;
            _config = config;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                throw new InvalidOperationException("Email already in use.");

            var user = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                ParentName = dto.ParentName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                PersonalNumber = dto.PersonalNumber,
                Address = dto.Address,
                Phone = dto.Phone,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.Patient
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken(user.UserId);
            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            var jwtSection = _config.GetSection("Jwt");
            var accessExpiryMinutes = double.Parse(jwtSection["AccessTokenExpiryMinutes"]!);

            return new AuthResponse
            {
                AccessToken = accessToken,
                AccessTokenExpires = DateTime.UtcNow.AddMinutes(accessExpiryMinutes),
                RefreshToken = refreshToken.Token,
                UserId = user.UserId,
                Role = user.Role.ToString()
            };
        }

        public async Task<AuthResponse> LoginAsync(AuthRequest dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new InvalidOperationException("Invalid credentials.");

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken(user.UserId);
            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            var jwtSection = _config.GetSection("Jwt");
            var accessExpiryMinutes = double.Parse(jwtSection["AccessTokenExpiryMinutes"]!);

            return new AuthResponse
            {
                AccessToken = accessToken,
                AccessTokenExpires = DateTime.UtcNow.AddMinutes(accessExpiryMinutes),
                RefreshToken = refreshToken.Token,
                UserId = user.UserId,
                Role = user.Role.ToString()
            };
        }

        public async Task<AuthResponse> RefreshAsync(RefreshTokenRequest dto)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(dto.AccessToken);
            if (principal == null)
                throw new InvalidOperationException("Invalid access token. No claims principal could be parsed.");

            // Try to find user id in both common claim types
            var subClaim = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                        ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(subClaim))
                throw new InvalidOperationException("Access token does not contain user id ('sub' or 'nameidentifier') claim.");

            var userId = int.Parse(subClaim);

            var savedToken = await _db.RefreshTokens.SingleOrDefaultAsync(rt => rt.Token == dto.RefreshToken && rt.UserId == userId);

            if (savedToken == null || savedToken.Expires <= DateTime.UtcNow || savedToken.Revoked != null)
                throw new InvalidOperationException("Invalid refresh token.");

            savedToken.Revoked = DateTime.UtcNow;
            var newRefreshToken = _tokenService.GenerateRefreshToken(userId);
            _db.RefreshTokens.Add(newRefreshToken);
            await _db.SaveChangesAsync();

            var user = await _db.Users.FindAsync(userId)!;
            var newAccessToken = _tokenService.GenerateAccessToken(user);

            var jwtSection = _config.GetSection("Jwt");
            var accessExpiryMinutes = double.Parse(jwtSection["AccessTokenExpiryMinutes"]!);

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                AccessTokenExpires = DateTime.UtcNow.AddMinutes(accessExpiryMinutes),
                RefreshToken = newRefreshToken.Token,
                UserId = userId,
                Role = user.Role.ToString()
            };
        }


        public async Task LogoutAsync(RefreshTokenRequest dto)
        {
            var savedToken = await _db.RefreshTokens.SingleOrDefaultAsync(rt => rt.Token == dto.RefreshToken);
            if (savedToken != null)
            {
                savedToken.Revoked = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
        }
    }
}
