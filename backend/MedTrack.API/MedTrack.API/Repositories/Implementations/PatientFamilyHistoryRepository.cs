using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class PatientFamilyHistoryRepository : IPatientFamilyHistoryRepository
    {
        private readonly AppDbContext _context;

        public PatientFamilyHistoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PatientFamilyHistory>> GetByPatientIdAsync(int patientId)
        {
            return await _context.PatientFamilyHistories
                .Include(pfh => pfh.History)
                .Where(pfh => pfh.PatientId == patientId)
                .ToListAsync();
        }

        public async Task AddAsync(PatientFamilyHistory patientFamilyHistory)
        {
            await _context.PatientFamilyHistories.AddAsync(patientFamilyHistory);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(int patientId, int historyId)
        {
            var pfh = await _context.PatientFamilyHistories
                .FirstOrDefaultAsync(p => p.PatientId == patientId && p.HistoryId == historyId);

            if (pfh != null)
            {
                _context.PatientFamilyHistories.Remove(pfh);
                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteAllByPatientIdAsync(int patientId)
        {
            var toDelete = _context.PatientFamilyHistories.Where(x => x.PatientId == patientId);
            _context.PatientFamilyHistories.RemoveRange(toDelete);
            await _context.SaveChangesAsync();
        }

    }
}
