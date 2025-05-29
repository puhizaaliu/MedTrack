using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MedTrack.API.MongoModels
{
    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("UserId")]
        public int UserId { get; set; }

        [BsonElement("Role")]
        [BsonRepresentation(BsonType.String)]
        public UserRole Role { get; set; }

        [BsonElement("Message")]
        public string Message { get; set; } = null!;

        [BsonElement("IsRead")]
        public bool IsRead { get; set; } = false;

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("Type")]
        [BsonRepresentation(BsonType.String)]
        public NotificationType Type { get; set; }

        [BsonElement("RelatedEntityId")]
        public string? RelatedEntityId { get; set; }

        [BsonElement("Link")]
        public string? Link { get; set; }
    }

    public enum UserRole
    {
        Admin,
        Doctor,
        Recepsionist,
        Patient
    }

    public enum NotificationType
    {
        AppointmentRequested,
        AppointmentConfirmed,
        AppointmentCompleted,
        PaymentPending,
        NewMedicalReport,
        General
    }
}
