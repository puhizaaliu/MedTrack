using MedTrack.API.Attributes;
using MedTrack.API.DTOs.Patient;
using MedTrack.API.DTOs.User;
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
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin, UserRole.Doctor)]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> GetAllPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        // GET: api/Patient/{id}
        [HttpGet("{id}")]
        [Authorize] 
        public async Task<ActionResult<PatientDTO>> GetPatientById(int id)
        {
            var userRole = User.FindFirst("role")?.Value;
            var userId = User.FindFirst("sub")?.Value; 

            // Lejo vetëm:
            if (userRole == UserRole.Patient.ToString() && userId != id.ToString())
            {
                // Pacientët mund të marrin vetëm të dhënat e tyre
                return Forbid();
            }
            // (admin/receptionist mund të marrin këdo)
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
                return NotFound();

            return Ok(patient);
        }


        // POST: api/Patient?userId=1
        [HttpPost]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> AddPatient([FromBody] CreatePatientDTO dto)
        {
            await _patientService.AddPatientAsync(dto);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/Patient/{id}
        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] UpdatePatientDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _patientService.UpdatePatientAsync(id, dto);
            return NoContent();
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
