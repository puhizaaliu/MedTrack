using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationController : ControllerBase
    {
        private readonly ISpecializationService _specializationService;

        public SpecializationController(ISpecializationService specializationService)
        {
            _specializationService = specializationService;
        }

        // GET: api/Specialization
        [HttpGet]
        public async Task<IActionResult> GetAllSpecializations()
        {
            var specializations = await _specializationService.GetAllSpecializationsAsync();
            return Ok(specializations);
        }

        // GET: api/Specialization/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecializationById(int id)
        {
            var specialization = await _specializationService.GetSpecializationByIdAsync(id);
            if (specialization == null)
                return NotFound();

            return Ok(specialization);
        }

        // POST: api/Specialization
        [HttpPost]
        public async Task<IActionResult> CreateSpecialization([FromBody] SpecializationDTO specializationDto)
        {
            await _specializationService.AddSpecializationAsync(specializationDto);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/Specialization/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSpecialization(int id, [FromBody] SpecializationDTO specializationDto)
        {
            try
            {
                await _specializationService.UpdateSpecializationAsync(id, specializationDto);
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/Specialization/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecialization(int id)
        {
            await _specializationService.DeleteSpecializationAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
