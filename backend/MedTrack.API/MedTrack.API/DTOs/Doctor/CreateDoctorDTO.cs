using MedTrack.API.Models;

namespace MedTrack.API.DTOs.Doctor
{
    public class CreateDoctorDTO
    {
        // User fields
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PersonalNumber { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        // Doctor fields
        public int SpecializationId { get; set; }
    }

}
