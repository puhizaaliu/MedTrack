namespace MedTrack.API.Models
{
    public class SpecializationService
    {
        public int SpecializationId { get; set; }
        public int ServiceId { get; set; }

        // Navigation Properties
        public Specialization? Specialization { get; set; }
        public Service? Service { get; set; }
    }
}
