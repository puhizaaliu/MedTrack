using MedTrack.API.Models;

namespace MedTrack.API.DTOs.Appointments
{
    public class UpdateAppointmentDTO
    {
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
