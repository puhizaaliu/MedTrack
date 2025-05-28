namespace MedTrack.API.Models
{
    public class Service
    {
        public int ServiceId { get; set; }
        public string Name { get; set; }

        public ICollection<SpecializationService>? SpecializationServices { get; set; }
    }
}
