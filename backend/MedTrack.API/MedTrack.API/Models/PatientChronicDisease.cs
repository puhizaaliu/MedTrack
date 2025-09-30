using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedTrack.API.Models
{
    public class PatientChronicDisease
    {

        [Key, Column(Order = 0)]
        [ForeignKey(nameof(Patient))]
        public int PatientId { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey(nameof(Disease))]
        public int DiseaseId { get; set; }

        public string? OtherText { get; set; }

        public Patient? Patient { get; set; }
        public ChronicDisease? Disease { get; set; }
    }
}
