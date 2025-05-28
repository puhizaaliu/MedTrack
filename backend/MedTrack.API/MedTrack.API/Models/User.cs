namespace MedTrack.API.Models
{
    public enum Gender
    {
        M,
        F,
        O
    }

    public enum UserRole
    {
        Admin,
        Doctor,
        Receptionist,
        Patient
    }

    public class User
    {
        public int UserId { get; set; }

        public string Name { get; set; } 

        public string Surname { get; set; } 

        public string ParentName { get; set; }

        public Gender Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string PersonalNumber { get; set; } 

        public string Address { get; set; } 

        public string Phone { get; set; } 

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public UserRole Role { get; set; }
    }
}
