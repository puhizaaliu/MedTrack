using MedTrack.API.Attributes;
using MedTrack.API.DTOs.ChronicDisease;
using MedTrack.API.DTOs.PatientChronicDisease;
using MedTrack.API.Models;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[AuthorizeRoles(UserRole.Patient, UserRole.Doctor, UserRole.Admin)]
public class PatientChronicDiseaseController : ControllerBase
{
    private readonly IPatientChronicDiseaseService _svc;
    public PatientChronicDiseaseController(IPatientChronicDiseaseService svc) => _svc = svc;

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetByPatient(int patientId) =>
        Ok(await _svc.GetByPatientIdAsync(patientId));

    [HttpPost]
    [AuthorizeRoles(UserRole.Doctor, UserRole.Admin)]
    public async Task<IActionResult> Add([FromBody] CreatePatientChronicDiseaseDTO dto)
    {
        await _svc.AddAsync(dto);
        return StatusCode(201);
    }

    //[HttpPut("{diseaseId}")]
    //[AuthorizeRoles(UserRole.Doctor, UserRole.Admin)]
    //public async Task<IActionResult> Update(int patientId, int diseaseId, [FromBody] UpdatePatientChronicDiseaseDTO dto)
    //{
    //    await _svc.UpdateAsync(patientId, diseaseId, dto);
    //    return NoContent();
    //}

    [HttpDelete]
    [AuthorizeRoles(UserRole.Doctor, UserRole.Admin)]
    public async Task<IActionResult> Delete([FromQuery] int patientId, [FromQuery] int diseaseId)
    {
        await _svc.RemoveAsync(patientId, diseaseId);
        return NoContent();
    }
}


