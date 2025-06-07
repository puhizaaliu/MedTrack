using MedTrack.API.DTOs.SpecialzationService;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface ISpecializationServiceService
    {
        Task<IEnumerable<SpecializationServiceDTO>> GetServicesBySpecializationAsync(int specializationId);
        Task AddServiceToSpecializationAsync(int specializationId, int serviceId);
        Task RemoveServiceFromSpecializationAsync(int specializationId, int serviceId);
    }
}
