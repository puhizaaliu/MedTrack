using MedTrack.API.Models;

namespace MedTrack.API.DTOs
{
    public class UpdateInvoiceDTO
    {
        public PaymentMethod Method { get; set; }
        public bool PaymentStatus { get; set; }
    }
}
