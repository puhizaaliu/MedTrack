﻿using MedTrack.API.DTOs.FamilyHistory;
using MedTrack.API.DTOs.MedicalInfo;
using MedTrack.API.DTOs.PatientChronicDisease;
using MedTrack.API.Models;

namespace MedTrack.API.DTOs.Patient
{
    public class PatientDTO
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string PersonalNumber { get; set; } = string.Empty;

        // Medical Info
        public MedicalInfoDTO? MedicalInfo { get; set; }

        // Family History - list
        public List<FamilyHistoryDTO> FamilyHistory { get; set; } = new();

        // Chronic Disease - list
        public List<PatientChronicDiseaseDTO> ChronicDiseases { get; set; } = new();

    }
}
