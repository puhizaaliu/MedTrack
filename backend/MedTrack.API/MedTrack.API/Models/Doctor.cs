using System.ComponentModel.DataAnnotations;

namespace MedTrack.API.Models
{
    public class Doctor
    {
        [Key] 
        public int UserId { get; set; }// FK dhe PK
        public int SpecializationId { get; set; }

        // Navigation Properties
        public User? User { get; set; }
        public Specialization? Specialization { get; set; }
    }
}
