namespace MedTrack.API.DTOs.PatientChronicDisease
{
    public class CreatePatientChronicDiseaseDTO
    {
        public int PatientId { get; set; }
        public int DiseaseId { get; set; }
        public string? OtherText { get; set; }
    }
}
