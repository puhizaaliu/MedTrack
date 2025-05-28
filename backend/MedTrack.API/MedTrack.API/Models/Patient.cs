using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedTrack.API.Models
{
    public class Patient
    {
        [Key]
        [ForeignKey("User")]
        public int UserId { get; set; }

        // Navigime
        public User? User { get; set; }

        public MedicalInfo? MedicalInfo { get; set; }

        public ICollection<PatientChronicDisease>? ChronicDiseases { get; set; }

        public ICollection<PatientFamilyHistory>? FamilyHistories { get; set; }
    }
}
