using AutoMapper;
using MedTrack.API.DTOs.ChronicDisease;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;

namespace MedTrack.API.Services.Implementations
{
    public class ChronicDiseaseService : IChronicDiseaseService
    {
        private readonly IChronicDiseaseRepository _repo;
        private readonly IMapper _mapper;
        public ChronicDiseaseService(IChronicDiseaseRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ChronicDiseaseDTO>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<ChronicDiseaseDTO>>(list);
        }

        public async Task<ChronicDiseaseDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            return e == null ? null : _mapper.Map<ChronicDiseaseDTO>(e);
        }

        public async Task AddAsync(CreateChronicDiseaseDTO dto)
        {
            var e = _mapper.Map<ChronicDisease>(dto);
            await _repo.AddAsync(e);
        }

        public async Task UpdateAsync(int id, UpdateChronicDiseaseDTO dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) throw new KeyNotFoundException();
            _mapper.Map(dto, existing);
            await _repo.UpdateAsync(existing);
        }

        public async Task DeleteAsync(int id) =>
            await _repo.DeleteAsync(id);
    }

}
