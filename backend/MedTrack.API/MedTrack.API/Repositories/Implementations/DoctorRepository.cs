using MedTrack.API.Data;
using MedTrack.API.DTOs.Doctor;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly AppDbContext _context;

        public DoctorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync()
        {
            
            return await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .ToListAsync();
        }

        public async Task<Doctor?> GetDoctorByIdAsync(int id)
        {
            return await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync(d => d.UserId == id);
        }

        public async Task AddDoctorAsync(Doctor doctor)
        {
            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDoctorAsync(Doctor doctor)
        {
            _context.Doctors.Update(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDoctorAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor != null)
            {
                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteDoctorByUserIdAsync(int userId)
        {
            var doctor = await _context.Doctors.SingleOrDefaultAsync(d => d.UserId == userId);
            if (doctor != null)
            {
                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Doctor>> GetDoctorsBySpecializationIdAsync(int specializationId)
        {
            return await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialization)
                .Where(d => d.SpecializationId == specializationId)
                .ToListAsync();
        }

        public async Task<List<DoctorDTO>> GetDoctorsByServiceAsync(int serviceId)
        {
            var specializationsWithService = await _context.SpecializationServices
                .Where(ss => ss.ServiceId == serviceId)
                .Select(ss => ss.SpecializationId)
                .ToListAsync();

            var doctors = await _context.Doctors
                .Include(d => d.User)
                .Where(d => specializationsWithService.Contains(d.SpecializationId))
                .Select(d => new DoctorDTO
                {
                    UserId = d.UserId,
                    Name = d.User.Name,
                    Surname = d.User.Surname
                })
                .ToListAsync();

            return doctors;
        }

    }
}
