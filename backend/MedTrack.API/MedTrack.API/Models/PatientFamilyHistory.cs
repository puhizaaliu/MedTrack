namespace MedTrack.API.Models
{
    public class PatientFamilyHistory
    {
        public int PatientId { get; set; }
        public int HistoryId { get; set; }

        public string? OtherText { get; set; }

        public Patient? Patient { get; set; }
        public FamilyHistory? History { get; set; }
    }
}
