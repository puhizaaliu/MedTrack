using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IFamilyHistoryService
    {
        Task<IEnumerable<FamilyHistory>> GetAllFamilyHistoriesAsync();
        Task<FamilyHistory?> GetFamilyHistoryByIdAsync(int id);
        Task AddFamilyHistoryAsync(FamilyHistory familyHistory);
        Task UpdateFamilyHistoryAsync(FamilyHistory familyHistory);
        Task DeleteFamilyHistoryAsync(int id);
    }
}
