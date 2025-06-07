using System;
using System.ComponentModel.DataAnnotations;
using MedTrack.API.Models;  // për enum-in Gender

namespace MedTrack.API.Dtos.Auth
{
    public class RegisterRequest
    {
        [Required] public string Name { get; set; } = null!;
        [Required] public string Surname { get; set; } = null!;
        [Required] public string ParentName { get; set; } = null!;

        [Required]
        public Gender Gender { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string PersonalNumber { get; set; } = null!;

        [Required]
        public string Address { get; set; } = null!;

        [Required]
        public string Phone { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = null!;

        // role e vendoset automatikisht në AuthService si Patient
    }
}
