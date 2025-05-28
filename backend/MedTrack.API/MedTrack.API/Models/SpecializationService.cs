namespace MedTrack.API.Models
{
    public class SpecializationService
    {
        public int SpecializationId { get; set; }
        public Specialization Specialization { get; set; } = null!;

        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;
    }
}
