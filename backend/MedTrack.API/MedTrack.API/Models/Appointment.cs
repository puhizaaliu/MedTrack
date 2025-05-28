using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedTrack.API.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        [ForeignKey("Service")]
        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;

        [DataType(DataType.Date)]
        public DateOnly Date { get; set; }  // Date only

        [DataType(DataType.Time)]
        public TimeOnly Time { get; set; }  //Time only

        public AppointmentStatus Status { get; set; }
    }
}
