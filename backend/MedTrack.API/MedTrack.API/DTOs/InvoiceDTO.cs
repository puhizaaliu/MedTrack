using MedTrack.API.Models;

namespace MedTrack.API.DTOs
{
    public class InvoiceDTO
    {
        public int InvoiceId { get; set; }
        public int AppointmentId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public bool PaymentStatus { get; set; }
    }
}
