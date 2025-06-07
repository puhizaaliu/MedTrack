using MedTrack.API.DTOs.Patient;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientDTO>> GetAllPatientsAsync();
        Task<PatientDTO?> GetPatientByIdAsync(int id);
        Task AddPatientAsync(int userId); // pacienti lidhet me user ekzistues
        Task UpdatePatientAsync(int id);  
        Task DeletePatientAsync(int id);
    }
}
