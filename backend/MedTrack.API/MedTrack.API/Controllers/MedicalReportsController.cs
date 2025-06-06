using System.Collections.Generic;
using System.Threading.Tasks;
using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalReportsController : ControllerBase
    {
        private readonly IMedicalReportService _service;

        public MedicalReportsController(IMedicalReportService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reports = await _service.GetAllAsync();
            return Ok(reports);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var reportDto = await _service.GetByIdAsync(id);
            if (reportDto == null)
                return NotFound();
            return Ok(reportDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMedicalReportDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newId = await _service.CreateAsync(dto);

            // Kthejmë 201 Created me header "Location" që tregon GET /api/MedicalReports/{newId}
            return CreatedAtAction(nameof(GetById), new { id = newId }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateMedicalReportDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _service.UpdateAsync(id, dto);
                return NoContent(); // 204
            }
            catch (KeyNotFoundException)
            {
                return NotFound();  // Nëse raporti me të dhënë nuk ekziston
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _service.DeleteAsync(id);
            return NoContent(); // 204
        }
    }
}
