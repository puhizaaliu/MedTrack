using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace MedTrack.API.MongoModels
{
    public enum NotificationType
    {
        AppointmentRequested,  
        AppointmentConfirmed,   
        AppointmentCompleted,   
        PaymentPending,       
        NewMedicalReport,      
        AppointmentMissed,      
        General                 
    }

    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("UserId")]
        public int UserId { get; set; }
        
        [BsonElement("Type")]
        [BsonRepresentation(BsonType.String)]
        public NotificationType Type { get; set; }
        
        [BsonElement("Message")]
        public string Message { get; set; } = null!;
       
        // Referencat e lidhura
        [BsonElement("AppointmentId")]
        public int? AppointmentId { get; set; }
    
        [BsonElement("MedicalReportId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? MedicalReportId { get; set; }

        // Statusi i leximit dhe kohet
        [BsonElement("IsRead")]
        public bool IsRead { get; set; } = false;
       
        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [BsonElement("ReadAt")]
        public DateTime? ReadAt { get; set; } // (null deri ne lexim).
    }
}
