using MedTrack.API.Models;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IChronicDiseaseRepository
    {
        Task<IEnumerable<ChronicDisease>> GetAllAsync();
        Task<ChronicDisease?> GetByIdAsync(int id);
        Task AddAsync(ChronicDisease entity);
        Task UpdateAsync(ChronicDisease entity);
        Task DeleteAsync(int id);
    }

}
