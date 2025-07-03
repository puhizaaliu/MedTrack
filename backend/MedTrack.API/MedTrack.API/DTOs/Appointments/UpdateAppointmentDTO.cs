using MedTrack.API.Models;

namespace MedTrack.API.DTOs.Appointments
{
    public class UpdateAppointmentDTO
    {
        public string? Date { get; set; }
        public string? Time { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
