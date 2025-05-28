using System.ComponentModel.DataAnnotations;

namespace MedTrack.API.Models
{
    public class FamilyHistory
    {
        [Key]
        public int HistoryId { get; set; }
        public string ConditionName { get; set; }

        public ICollection<PatientFamilyHistory>? PatientLinks { get; set; }
    }
}
