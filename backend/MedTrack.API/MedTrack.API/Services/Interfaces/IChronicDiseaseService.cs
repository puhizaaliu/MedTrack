using MedTrack.API.DTOs.ChronicDisease;

namespace MedTrack.API.Services.Interfaces
{
    public interface IChronicDiseaseService
    {
        Task<IEnumerable<ChronicDiseaseDTO>> GetAllAsync();
        Task<ChronicDiseaseDTO?> GetByIdAsync(int id);
        Task AddAsync(CreateChronicDiseaseDTO dto);
        Task UpdateAsync(int id, UpdateChronicDiseaseDTO dto);
        Task DeleteAsync(int id);
    }
}
