using MedTrack.API.Dtos.Auth;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest dto)
        {
            var response = await _authService.RegisterAsync(dto);
            return CreatedAtAction(nameof(Register), response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest dto)
        {
            var response = await _authService.LoginAsync(dto);
            return Ok(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest dto)
        {
            var response = await _authService.RefreshAsync(dto);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest dto)
        {
            await _authService.LogoutAsync(dto);
            return NoContent();
        }
    }
}
