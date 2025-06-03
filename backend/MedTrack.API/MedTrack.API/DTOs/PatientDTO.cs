using MedTrack.API.Models;

namespace MedTrack.API.DTOs
{
    public class PatientDTO
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }

        // Medical Info
        public MedicalInfoDTO? MedicalInfo { get; set; }

        // Family History - list
        public List<FamilyHistoryDTO> FamilyHistory { get; set; } = new();
    }
}
