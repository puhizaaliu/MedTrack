using MedTrack.API.Data;
using MedTrack.API.DTOs.ChronicDisease;
using MedTrack.API.DTOs.FamilyHistory;
using MedTrack.API.DTOs.MedicalInfo;
using MedTrack.API.DTOs.Patient;
using MedTrack.API.DTOs.PatientChronicDisease;
using MedTrack.API.DTOs.User;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore; 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMedicalInfoRepository _medicalInfoRepository;
        private readonly IPatientFamilyHistoryRepository _patientFamilyHistoryRepository;
        private readonly IPatientChronicDiseaseRepository _patientChronicDiseaseRepository;
        private readonly AppDbContext _dbContext;

        public PatientService(
            IPatientRepository patientRepository,
            IUserRepository userRepository,
            IMedicalInfoRepository medicalInfoRepository,
            IPatientFamilyHistoryRepository patientFamilyHistoryRepository,
            IPatientChronicDiseaseRepository patientChronicDiseaseRepository,
            AppDbContext dbContext // pass your actual context
        )
        {
            _patientRepository = patientRepository;
            _userRepository = userRepository;
            _medicalInfoRepository = medicalInfoRepository;
            _patientFamilyHistoryRepository = patientFamilyHistoryRepository;
            _patientChronicDiseaseRepository = patientChronicDiseaseRepository;
            _dbContext = dbContext;
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
                    ParentName = p.User.ParentName,
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
                        ?? new List<FamilyHistoryDTO>(),
                    ChronicDiseases = p.ChronicDiseases?
                        .Where(cd => cd.Disease != null)
                        .Select(cd => new PatientChronicDiseaseDTO
                        {
                            PatientId = cd.PatientId,
                            DiseaseId = cd.Disease.DiseaseId,
                            OtherText = cd.OtherText,
                            Disease = new ChronicDiseaseDTO
                            {
                                DiseaseId = cd.Disease.DiseaseId,
                                DiseaseName = cd.Disease.DiseaseName
                            }
                        })
                        .ToList()
                        ?? new List<PatientChronicDiseaseDTO>()
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
                ParentName = patient.User.ParentName,
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
                    ?? new List<FamilyHistoryDTO>(),
                ChronicDiseases = patient.ChronicDiseases?
                    .Where(cd => cd.Disease != null)
                    .Select(cd => new PatientChronicDiseaseDTO
                    {
                        PatientId = cd.PatientId,
                        DiseaseId = cd.Disease.DiseaseId,
                        OtherText = cd.OtherText,
                        Disease = new ChronicDiseaseDTO
                        {
                            DiseaseId = cd.Disease.DiseaseId,
                            DiseaseName = cd.Disease.DiseaseName
                        }
                    })
                    .ToList()
                    ?? new List<PatientChronicDiseaseDTO>()
            };

            return patientDto;
        }

        public async Task AddPatientAsync(CreatePatientDTO dto)
        {
            // Start a transaction for atomicity
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                // 1. Create User
                var user = new User
                {
                    Name = dto.Name,
                    Surname = dto.Surname,
                    ParentName = dto.ParentName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Address = dto.Address,
                    DateOfBirth = dto.DateOfBirth,
                    Gender = dto.Gender,
                    PersonalNumber = dto.PersonalNumber,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = UserRole.Patient
                };
                await _userRepository.AddUserAsync(user);

                // 2. Create Patient
                var patient = new Patient
                {
                    UserId = user.UserId // Will be set by EF after AddUserAsync
                };
                await _patientRepository.AddPatientAsync(patient);
                Console.WriteLine($"UserId being used for medical info: {user.UserId}");
                // 3. Add Medical Info
                var med = dto.MedicalInfo;
                var medicalInfo = new MedicalInfo
                {
                    UserId = user.UserId,
                    Allergies = med.Allergies,
                    Medications = med.Medications,
                    Smoking = med.Smoking,
                    Alcohol = med.Alcohol,
                    PhysicalActivity = med.PhysicalActivity
                };
                await _medicalInfoRepository.AddMedicalInfoAsync(medicalInfo);

                // 4. Add Family History (replace all)
                foreach (var fh in dto.FamilyHistory)
                {
                    var entry = new PatientFamilyHistory
                    {
                        PatientId = user.UserId,
                        HistoryId = fh.HistoryId,
                        OtherText = fh.OtherText
                    };
                    await _patientFamilyHistoryRepository.AddAsync(entry);
                }

                // 5. Add Chronic Diseases (replace all)
                foreach (var cd in dto.ChronicDiseases)
                {
                    var entry = new PatientChronicDisease
                    {
                        PatientId = user.UserId,
                        DiseaseId = cd.DiseaseId,
                        OtherText = cd.OtherText
                    };
                    await _patientChronicDiseaseRepository.AddAsync(entry);
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdatePatientAsync(int patientId, UpdatePatientDTO dto)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                // 1. Update User fields
                var user = await _userRepository.GetUserByIdAsync(patientId);
                if (user == null)
                    throw new Exception("User not found");

                user.Name = dto.Name;
                user.Surname = dto.Surname;
                user.ParentName = dto.ParentName;
                user.Email = dto.Email;
                user.Phone = dto.Phone;
                user.Address = dto.Address;
                user.DateOfBirth = dto.DateOfBirth;
                user.Gender = dto.Gender;
                user.PersonalNumber = dto.PersonalNumber;
                await _userRepository.UpdateUserAsync(user);

                // 2. Update or Replace Medical Info
                var med = await _medicalInfoRepository.GetMedicalInfoByPatientIdAsync(patientId);
                if (med != null && dto.MedicalInfo != null)
                {
                    med.Allergies = dto.MedicalInfo.Allergies;
                    med.Medications = dto.MedicalInfo.Medications;
                    med.Smoking = dto.MedicalInfo.Smoking;
                    med.Alcohol = dto.MedicalInfo.Alcohol;
                    med.PhysicalActivity = dto.MedicalInfo.PhysicalActivity;
                    await _medicalInfoRepository.UpdateMedicalInfoAsync(med);
                }
                else if (dto.MedicalInfo != null)
                {
                    // If not exists, create new
                    var newMed = new MedicalInfo
                    {
                        UserId = patientId,
                        Allergies = dto.MedicalInfo.Allergies,
                        Medications = dto.MedicalInfo.Medications,
                        Smoking = dto.MedicalInfo.Smoking,
                        Alcohol = dto.MedicalInfo.Alcohol,
                        PhysicalActivity = dto.MedicalInfo.PhysicalActivity
                    };
                    await _medicalInfoRepository.AddMedicalInfoAsync(newMed);
                }

                // 3. Replace Family History
                await _patientFamilyHistoryRepository.DeleteAllByPatientIdAsync(patientId);
                foreach (var fh in dto.FamilyHistory)
                {
                    var entry = new PatientFamilyHistory
                    {
                        PatientId = patientId,
                        HistoryId = fh.HistoryId,
                        OtherText = fh.OtherText
                    };
                    await _patientFamilyHistoryRepository.AddAsync(entry);
                }

                // 4. Replace Chronic Diseases
                await _patientChronicDiseaseRepository.DeleteAllByPatientIdAsync(patientId);
                foreach (var cd in dto.ChronicDiseases)
                {
                    var entry = new PatientChronicDisease
                    {
                        PatientId = patientId,
                        DiseaseId = cd.DiseaseId,
                        OtherText = cd.OtherText
                    };
                    await _patientChronicDiseaseRepository.AddAsync(entry);
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task UpdateUserFieldsAsync(int patientId, UpdateUserDTO dto)
        {
            var updated = new Patient
            {
                UserId = patientId,
                User = new User
                {
                    Name = dto.Name,
                    Surname = dto.Surname,
                    ParentName = dto.ParentName,
                    Phone = dto.Phone,
                    Email = dto.Email,
                    Address = dto.Address,
                    DateOfBirth = dto.DateOfBirth,
                    Gender = dto.Gender
                }
            };

            await _patientRepository.UpdatePatientAsync(updated);
        }

        public async Task DeletePatientAsync(int id)
        {
            await _patientRepository.DeletePatientAsync(id);
        }
    }
}
