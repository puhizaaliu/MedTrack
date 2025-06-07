namespace MedTrack.API.DTOs.FamilyHistory
{
    public class CreateFamilyHistoryDTO
    {
        public int UserId { get; set; } // pacienti
        public string ConditionName { get; set; } = string.Empty;
    }
}
