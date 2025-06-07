using MedTrack.API.MongoModels;

namespace MedTrack.API.DTOs.MedicalReport
{
    public class UpdateMedicalReportDto
    {
        public string? Symptoms { get; set; }                        

        public string? SymptomDuration { get; set; }                 

        public SymptomEvolution? SymptomEvolution { get; set; }      

        public SymptomFrequence? SymptomFrequence { get; set; }      

        public int? SymptomIntensity { get; set; }                   

        public bool? PreviousSimilarSymptom { get; set; }           

        public string? Diagnosis { get; set; }                       

        public string? TreatmentPlan { get; set; }              
    }
}
