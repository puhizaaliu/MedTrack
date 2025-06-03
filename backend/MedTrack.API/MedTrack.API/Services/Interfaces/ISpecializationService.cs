using MedTrack.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface ISpecializationService
    {
        Task<IEnumerable<SpecializationDTO>> GetAllSpecializationsAsync();
        Task<SpecializationDTO?> GetSpecializationByIdAsync(int id);
        Task AddSpecializationAsync(SpecializationDTO specializationDto);
        Task UpdateSpecializationAsync(int id, SpecializationDTO specializationDto);
        Task DeleteSpecializationAsync(int id);
    }
}
