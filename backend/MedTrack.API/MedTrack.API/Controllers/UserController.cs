using MedTrack.API.Attributes;
using MedTrack.API.DTOs.User;
using MedTrack.API.Services.Interfaces;
using MedTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/User
        [HttpGet]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // GET: api/User/by-email?email=example@example.com
        [HttpGet("by-email")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO createUserDto)
        {
            await _userService.AddUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUserByEmail), new { email = createUserDto.Email }, createUserDto);
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO updateUserDto)
        {
            try
            {
                await _userService.UpdateUserAsync(id, updateUserDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
