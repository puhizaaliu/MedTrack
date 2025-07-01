using MedTrack.API.Attributes;
using MedTrack.API.DTOs.MedicalReport;
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
    public class MedicalReportsController : ControllerBase
    {
        private readonly IMedicalReportService _service;

        public MedicalReportsController(IMedicalReportService service)
        {
            _service = service;
        }

        // GET: api/MedicalReports
        [HttpGet]
        [AuthorizeRoles(UserRole.Patient, UserRole.Doctor, UserRole.Admin)]
        public async Task<IActionResult> GetAll()
        {
            var reports = await _service.GetAllAsync();
            return Ok(reports);
        }

        // GET: api/MedicalReports/{id}
        [HttpGet("{id}")]
        [AuthorizeRoles(UserRole.Patient, UserRole.Doctor, UserRole.Admin)]
        public async Task<IActionResult> GetById(string id)
        {
            // 1) Validate that id is a proper Mongo ObjectId
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid id format; must be a 24-character hex string.");

            // 2) Fetch the detailed DTO (report + appointment + patient + doctor)
            var detailDto = await _service.GetByIdAsync(id);
            if (detailDto == null)
                return NotFound();

            // 3) Extract current user's ID from their JWT claim
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (idClaim == null || !int.TryParse(idClaim, out var currentUserId))
                return Unauthorized("Invalid user credentials.");

            // 4) Enforce ownership if not Admin
            if (!User.IsInRole(UserRole.Admin.ToString()))
            {
                // Patients only see their own reports
                if (User.IsInRole(UserRole.Patient.ToString())
                    && detailDto.Patient.UserId != currentUserId)
                {
                    return Forbid();
                }

                // Doctors only see reports they authored
                if (User.IsInRole(UserRole.Doctor.ToString())
                    && detailDto.Doctor.UserId != currentUserId)
                {
                    return Forbid();
                }
            }

            // 5) Return full detail
            return Ok(detailDto);
        }

        // POST: api/MedicalReports
        [HttpPost]
        [AuthorizeRoles(UserRole.Doctor)]
        public async Task<IActionResult> Create([FromBody] CreateMedicalReportDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newId = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newId }, null);
        }

        // PUT: api/MedicalReports/{id}
        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.Doctor)]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateMedicalReportDto dto)
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

        // DELETE: api/MedicalReports/{id}
        [HttpDelete("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> Delete(string id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
