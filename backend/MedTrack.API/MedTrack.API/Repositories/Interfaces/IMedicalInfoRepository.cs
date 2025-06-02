using MedTrack.API.Models;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IMedicalInfoRepository
    {
        Task<MedicalInfo?> GetMedicalInfoByPatientIdAsync(int patientId);
        Task AddMedicalInfoAsync(MedicalInfo medicalInfo);
        Task UpdateMedicalInfoAsync(MedicalInfo medicalInfo);
        Task DeleteMedicalInfoAsync(int id);
    }
}
