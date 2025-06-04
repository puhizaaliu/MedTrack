namespace MedTrack.API.DTOs
{
    public class SpecializationServiceDTO
    {
        public int SpecializationId { get; set; }
        public int ServiceId { get; set; }

        // Për lehtësi në përgjigje
        public string ServiceName { get; set; } = string.Empty;
    }
}
