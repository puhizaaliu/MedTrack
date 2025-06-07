using AutoMapper;
using MedTrack.API.DTOs.FamilyHistory;
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
        private readonly IMapper _mapper;

        public FamilyHistoryService(IFamilyHistoryRepository familyHistoryRepository, IMapper mapper)
        {
            _familyHistoryRepository = familyHistoryRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FamilyHistoryDTO>> GetAllFamilyHistoriesAsync()
        {
            var histories = await _familyHistoryRepository.GetAllFamilyHistoriesAsync();
            return _mapper.Map<IEnumerable<FamilyHistoryDTO>>(histories);
        }

        public async Task<FamilyHistoryDTO?> GetFamilyHistoryByIdAsync(int id)
        {
            var history = await _familyHistoryRepository.GetFamilyHistoryByIdAsync(id);
            return history == null ? null : _mapper.Map<FamilyHistoryDTO>(history);
        }

        public async Task AddFamilyHistoryAsync(CreateFamilyHistoryDTO familyHistoryDto)
        {
            var familyHistory = _mapper.Map<FamilyHistory>(familyHistoryDto);
            await _familyHistoryRepository.AddFamilyHistoryAsync(familyHistory);
        }

        public async Task UpdateFamilyHistoryAsync(int id, UpdateFamilyHistoryDTO familyHistoryDto)
        {
            var existingHistory = await _familyHistoryRepository.GetFamilyHistoryByIdAsync(id);
            if (existingHistory == null) throw new Exception("FamilyHistory not found");

            _mapper.Map(familyHistoryDto, existingHistory);
            await _familyHistoryRepository.UpdateFamilyHistoryAsync(existingHistory);
        }

        public async Task DeleteFamilyHistoryAsync(int id)
        {
            await _familyHistoryRepository.DeleteFamilyHistoryAsync(id);
        }
    }
}
