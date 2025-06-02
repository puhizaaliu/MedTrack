using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface ISpecializationRepository
    {
        Task<IEnumerable<Specialization>> GetAllSpecializationsAsync();
        Task<Specialization?> GetSpecializationByIdAsync(int id);
        Task AddSpecializationAsync(Specialization specialization);
        Task UpdateSpecializationAsync(Specialization specialization);
        Task DeleteSpecializationAsync(int id);
    }
}
