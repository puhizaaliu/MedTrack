using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class FamilyHistoryRepository : IFamilyHistoryRepository
    {
        private readonly AppDbContext _context;

        public FamilyHistoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FamilyHistory>> GetAllFamilyHistoriesAsync()
        {
            return await _context.FamilyHistories.ToListAsync();
        }

        public async Task<FamilyHistory?> GetFamilyHistoryByIdAsync(int id)
        {
            return await _context.FamilyHistories.FindAsync(id);
        }

        public async Task AddFamilyHistoryAsync(FamilyHistory familyHistory)
        {
            await _context.FamilyHistories.AddAsync(familyHistory);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateFamilyHistoryAsync(FamilyHistory familyHistory)
        {
            _context.FamilyHistories.Update(familyHistory);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFamilyHistoryAsync(int id)
        {
            var familyHistory = await _context.FamilyHistories.FindAsync(id);
            if (familyHistory != null)
            {
                _context.FamilyHistories.Remove(familyHistory);
                await _context.SaveChangesAsync();
            }
        }
    }
}
