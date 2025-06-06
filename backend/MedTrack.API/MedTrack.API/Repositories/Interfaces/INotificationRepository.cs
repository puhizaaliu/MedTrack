using MedTrack.API.MongoModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetAllAsync();
        Task<Notification?> GetByIdAsync(string id);
        Task CreateAsync(Notification notification);
        Task UpdateAsync(string id, Notification notification);
        Task DeleteAsync(string id);
        Task<IEnumerable<Notification>> GetByUserIdAsync(int userId);
    }
}

