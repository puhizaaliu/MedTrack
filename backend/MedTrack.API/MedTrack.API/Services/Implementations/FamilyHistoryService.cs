using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class FamilyHistoryService : IFamilyHistoryService
    {
        private readonly IFamilyHistoryRepository _familyHistoryRepository;

        public FamilyHistoryService(IFamilyHistoryRepository familyHistoryRepository)
        {
            _familyHistoryRepository = familyHistoryRepository;
        }

        public async Task<IEnumerable<FamilyHistory>> GetAllFamilyHistoriesAsync()
        {
            return await _familyHistoryRepository.GetAllFamilyHistoriesAsync();
        }

        public async Task<FamilyHistory?> GetFamilyHistoryByIdAsync(int id)
        {
            return await _familyHistoryRepository.GetFamilyHistoryByIdAsync(id);
        }

        public async Task AddFamilyHistoryAsync(FamilyHistory familyHistory)
        {
            await _familyHistoryRepository.AddFamilyHistoryAsync(familyHistory);
        }

        public async Task UpdateFamilyHistoryAsync(FamilyHistory familyHistory)
        {
            await _familyHistoryRepository.UpdateFamilyHistoryAsync(familyHistory);
        }

        public async Task DeleteFamilyHistoryAsync(int id)
        {
            await _familyHistoryRepository.DeleteFamilyHistoryAsync(id);
        }
    }
}
