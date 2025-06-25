using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace MedTrack.API.Repositories.Implementations
{
    public class PatientRepository : IPatientRepository
    {
        private readonly AppDbContext _context;

        public PatientRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            // 1) Nxjerrim të gjithë pacientët me User + MedicalInfo
            var patients = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.MedicalInfo)
                .ToListAsync();

            // 2) Nxjerrim të gjitha lidhjet PatientFamilyHistory nga DB
            var allPfhs = await _context.PatientFamilyHistories
                .AsNoTracking()
                .ToListAsync();

            // 3) Nxjerrim të gjitha rreshtat FamilyHistory në një dictionary për lookup
            var allHistories = await _context.FamilyHistories
                .AsNoTracking()
                .ToDictionaryAsync(fh => fh.HistoryId);

            // 4) Nxjerrim të gjitha lidhjet PatientChronicDisease nga DB
            var allPcds = await _context.PatientChronicDiseases
                .AsNoTracking()
                .ToListAsync();

            // 5) Nxjerrim të gjitha rreshtat ChronicDisease në një dictionary për lookup
            var allChronicDiseases = await _context.ChronicDiseases
                .AsNoTracking()
                .ToDictionaryAsync(cd => cd.DiseaseId);

            // 6) Për secilin pacient, ndërtojmë listën PFH + History dhe PCD + ChronicDisease
            foreach (var p in patients)
            {
                // Family history
                var listPfhs = allPfhs
                    .Where(pfh => pfh.PatientId == p.UserId)
                    .ToList();
                foreach (var pfh in listPfhs)
                {
                    if (allHistories.TryGetValue(pfh.HistoryId, out var fh))
                    {
                        pfh.History = fh;
                    }
                }
                p.FamilyHistories = listPfhs;

                // Chronic diseases
                var listPcds = allPcds
                    .Where(pcd => pcd.PatientId == p.UserId)
                    .ToList();
                foreach (var pcd in listPcds)
                {
                    if (allChronicDiseases.TryGetValue(pcd.DiseaseId, out var cd))
                    {
                        pcd.Disease = cd;
                    }
                }
                p.ChronicDiseases = listPcds;
            }

            return patients;
        }

        public async Task<Patient?> GetPatientByIdAsync(int userId)
        {
            // 1) Nxjerrim vetëm një pacient me User + MedicalInfo
            var patient = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.MedicalInfo)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return null;

            // 2) Nxjerrim rreshtat PFH vetëm për atë pacient
            var pfhs = await _context.PatientFamilyHistories
                .Where(pfh => pfh.PatientId == userId)
                .AsNoTracking()
                .ToListAsync();

            foreach (var pfh in pfhs)
            {
                pfh.History = await _context.FamilyHistories
                    .AsNoTracking()
                    .FirstOrDefaultAsync(fh => fh.HistoryId == pfh.HistoryId);
            }
            patient.FamilyHistories = pfhs;

            // 3) Nxjerrim rreshtat PatientChronicDisease për atë pacient
            var pcds = await _context.PatientChronicDiseases
                .Where(pcd => pcd.PatientId == userId)
                .AsNoTracking()
                .ToListAsync();

            foreach (var pcd in pcds)
            {
                pcd.Disease = await _context.ChronicDiseases
                    .AsNoTracking()
                    .FirstOrDefaultAsync(cd => cd.DiseaseId == pcd.DiseaseId);
            }
            patient.ChronicDiseases = pcds;

            return patient;
        }

        public async Task AddPatientAsync(Patient patient)
        {
            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePatientAsync(Patient updatedPatient)
        {
            var existing = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == updatedPatient.UserId);

            if (existing == null) throw new Exception("Patient not found");

            // Copy over fields:
            existing.User.Name = updatedPatient.User.Name;
            existing.User.Surname = updatedPatient.User.Surname;
            existing.User.ParentName = updatedPatient.User.ParentName;
            existing.User.Phone = updatedPatient.User.Phone;
            existing.User.Email = updatedPatient.User.Email;
            existing.User.Address = updatedPatient.User.Address;
            existing.User.DateOfBirth = updatedPatient.User.DateOfBirth;
            existing.User.Gender = updatedPatient.User.Gender;

            // Don’t touch any collections or other tables
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
            }
        }
    }
}
