using MedTrack.API.MongoModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IMedicalReportRepository
    {
        
        Task<IEnumerable<MedicalReport>> GetAllAsync();
        Task<MedicalReport?> GetByIdAsync(string id);
        Task CreateAsync(MedicalReport report);
        Task UpdateAsync(string id, MedicalReport report);
        Task DeleteAsync(string id);
    }
}
