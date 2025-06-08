using MedTrack.API.Attributes;
using MedTrack.API.DTOs.SpecializationService;
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
    public class SpecializationServiceController : ControllerBase
    {
        private readonly ISpecializationServiceService _service;

        public SpecializationServiceController(ISpecializationServiceService service)
        {
            _service = service;
        }

        // GET: api/SpecializationService/{specializationId}
        [HttpGet("{specializationId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<SpecializationServiceDTO>>> GetServicesBySpecialization(int specializationId)
        {
            var servicesDto = await _service.GetServicesBySpecializationAsync(specializationId);
            return Ok(servicesDto);
        }

        // POST: api/SpecializationService?specializationId=1&serviceId=2
        [HttpPost]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> AddServiceToSpecialization([FromQuery] int specializationId, [FromQuery] int serviceId)
        {
            await _service.AddServiceToSpecializationAsync(specializationId, serviceId);
            return StatusCode(201); // 201 Created
        }

        // DELETE: api/SpecializationService?specializationId=1&serviceId=2
        [HttpDelete]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<IActionResult> RemoveServiceFromSpecialization([FromQuery] int specializationId, [FromQuery] int serviceId)
        {
            await _service.RemoveServiceFromSpecializationAsync(specializationId, serviceId);
            return NoContent();
        }
    }
}
