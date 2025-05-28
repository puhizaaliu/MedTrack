namespace MedTrack.API.Models
{
    public class Specialization
    {
        public int SpecializationId { get; set; }
        public string Name { get; set; }

        public ICollection<Doctor>? Doctors { get; set; }
        public ICollection<SpecializationService>? SpecializationServices { get; set; }
    }
}
