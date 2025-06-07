using MedTrack.API.Models;

namespace MedTrack.API.DTOs.Invoice
{
    public class InvoiceDTO
    {
        public int InvoiceId { get; set; }

        public int AppointmentId { get; set; }

        public string? PatientName { get; set; }
        public string? PatientSurname { get; set; }

        public string? DoctorName { get; set; }
        public string? DoctorSurname { get; set; }

        public int? ServiceId { get; set; }
        public string? ServiceName { get; set; }

        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public bool PaymentStatus { get; set; }
    }
}
