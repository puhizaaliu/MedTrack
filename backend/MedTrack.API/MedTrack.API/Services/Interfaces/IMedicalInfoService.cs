using MedTrack.API.DTOs.MedicalInfo;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IMedicalInfoService
    {
        Task<MedicalInfoDTO?> GetMedicalInfoByPatientIdAsync(int patientId);
        Task AddMedicalInfoAsync(CreateMedicalInfoDTO medicalInfoDto);
        Task UpdateMedicalInfoAsync(int id, UpdateMedicalInfoDTO medicalInfoDto);
        Task DeleteMedicalInfoAsync(int id);
    }
}
