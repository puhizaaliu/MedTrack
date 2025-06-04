using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServiceController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        // GET: api/Service
        [HttpGet]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _serviceService.GetAllServicesAsync();
            return Ok(services);
        }

        // GET: api/Service/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceById(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
                return NotFound();

            return Ok(service);
        }

        // POST: api/Service
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] ServiceDTO serviceDto)
        {
            await _serviceService.AddServiceAsync(serviceDto);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/Service/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceDTO serviceDto)
        {
            try
            {
                await _serviceService.UpdateServiceAsync(id, serviceDto);
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/Service/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            await _serviceService.DeleteServiceAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
