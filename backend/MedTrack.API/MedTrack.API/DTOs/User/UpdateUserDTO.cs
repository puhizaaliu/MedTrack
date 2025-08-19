using MedTrack.API.Models;

namespace MedTrack.API.DTOs.User
{
    public class UpdateUserDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }

    }
}
