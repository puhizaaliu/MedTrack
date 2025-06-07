namespace MedTrack.API.DTOs.Doctor
{
    public class DoctorDTO
    {
        public int UserId { get; set; }

        // Informata të thjeshta për doktorin (nga User)
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Informata për specializimin
        public int SpecializationId { get; set; }
        public string SpecializationName { get; set; } = string.Empty;
    }
}
