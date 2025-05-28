using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedTrack.API.Models
{
    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }

        [ForeignKey("Appointment")]
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;

        public decimal Amount { get; set; }

        public PaymentMethod Method { get; set; }

        public bool PaymentStatus { get; set; } // true = paguar, false = jo paguar
    }
}
