using MedTrack.API.Attributes;
using MedTrack.API.DTOs.FamilyHistory;
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
    [AuthorizeRoles(UserRole.Admin, UserRole.Doctor, UserRole.Patient)]
    public class FamilyHistoryController : ControllerBase
    {
        private readonly IFamilyHistoryService _familyHistoryService;

        public FamilyHistoryController(IFamilyHistoryService familyHistoryService)
        {
            _familyHistoryService = familyHistoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFamilyHistories()
        {
            var histories = await _familyHistoryService.GetAllFamilyHistoriesAsync();
            return Ok(histories);
        }

        // GET: api/FamilyHistory/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFamilyHistoryById(int id)
        {
            var history = await _familyHistoryService.GetFamilyHistoryByIdAsync(id);
            if (history == null)
                return NotFound();

            return Ok(history);
        }

        // POST: api/FamilyHistory
        [HttpPost]
        public async Task<IActionResult> AddFamilyHistory([FromBody] CreateFamilyHistoryDTO createFamilyHistoryDto)
        {
            await _familyHistoryService.AddFamilyHistoryAsync(createFamilyHistoryDto);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/FamilyHistory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFamilyHistory(int id, [FromBody] UpdateFamilyHistoryDTO updateFamilyHistoryDto)
        {
            try
            {
                await _familyHistoryService.UpdateFamilyHistoryAsync(id, updateFamilyHistoryDto);
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/FamilyHistory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFamilyHistory(int id)
        {
            await _familyHistoryService.DeleteFamilyHistoryAsync(id);
            return NoContent(); // 204 No Content
        }
    }
}
