using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedTrack.API.Models
{
    public class PatientFamilyHistory
    {
        [Key, Column(Order = 0)]
        [ForeignKey(nameof(Patient))]
        public int PatientId { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey(nameof(History))]
        public int HistoryId { get; set; }

        public string? OtherText { get; set; }

        public Patient? Patient { get; set; }
        public FamilyHistory? History { get; set; }
    }
}
