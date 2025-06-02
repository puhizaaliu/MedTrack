using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetAllServicesAsync();
        Task<Service?> GetServiceByIdAsync(int id);
        Task AddServiceAsync(Service service);
        Task UpdateServiceAsync(Service service);
        Task DeleteServiceAsync(int id);
    }
}
