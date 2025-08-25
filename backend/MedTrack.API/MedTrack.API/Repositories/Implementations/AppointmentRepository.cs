using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace MedTrack.API.Repositories.Implementations
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppDbContext _context;

        public AppointmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)      // Që Patient.User.Name/Surname të mos jenë null
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)      // Që Doctor.User.Name/Surname të mos jenë null
                .Include(a => a.Service)            // Që Service.Name të mos jetë null
                .ToListAsync();
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);
        }

        public async Task AddAppointmentAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAppointmentAsync(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment != null)
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            return await _context.Appointments
                // 1) Include Patient → Patient.User për emrin dhe mbiemrin
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                // 2) Include Doctor  → Doctor.User për emrin dhe mbiemrin
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                // 3) Include Service → Service.Name
                .Include(a => a.Service)
                // 4) Filtro sipas doctorId
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            return await _context.Appointments
                // 1) Include Patient → Patient.User
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                // 2) Include Doctor  → Doctor.User
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                // 3) Include Service → Service.Name
                .Include(a => a.Service)
                // 4) Filtro sipas patientId
                .Where(a => a.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByStatusAsync(AppointmentStatus status)
        {
            return await _context.Appointments
                // 1) Include Patient → Patient.User
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                // 2) Include Doctor  → Doctor.User
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                // 3) Include Service → Service.Name
                .Include(a => a.Service)
                // 4) Filtro sipas statusit
                .Where(a => a.Status == status)
                .ToListAsync();
        }
        public async Task<bool> AppointmentExistsAsync(int doctorId, DateOnly date, TimeOnly time, int excludeAppointmentId)
        {
            return await _context.Appointments.AnyAsync(a =>
                a.DoctorId == doctorId &&
                a.Date == date &&
                a.Time == time &&
                a.Status == AppointmentStatus.Konfirmuar &&
                a.AppointmentId != excludeAppointmentId
            );
        }

    }
}
