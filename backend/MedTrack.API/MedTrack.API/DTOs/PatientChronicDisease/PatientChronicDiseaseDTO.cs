using MedTrack.API.DTOs.ChronicDisease;

namespace MedTrack.API.DTOs.PatientChronicDisease
{
    public class PatientChronicDiseaseDTO
    {
        public int PatientId { get; set; }
        public int DiseaseId { get; set; }
        public string? OtherText { get; set; }
        public ChronicDiseaseDTO? Disease { get; set; }
    }
}
