using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IFamilyHistoryRepository
    {
        Task<IEnumerable<FamilyHistory>> GetAllFamilyHistoriesAsync();
        Task<FamilyHistory?> GetFamilyHistoryByIdAsync(int id);
        Task AddFamilyHistoryAsync(FamilyHistory familyHistory);
        Task UpdateFamilyHistoryAsync(FamilyHistory familyHistory);
        Task DeleteFamilyHistoryAsync(int id);

       
    }
}
