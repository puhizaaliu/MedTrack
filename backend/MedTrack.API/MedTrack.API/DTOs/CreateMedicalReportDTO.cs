using MedTrack.API.MongoModels;

namespace MedTrack.API.DTOs
{
    
    public class CreateMedicalReportDTO
    {
        public int AppointmentId { get; set; }                     

        public string Symptoms { get; set; } = null!;           

        public string SymptomDuration { get; set; } = null!;       

        public SymptomEvolution SymptomEvolution { get; set; }  

        public SymptomFrequence SymptomFrequence { get; set; }     

        public int SymptomIntensity { get; set; }               

        public bool PreviousSimilarSymptom { get; set; }     

        public string Diagnosis { get; set; } = null!;           

        public string TreatmentPlan { get; set; } = null!;  
    }
}
