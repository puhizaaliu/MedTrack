using MedTrack.API.Models;

namespace MedTrack.API.DTOs
{
    public class AppointmentDTO
    {
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientSurname { get; set; } = string.Empty;

        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string DoctorSurname { get; set; } = string.Empty;

        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;

        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
