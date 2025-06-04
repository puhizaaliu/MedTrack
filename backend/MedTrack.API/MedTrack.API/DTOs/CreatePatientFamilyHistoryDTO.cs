namespace MedTrack.API.DTOs
{
    public class CreatePatientFamilyHistoryDTO
    {
        public int PatientId { get; set; }
        public int HistoryId { get; set; }
        public string? OtherText { get; set; }
    }
}
