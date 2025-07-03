using MedTrack.API.Attributes;
using MedTrack.API.DTOs.Appointments;
using MedTrack.API.Models;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // GET: api/Appointment
        [HttpGet]
        [AuthorizeRoles(UserRole.Patient, UserRole.Receptionist, UserRole.Admin)]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAll()
        {
            var list = await _appointmentService.GetAllAppointmentsAsync();
            return Ok(list);
        }

        // GET: api/Appointment/5
        [HttpGet("{id}")]
        [AuthorizeRoles(UserRole.Patient, UserRole.Receptionist)]
        public async Task<ActionResult<AppointmentDTO>> GetById(int id)
        {
            var dto = await _appointmentService.GetAppointmentByIdAsync(id);
            if (dto == null)
                return NotFound();
            return Ok(dto);
        }

        // POST: api/Appointment
        [HttpPost]
        [AuthorizeRoles(UserRole.Patient)]
        public async Task<ActionResult> Create([FromBody] CreateAppointmentDTO createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _appointmentService.AddAppointmentAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = /* assuming service generates ID */ 0 }, null);
        }

        // PUT: api/Appointment/5
        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Doctor)]
        public async Task<ActionResult> Update(int id, [FromBody] UpdateAppointmentDTO updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                await _appointmentService.UpdateAppointmentAsync(id, updateDto);
            }
            catch (Exception)
            {
                return NotFound();
            }
            return NoContent();
        }

        // DELETE: api/Appointment/5
        [HttpDelete("{id}")]
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<ActionResult> Delete(int id)
        {
            await _appointmentService.DeleteAppointmentAsync(id);
            return NoContent();
        }

        // GET: api/Appointment/doctor/3
        [HttpGet("doctor/{doctorId}")]
        [AuthorizeRoles(UserRole.Doctor, UserRole.Receptionist)]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetByDoctor(int doctorId)
        {
            var list = await _appointmentService.GetAppointmentsByDoctorIdAsync(doctorId);
            return Ok(list);
        }

        // GET: api/Appointment/patient/5
        [HttpGet("patient/{patientId}")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin, UserRole.Patient)]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetByPatient(int patientId)
        {
            var list = await _appointmentService.GetAppointmentsByPatientIdAsync(patientId);
            return Ok(list);
        }

        // GET: api/Appointment/status/Kerkese
        [HttpGet("status/{status}")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Doctor)]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetByStatus(string status)
        {
            if (!Enum.TryParse<AppointmentStatus>(status, true, out var parsed))
                return BadRequest($"Invalid status: {status}");

            var list = await _appointmentService.GetAppointmentsByStatusAsync(parsed);
            return Ok(list);
        }
    }
}
