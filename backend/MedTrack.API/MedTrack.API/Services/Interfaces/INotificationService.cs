using MedTrack.API.DTOs.Notification;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDTO>> GetAllAsync();
        Task<NotificationDTO?> GetByIdAsync(string id);
        Task<IEnumerable<NotificationDTO>> GetByUserIdAsync(int userId);
        Task<string> CreateAsync(CreateNotificationDTO dto);
        Task UpdateAsync(string id, UpdateNotificationDTO dto);
        Task DeleteAsync(string id);
    }
}
