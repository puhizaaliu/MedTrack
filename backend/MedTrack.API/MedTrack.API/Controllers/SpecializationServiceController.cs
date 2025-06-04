using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecializationServiceController : ControllerBase
    {
        private readonly ISpecializationServiceService _service;

        public SpecializationServiceController(ISpecializationServiceService service)
        {
            _service = service;
        }

        // GET: api/SpecializationService/{specializationId}
        [HttpGet("{specializationId}")]
        public async Task<IActionResult> GetServicesBySpecialization(int specializationId)
        {
            var servicesDto = await _service.GetServicesBySpecializationAsync(specializationId);
            return Ok(servicesDto);
        }

        // POST: api/SpecializationService
        [HttpPost]
        public async Task<IActionResult> AddServiceToSpecialization([FromQuery] int specializationId, [FromQuery] int serviceId)
        {
            await _service.AddServiceToSpecializationAsync(specializationId, serviceId);
            return StatusCode(201); // 201 Created
        }

        // DELETE: api/SpecializationService
        [HttpDelete]
        public async Task<IActionResult> RemoveServiceFromSpecialization([FromQuery] int specializationId, [FromQuery] int serviceId)
        {
            await _service.RemoveServiceFromSpecializationAsync(specializationId, serviceId);
            return NoContent();
        }
    }
}
