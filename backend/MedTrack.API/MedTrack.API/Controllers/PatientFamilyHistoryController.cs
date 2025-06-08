using MedTrack.API.Attributes;
using MedTrack.API.DTOs.PatientFamilyHistory;
using MedTrack.API.Models;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [AuthorizeRoles(UserRole.Patient, UserRole.Doctor, UserRole.Admin)]
    public class PatientFamilyHistoryController : ControllerBase
    {
        private readonly IPatientFamilyHistoryService _service;

        public PatientFamilyHistoryController(IPatientFamilyHistoryService service)
        {
            _service = service;
        }

        // GET: api/PatientFamilyHistory/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatientId(int patientId)
        {
            var histories = await _service.GetByPatientIdAsync(patientId);
            return Ok(histories);
        }

        // POST: api/PatientFamilyHistory
        [HttpPost]
        [AuthorizeRoles(UserRole.Doctor, UserRole.Admin)]
        public async Task<IActionResult> AddPatientFamilyHistory([FromBody] CreatePatientFamilyHistoryDTO dto)
        {
            await _service.AddAsync(dto);
            return StatusCode(201); // 201 Created
        }

        // DELETE: api/PatientFamilyHistory?patientId=5&historyId=3
        [HttpDelete]
        [AuthorizeRoles(UserRole.Doctor, UserRole.Admin)]
        public async Task<IActionResult> RemovePatientFamilyHistory([FromQuery] int patientId, [FromQuery] int historyId)
        {
            await _service.RemoveAsync(patientId, historyId);
            return NoContent(); // 204 No Content
        }
    }
}
