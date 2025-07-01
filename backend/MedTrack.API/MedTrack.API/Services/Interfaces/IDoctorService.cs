using MedTrack.API.DTOs.Doctor;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IDoctorService
    {
        Task<IEnumerable<DoctorDTO>> GetAllDoctorsAsync();
        Task<DoctorDTO?> GetDoctorByIdAsync(int id);
        Task AddDoctorAsync(CreateDoctorDTO dto); 
        Task UpdateDoctorAsync(int userId, UpdateDoctorDTO dto);
        Task DeleteDoctorAsync(int id);
        Task<IEnumerable<DoctorDTO>> GetDoctorsBySpecializationIdAsync(int specializationId);
        Task<List<DoctorDTO>> GetDoctorsByServiceAsync(int serviceId);
    }
}
