using System.Collections.Generic;
using System.Threading.Tasks;
using MedTrack.API.DTOs.Notification;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using MedTrack.API.Attributes;
using MedTrack.API.DTOs.MedicalReport;
using MedTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [AuthorizeRoles(UserRole.Admin)]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationsController(INotificationService service)
        {
            _service = service;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notifications = await _service.GetAllAsync();
            return Ok(notifications);
        }

        // GET: api/Notifications/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
                return NotFound();
            return Ok(dto);
        }

        // GET: api/Notifications/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var list = await _service.GetByUserIdAsync(userId);
            return Ok(list);
        }

        // POST: api/Notifications
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNotificationDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newId = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newId }, null);
        }

        // PUT: api/Notifications/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateNotificationDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _service.UpdateAsync(id, dto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // DELETE: api/Notifications/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
