
using MedTrack.API.MongoModels;
using System;

namespace MedTrack.API.DTOs
{
    public class UpdateNotificationDTO
    {
        public string? Type { get; set; }                   
        public string? Message { get; set; }                
        public int? AppointmentId { get; set; }           
        public string? MedicalReportId { get; set; }      
        public bool? IsRead { get; set; }                 
        public DateTime? ReadAt { get; set; }              
    }
}
