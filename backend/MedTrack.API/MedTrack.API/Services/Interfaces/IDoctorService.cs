using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IDoctorService
    {
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
        Task<Doctor?> GetDoctorByIdAsync(int id);
        Task AddDoctorAsync(Doctor doctor);
        Task UpdateDoctorAsync(Doctor doctor);
        Task DeleteDoctorAsync(int id);
        Task<IEnumerable<Doctor>> GetDoctorsBySpecializationIdAsync(int specializationId);
    }
}
