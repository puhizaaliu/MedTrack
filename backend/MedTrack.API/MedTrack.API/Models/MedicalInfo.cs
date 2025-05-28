using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedTrack.API.Models
{
    public class MedicalInfo
    {
        [Key]
        public int MedicalInfoId { get; set; }

        [ForeignKey("Patient")]
        public int UserId { get; set; }

        public string Allergies { get; set; }
        public string Medications { get; set; }
        public bool Smoking { get; set; }
        public bool Alcohol { get; set; }
        public string PhysicalActivity { get; set; }

        public Patient? Patient { get; set; }
    }
}
