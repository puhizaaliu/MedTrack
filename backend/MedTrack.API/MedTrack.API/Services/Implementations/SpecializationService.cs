using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class SpecializationService : ISpecializationService
    {
        private readonly ISpecializationRepository _specializationRepository;

        public SpecializationService(ISpecializationRepository specializationRepository)
        {
            _specializationRepository = specializationRepository;
        }

        public async Task<IEnumerable<Specialization>> GetAllSpecializationsAsync()
        {
            return await _specializationRepository.GetAllSpecializationsAsync();
        }

        public async Task<Specialization?> GetSpecializationByIdAsync(int id)
        {
            return await _specializationRepository.GetSpecializationByIdAsync(id);
        }

        public async Task AddSpecializationAsync(Specialization specialization)
        {
            await _specializationRepository.AddSpecializationAsync(specialization);
        }

        public async Task UpdateSpecializationAsync(Specialization specialization)
        {
            await _specializationRepository.UpdateSpecializationAsync(specialization);
        }

        public async Task DeleteSpecializationAsync(int id)
        {
            await _specializationRepository.DeleteSpecializationAsync(id);
        }
    }
}
