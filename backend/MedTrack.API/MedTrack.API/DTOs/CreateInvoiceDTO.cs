using MedTrack.API.Models;

namespace MedTrack.API.DTOs
{
    public class CreateInvoiceDTO
    {
        public int AppointmentId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public bool PaymentStatus { get; set; }  // E shtojmë këtu
    }
}
