using System;

namespace MedTrack.API.DTOs.MedicalReport
{
    public class MedicalReportDTO
    {
        public string Id { get; set; } = null!;

        public int AppointmentId { get; set; }
        public string? PatientName { get; set; }
        public string? PatientSurname { get; set; }
        public string? DoctorName { get; set; }
        public string? DoctorSurname { get; set; }

        public string Symptoms { get; set; } = null!;

        public string SymptomDuration { get; set; } = null!;   

        public string SymptomEvolution { get; set; } = null!; 

        public string SymptomFrequence { get; set; } = null!;  

        public int SymptomIntensity { get; set; }          

        public bool PreviousSimilarSymptom { get; set; }    

        public string Diagnosis { get; set; } = null!;         

        public string TreatmentPlan { get; set; } = null!;     

        public DateTime CreatedAt { get; set; }              

        public DateTime? UpdatedAt { get; set; }               
    }
}
