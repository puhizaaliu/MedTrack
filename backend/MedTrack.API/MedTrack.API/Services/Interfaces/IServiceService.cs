using MedTrack.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDTO>> GetAllServicesAsync();
        Task<ServiceDTO?> GetServiceByIdAsync(int id);
        Task AddServiceAsync(ServiceDTO serviceDto);
        Task UpdateServiceAsync(int id, ServiceDTO serviceDto);
        Task DeleteServiceAsync(int id);
    }
}
