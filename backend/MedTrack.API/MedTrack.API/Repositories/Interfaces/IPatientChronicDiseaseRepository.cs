using MedTrack.API.Models;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IPatientChronicDiseaseRepository
    {
        Task<IEnumerable<PatientChronicDisease>> GetByPatientIdAsync(int patientId);
        Task AddAsync(PatientChronicDisease link);
        Task UpdateAsync(PatientChronicDisease link);
        Task RemoveAsync(int patientId, int diseaseId);
        Task DeleteAllByPatientIdAsync(int patientId);

    }
}
