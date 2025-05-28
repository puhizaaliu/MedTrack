namespace MedTrack.API.Models
{
    public class PatientChronicDisease
    {
        public int PatientId { get; set; }
        public int DiseaseId { get; set; }

        public string? OtherText { get; set; }

        public Patient? Patient { get; set; }
        public ChronicDisease? Disease { get; set; }
    }
}
