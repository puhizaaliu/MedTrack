using MedTrack.API.DTOs.MedicalInfo;
using MedTrack.API.DTOs.PatientChronicDisease;
using MedTrack.API.DTOs.PatientFamilyHistory;
using MedTrack.API.Models;
using System;
using System.Collections.Generic;

namespace MedTrack.API.DTOs.Patient
{
    public class CreatePatientDTO
    {
        // --- User fields ---
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string PersonalNumber { get; set; } = string.Empty;

        // --- Patient-specific fields ---

        // Medical info (inline object, required)
        public CreateMedicalInfoDTO MedicalInfo { get; set; } = new();

        // Family history (zero or more)
        public List<CreatePatientFamilyHistoryDTO> FamilyHistory { get; set; } = new();

        // Chronic diseases (zero or more)
        public List<CreatePatientChronicDiseaseDTO> ChronicDiseases { get; set; } = new();
    }
}
