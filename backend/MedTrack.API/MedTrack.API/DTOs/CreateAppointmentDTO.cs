namespace MedTrack.API.DTOs
{
    public class CreateAppointmentDTO
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int ServiceId { get; set; }

        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
    }
}
