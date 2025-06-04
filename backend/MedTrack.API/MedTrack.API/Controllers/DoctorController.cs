using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        // GET: api/Doctor
        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _doctorService.GetAllDoctorsAsync();
            return Ok(doctors);
        }

        // GET: api/Doctor/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null)
                return NotFound();

            return Ok(doctor);
        }

        // GET: api/Doctor/by-specialization/{specializationId}
        [HttpGet("by-specialization/{specializationId}")]
        public async Task<IActionResult> GetDoctorsBySpecializationId(int specializationId)
        {
            var doctors = await _doctorService.GetDoctorsBySpecializationIdAsync(specializationId);
            return Ok(doctors);
        }

        // POST: api/Doctor
        [HttpPost]
        public async Task<IActionResult> AddDoctor([FromQuery] int userId, [FromQuery] int specializationId)
        {
            await _doctorService.AddDoctorAsync(userId, specializationId);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/Doctor/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] UpdateDoctorDTO updateDoctorDto)
        {
            try
            {
                await _doctorService.UpdateDoctorAsync(id, updateDoctorDto);
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/Doctor/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            await _doctorService.DeleteDoctorAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
