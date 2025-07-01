using MedTrack.API.DTOs.Patient;
using System.Collections.Generic;
using System.Threading.Tasks;
using MedTrack.API.DTOs.User;

namespace MedTrack.API.Services.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientDTO>> GetAllPatientsAsync();
        Task<PatientDTO?> GetPatientByIdAsync(int id);
        Task AddPatientAsync(CreatePatientDTO dto);
        Task UpdatePatientAsync(int patientId, UpdatePatientDTO dto);
        Task DeletePatientAsync(int id);
        Task UpdateUserFieldsAsync(int patientId, UpdateUserDTO dto);
    }
}
