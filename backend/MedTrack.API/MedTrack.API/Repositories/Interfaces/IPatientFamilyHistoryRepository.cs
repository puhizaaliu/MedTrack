using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IPatientFamilyHistoryRepository
    {
        Task<IEnumerable<PatientFamilyHistory>> GetByPatientIdAsync(int patientId);
        Task AddAsync(PatientFamilyHistory patientFamilyHistory);
        Task RemoveAsync(int patientId, int historyId);
        Task DeleteAllByPatientIdAsync(int patientId);

    }
}
