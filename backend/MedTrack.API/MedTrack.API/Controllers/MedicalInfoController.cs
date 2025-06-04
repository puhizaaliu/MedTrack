using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalInfoController : ControllerBase
    {
        private readonly IMedicalInfoService _medicalInfoService;

        public MedicalInfoController(IMedicalInfoService medicalInfoService)
        {
            _medicalInfoService = medicalInfoService;
        }

        // GET: api/MedicalInfo/{patientId}
        [HttpGet("{patientId}")]
        public async Task<IActionResult> GetMedicalInfoByPatientId(int patientId)
        {
            var medicalInfo = await _medicalInfoService.GetMedicalInfoByPatientIdAsync(patientId);
            if (medicalInfo == null)
                return NotFound();

            return Ok(medicalInfo);
        }

        // POST: api/MedicalInfo
        [HttpPost]
        public async Task<IActionResult> AddMedicalInfo([FromBody] CreateMedicalInfoDTO createMedicalInfoDto)
        {
            await _medicalInfoService.AddMedicalInfoAsync(createMedicalInfoDto);
            return StatusCode(201); // 201 Created
        }

        // PUT: api/MedicalInfo/{patientId}
        [HttpPut("{patientId}")]
        public async Task<IActionResult> UpdateMedicalInfo(int patientId, [FromBody] UpdateMedicalInfoDTO updateMedicalInfoDto)
        {
            try
            {
                await _medicalInfoService.UpdateMedicalInfoAsync(patientId, updateMedicalInfoDto);
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/MedicalInfo/{patientId}
        [HttpDelete("{patientId}")]
        public async Task<IActionResult> DeleteMedicalInfo(int patientId)
        {
            await _medicalInfoService.DeleteMedicalInfoAsync(patientId);
            return NoContent(); // 204 No Content
        }
    }
}
