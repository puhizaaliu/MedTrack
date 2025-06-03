using MedTrack.API.Models;

namespace MedTrack.API.DTOs
{
    public class UpdateAppointmentDTO
    {
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
