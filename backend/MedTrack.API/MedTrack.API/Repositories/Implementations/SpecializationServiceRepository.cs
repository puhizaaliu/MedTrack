using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class SpecializationServiceRepository : ISpecializationServiceRepository
    {
        private readonly AppDbContext _context;

        public SpecializationServiceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Service>> GetServicesBySpecializationAsync(int specializationId)
        {
            var services = await _context.SpecializationServices
                .Where(ss => ss.SpecializationId == specializationId)
                .Include(ss => ss.Service)
                .Select(ss => ss.Service)
                .ToListAsync();

            return services;
        }

        public async Task AddServiceToSpecializationAsync(int specializationId, int serviceId)
        {
            var specializationService = new SpecializationService
            {
                SpecializationId = specializationId,
                ServiceId = serviceId
            };

            _context.SpecializationServices.Add(specializationService);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveServiceFromSpecializationAsync(int specializationId, int serviceId)
        {
            var specializationService = await _context.SpecializationServices
                .FirstOrDefaultAsync(ss => ss.SpecializationId == specializationId && ss.ServiceId == serviceId);

            if (specializationService != null)
            {
                _context.SpecializationServices.Remove(specializationService);
                await _context.SaveChangesAsync();
            }
        }
    }
}
