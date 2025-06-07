using MedTrack.API.DTOs.FamilyHistory;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IFamilyHistoryService
    {
        Task<IEnumerable<FamilyHistoryDTO>> GetAllFamilyHistoriesAsync();
        Task<FamilyHistoryDTO?> GetFamilyHistoryByIdAsync(int id);
        Task AddFamilyHistoryAsync(CreateFamilyHistoryDTO familyHistoryDto);
        Task UpdateFamilyHistoryAsync(int id, UpdateFamilyHistoryDTO familyHistoryDto);
        Task DeleteFamilyHistoryAsync(int id);
    }
}
