using MedTrack.API.DTOs.Doctor;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IDoctorService
    {
        Task<IEnumerable<DoctorDTO>> GetAllDoctorsAsync();
        Task<DoctorDTO?> GetDoctorByIdAsync(int id);
        Task AddDoctorAsync(int userId, int specializationId); // doktori lidhet me user ekzistues
        Task UpdateDoctorAsync(int id, UpdateDoctorDTO doctorDto);
        Task DeleteDoctorAsync(int id);
        Task<IEnumerable<DoctorDTO>> GetDoctorsBySpecializationIdAsync(int specializationId);
    }
}
