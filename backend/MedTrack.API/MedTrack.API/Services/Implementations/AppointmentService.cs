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

        public AppointmentService(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _appointmentRepository.GetAllAppointmentsAsync();
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int id)
        {
            return await _appointmentRepository.GetAppointmentByIdAsync(id);
        }

        public async Task AddAppointmentAsync(Appointment appointment)
        {
            await _appointmentRepository.AddAppointmentAsync(appointment);
        }

        public async Task UpdateAppointmentAsync(Appointment appointment)
        {
            await _appointmentRepository.UpdateAppointmentAsync(appointment);
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentAsync(id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            return await _appointmentRepository.GetAppointmentsByDoctorIdAsync(doctorId);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            return await _appointmentRepository.GetAppointmentsByPatientIdAsync(patientId);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByStatusAsync(AppointmentStatus status)
        {
            return await _appointmentRepository.GetAppointmentsByStatusAsync(status);
        }
    }
}
