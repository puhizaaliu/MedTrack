using MedTrack.API.MongoModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<NotificationDocument>> GetAllAsync();
        Task<NotificationDocument?> GetByIdAsync(string id);
        Task CreateAsync(NotificationDocument notification);
        Task UpdateAsync(string id, NotificationDocument notification);
        Task DeleteAsync(string id);
        Task<IEnumerable<NotificationDocument>> GetByUserIdAsync(int userId);
    }
}

