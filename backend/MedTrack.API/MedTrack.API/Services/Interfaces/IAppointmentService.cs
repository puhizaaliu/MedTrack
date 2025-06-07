using MedTrack.API.DTOs.Appointments;
using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync();
        Task<AppointmentDTO?> GetAppointmentByIdAsync(int id);
        Task AddAppointmentAsync(CreateAppointmentDTO appointmentDto);
        Task UpdateAppointmentAsync(int id, UpdateAppointmentDTO appointmentDto);
        Task DeleteAppointmentAsync(int id);

        Task<IEnumerable<AppointmentDTO>> GetAppointmentsByDoctorIdAsync(int doctorId);
        Task<IEnumerable<AppointmentDTO>> GetAppointmentsByPatientIdAsync(int patientId);
        Task<IEnumerable<AppointmentDTO>> GetAppointmentsByStatusAsync(AppointmentStatus status);
    }
}
