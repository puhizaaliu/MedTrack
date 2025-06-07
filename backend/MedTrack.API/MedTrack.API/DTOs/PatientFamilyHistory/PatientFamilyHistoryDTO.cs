namespace MedTrack.API.DTOs.PatientFamilyHistory
{
    public class PatientFamilyHistoryDTO
    {
        public int PatientId { get; set; }
        public int HistoryId { get; set; }
        public string? OtherText { get; set; }

        // Për shfaqjen e detajeve të FamilyHistory
        public string ConditionName { get; set; } = string.Empty;
    }
}
