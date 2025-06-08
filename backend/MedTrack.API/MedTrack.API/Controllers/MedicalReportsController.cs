using MedTrack.API.Attributes;
using MedTrack.API.DTOs.MedicalReport;
using MedTrack.API.Services.Interfaces;
using MedTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Collections.Generic;
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
        [AuthorizeRoles(UserRole.Patient)]
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
            // Validate that id is a valid MongoDB ObjectId
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid id format; must be a 24-character hex string.");

            var reportDto = await _service.GetByIdAsync(id);
            if (reportDto == null)
                return NotFound();
            return Ok(reportDto);
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
