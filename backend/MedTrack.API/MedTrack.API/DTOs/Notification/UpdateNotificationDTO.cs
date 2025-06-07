using MedTrack.API.MongoModels;
using System;

namespace MedTrack.API.DTOs.Notification
{
    public class UpdateNotificationDTO
    {
        public NotificationType? Type { get; set; }                   
        public string? Message { get; set; }                
        public int? AppointmentId { get; set; }           
        public string? MedicalReportId { get; set; }      
        public bool? IsRead { get; set; }                 
        public DateTime? ReadAt { get; set; }              
    }
}
