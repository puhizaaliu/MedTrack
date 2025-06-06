using System;

namespace MedTrack.API.DTOs
{
    public class NotificationDTO
    {
        public string Id { get; set; } = null!;            
        public int UserId { get; set; }                   
        public string Type { get; set; } = null!;          
        public string Message { get; set; } = null!;      
        public int? AppointmentId { get; set; }           
        public string? MedicalReportId { get; set; }       
        public bool IsRead { get; set; }                   
        public DateTime CreatedAt { get; set; }           
        public DateTime? ReadAt { get; set; }              
    }
}
