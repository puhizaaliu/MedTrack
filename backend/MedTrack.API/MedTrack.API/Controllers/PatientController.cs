using MedTrack.API.Attributes;
using MedTrack.API.DTOs.Patient;
using MedTrack.API.Models;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // GET: api/Patient
        [HttpGet]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin)]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> GetAllPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        // GET: api/Patient/{id}
        [HttpGet("{id}")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin)]
        public async Task<ActionResult<PatientDTO>> GetPatientById(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
                return NotFound();

            return Ok(patient);
        }

        // POST: api/Patient?userId=1
        [HttpPost]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> AddPatient([FromQuery] int userId)
        {
            await _patientService.AddPatientAsync(userId);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/Patient/{id}
        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> UpdatePatient(int id)
        {
            await _patientService.UpdatePatientAsync(id);
            return NoContent(); // 204 No Content
        }

        // DELETE: api/Patient/{id}
        [HttpDelete("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> DeletePatient(int id)
        {
            await _patientService.DeletePatientAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
