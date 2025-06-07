using MedTrack.API.MongoModels;

namespace MedTrack.API.DTOs.Notification
{
    public class CreateNotificationDTO
    {
        public int UserId { get; set; }                   
        public NotificationType Type { get; set; }           
        public string Message { get; set; } = null!;        
        public int? AppointmentId { get; set; }             
        public string? MedicalReportId { get; set; }       
    }
}
