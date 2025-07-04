﻿using MedTrack.API.Attributes;
using MedTrack.API.DTOs.MedicalReport;
using MedTrack.API.DTOs.Notification;
using MedTrack.API.Models;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationsController(INotificationService service)
        {
            _service = service;
        }

        // GET: api/Notifications
        [AuthorizeRoles(UserRole.Admin)]
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
            // 1. Grab the claim
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim == null)
                return Unauthorized("Missing user-id claim");
            // 2. Parse it
            if (!int.TryParse(idClaim.Value, out var currentId))
                return BadRequest("Invalid user-id claim format");
            // 3. Only allow if Admin or requesting your own notifications
            if (!User.IsInRole(UserRole.Admin.ToString()) && currentId != userId)
                return Forbid();
            // 4. Fetch and return
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
