using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // GET: api/Patient
        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            // Ky endpoint tash do të kthejë pacientët me të gjitha të dhënat:
            // Name, Surname, Phone, Email, Address, DateOfBirth, Gender
            // MedicalInfo dhe FamilyHistory të mbushura nga mapping profile
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        // GET: api/Patient/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            // Edhe ky endpoint e kthen pacientin me MedicalInfo dhe FamilyHistory
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
                return NotFound();

            return Ok(patient);
        }

        // POST: api/Patient?userId=1
        [HttpPost]
        public async Task<IActionResult> AddPatient([FromQuery] int userId)
        {
            // Krijon një rresht të ri te tabela 'patients' për user-in ekzistues
            await _patientService.AddPatientAsync(userId);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/Patient/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id)
        {
            // Tabela 'patients' s'ka shume fusha – kjo metodë mbetet bosh zakonisht
            await _patientService.UpdatePatientAsync(id);
            return NoContent(); // 204 No Content
        }

        // DELETE: api/Patient/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            await _patientService.DeletePatientAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
