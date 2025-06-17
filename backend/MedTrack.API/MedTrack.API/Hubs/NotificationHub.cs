namespace MedTrack.API.Hubs
{
    using MedTrack.API.DTOs.Notification;
    using Microsoft.AspNetCore.SignalR;

    public interface INotificationClient
    {
        Task ReceiveNotification(NotificationDTO notification);
    }

    public class NotificationHub : Hub<INotificationClient>
    {
        // You can add methods here if clients call server,
        // but for push-only you don’t need any extra code.
    }
}
