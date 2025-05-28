using System.ComponentModel.DataAnnotations;

namespace MedTrack.API.Models
{
    public class ChronicDisease
    {
        [Key]
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }

        public ICollection<PatientChronicDisease>? PatientLinks { get; set; }
    }
}
