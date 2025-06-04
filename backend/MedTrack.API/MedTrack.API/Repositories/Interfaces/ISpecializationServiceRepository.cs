using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface ISpecializationServiceRepository
    {
        Task<IEnumerable<Service>> GetServicesBySpecializationAsync(int specializationId);
        Task AddServiceToSpecializationAsync(int specializationId, int serviceId);
        Task RemoveServiceFromSpecializationAsync(int specializationId, int serviceId);
    }
}
