namespace MedTrack.API.DTOs
{
    public class CreateFamilyHistoryDTO
    {
        public int UserId { get; set; } // pacienti
        public string ConditionName { get; set; } = string.Empty;
    }
}
