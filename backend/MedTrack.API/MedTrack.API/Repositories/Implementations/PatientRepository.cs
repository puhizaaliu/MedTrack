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
            // 1) Nxjerrim të gjithë pacientët me User +MedicalInfo
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

            // 4) Për secilin pacient, ndërtojmë listën e PFH + History
            foreach (var p in patients)
            {
                // Gjejmë të gjitha rreshtat ku PatientId = p.UserId
                var listPfhs = allPfhs
                    .Where(pfh => pfh.PatientId == p.UserId)
                    .ToList();
                // Për secilin PFH, vendosim çfarë “History” i takon
                foreach (var pfh in listPfhs)
                {
                    if (allHistories.TryGetValue(pfh.HistoryId, out var fh))
                    {
                        pfh.History = fh;
                    }
                }
                // Caktojmë koleksionin në vetë entitetin Patient
                p.FamilyHistories = listPfhs;
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

            // 3) Për secilin PFH, ngarkojmë entitetin FamilyHistory
            foreach (var pfh in pfhs)
            {
                pfh.History = await _context.FamilyHistories
                    .AsNoTracking()
                    .FirstOrDefaultAsync(fh => fh.HistoryId == pfh.HistoryId);
            }

            patient.FamilyHistories = pfhs;
            return patient;
        }

        public async Task AddPatientAsync(Patient patient)
        {
            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePatientAsync(Patient patient)
        {
            _context.Patients.Update(patient);
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
