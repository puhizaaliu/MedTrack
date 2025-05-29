using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MedTrack.API.MongoModels
{
    public class MedicalReport
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("AppointmentId")]
        public int AppointmentId { get; set; }

        [BsonElement("Symptoms")]
        public string Symptoms { get; set; } = null!;

        [BsonElement("SymptomDuration")]
        public string SymptomDuration { get; set; } = null!;

        [BsonElement("SymptomEvolution")]
        [BsonRepresentation(BsonType.String)]
        public SymptomEvolution SymptomEvolution { get; set; }

        [BsonElement("SymptomFrequence")]
        [BsonRepresentation(BsonType.String)]
        public SymptomFrequence SymptomFrequence { get; set; }

        [BsonElement("SymptomIntensity")]
        public int SymptomIntensity { get; set; }

        [BsonElement("PreviousSimilarSymptom")]
        public bool PreviousSimilarSymptom { get; set; }

        [BsonElement("Diagnosis")]
        public string Diagnosis { get; set; } = null!;

        [BsonElement("TreatmentPlan")]
        public string TreatmentPlan { get; set; } = null!;
    }

    public enum SymptomEvolution
    {
        Perkeqesim,
        Njejte,
        Permiresim
    }

    public enum SymptomFrequence
    {
        Vazhdueshem,
        Periodike,
        RasteTeCaktuara
    }
}
