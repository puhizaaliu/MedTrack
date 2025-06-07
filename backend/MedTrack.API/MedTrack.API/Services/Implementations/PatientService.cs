using MedTrack.API.DTOs.FamilyHistory;
using MedTrack.API.DTOs.Patient;
using MedTrack.API.DTOs.MedicalInfo;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;

        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        public async Task<IEnumerable<PatientDTO>> GetAllPatientsAsync()
        {
            var patients = await _patientRepository.GetAllPatientsAsync();
            var patientDtos = new List<PatientDTO>();

            foreach (var p in patients)
            {
                var patientDto = new PatientDTO
                {
                    UserId = p.UserId,
                    Name = p.User.Name,
                    Surname = p.User.Surname,
                    Phone = p.User.Phone,
                    Email = p.User.Email,
                    Address = p.User.Address,
                    DateOfBirth = p.User.DateOfBirth,
                    Gender = p.User.Gender,
                    MedicalInfo = p.MedicalInfo != null
                        ? new MedicalInfoDTO
                        {
                            Allergies = p.MedicalInfo.Allergies,
                            Medications = p.MedicalInfo.Medications,
                            Smoking = p.MedicalInfo.Smoking,
                            Alcohol = p.MedicalInfo.Alcohol,
                            PhysicalActivity = p.MedicalInfo.PhysicalActivity
                        }
                        : null,
                    FamilyHistory = p.FamilyHistories?
                        .Where(fh => fh.History != null)
                        .Select(fh => new FamilyHistoryDTO
                        {
                            HistoryId = fh.History.HistoryId,
                            ConditionName = fh.History.ConditionName
                        })
                        .ToList() 
                        ?? new List<FamilyHistoryDTO>()
                };

                patientDtos.Add(patientDto);
            }

            return patientDtos;
        }

        public async Task<PatientDTO?> GetPatientByIdAsync(int id)
        {
            var patient = await _patientRepository.GetPatientByIdAsync(id);
            if (patient == null) return null;

            var patientDto = new PatientDTO
            {
                UserId = patient.UserId,
                Name = patient.User.Name,
                Surname = patient.User.Surname,
                Phone = patient.User.Phone,
                Email = patient.User.Email,
                Address = patient.User.Address,
                DateOfBirth = patient.User.DateOfBirth,
                Gender = patient.User.Gender,
                MedicalInfo = patient.MedicalInfo != null
                    ? new MedicalInfoDTO
                    {
                        Allergies = patient.MedicalInfo.Allergies,
                        Medications = patient.MedicalInfo.Medications,
                        Smoking = patient.MedicalInfo.Smoking,
                        Alcohol = patient.MedicalInfo.Alcohol,
                        PhysicalActivity = patient.MedicalInfo.PhysicalActivity
                    }
                    : null,
                FamilyHistory = patient.FamilyHistories?
                    .Where(fh => fh.History != null)
                    .Select(fh => new FamilyHistoryDTO
                    {
                        HistoryId = fh.History.HistoryId,
                        ConditionName = fh.History.ConditionName
                    })
                    .ToList() 
                    ?? new List<FamilyHistoryDTO>()
            };

            return patientDto;
        }

        // Pacienti zakonisht krijohet si User, pastaj lidhet me tabelën Patient
        public async Task AddPatientAsync(int userId)
        {
            var patient = new Patient
            {
                UserId = userId
            };
            await _patientRepository.AddPatientAsync(patient);
        }

        // Pacienti shpesh nuk ka fusha të shumta për update në vetë tabelën Patient, 
        // më shpesh ndryshohen të dhënat në User, kështu që ky mund të mbetet i zbrazët
        public async Task UpdatePatientAsync(int id)
        {
            return;
        }

        public async Task DeletePatientAsync(int id)
        {
            await _patientRepository.DeletePatientAsync(id);
        }
    }
}
