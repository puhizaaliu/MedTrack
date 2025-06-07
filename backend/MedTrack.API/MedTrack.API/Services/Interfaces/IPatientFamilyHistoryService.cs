using MedTrack.API.DTOs.PatientFamilyHistory;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IPatientFamilyHistoryService
    {
        Task<IEnumerable<PatientFamilyHistoryDTO>> GetByPatientIdAsync(int patientId);
        Task AddAsync(CreatePatientFamilyHistoryDTO dto);
        Task RemoveAsync(int patientId, int historyId);
    }
}
