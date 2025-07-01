using MedTrack.API.DTOs.ChronicDisease;
using MedTrack.API.DTOs.PatientChronicDisease;

namespace MedTrack.API.Services.Interfaces
{
    public interface IPatientChronicDiseaseService
    {
        Task<IEnumerable<PatientChronicDiseaseDTO>> GetByPatientIdAsync(int patientId);
        Task AddAsync(CreatePatientChronicDiseaseDTO dto);
        //Task UpdateAsync(int patientId, int diseaseId, UpdatePatientChronicDiseaseDTO dto);
        Task RemoveAsync(int patientId, int diseaseId);
    }
}
