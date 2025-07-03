using AutoMapper;
using MedTrack.API.DTOs.Appointments;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public AppointmentService(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }

        public async Task<AppointmentDTO?> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
            return appointment == null ? null : _mapper.Map<AppointmentDTO>(appointment);
        }

        public async Task AddAppointmentAsync(CreateAppointmentDTO appointmentDto)
        {
            var appointment = _mapper.Map<Appointment>(appointmentDto);
            appointment.Status = AppointmentStatus.Kerkese; // default kur krijohet
            await _appointmentRepository.AddAppointmentAsync(appointment);
        }

        public async Task UpdateAppointmentAsync(int id, UpdateAppointmentDTO appointmentDto)
        {
            var existingAppointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
            if (existingAppointment == null) throw new Exception("Appointment not found");

            // Explicit parsing for Date and Time
            if (!string.IsNullOrEmpty(appointmentDto.Date))
                existingAppointment.Date = DateOnly.Parse(appointmentDto.Date);

            if (!string.IsNullOrEmpty(appointmentDto.Time))
                existingAppointment.Time = TimeOnly.Parse(appointmentDto.Time);

            existingAppointment.Status = appointmentDto.Status;

            await _appointmentRepository.UpdateAppointmentAsync(existingAppointment);
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentAsync(id);
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByDoctorIdAsync(doctorId);
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByPatientIdAsync(patientId);
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByStatusAsync(AppointmentStatus status)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByStatusAsync(status);
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }
    }
}
