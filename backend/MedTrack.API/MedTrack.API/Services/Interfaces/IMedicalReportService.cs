using System.Collections.Generic;
using System.Threading.Tasks;
using MedTrack.API.DTOs;

namespace MedTrack.API.Services.Interfaces
{
    public interface IMedicalReportService
    {
        Task<IEnumerable<MedicalReportDTO>> GetAllAsync();
        Task<MedicalReportDTO?> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateMedicalReportDTO dto);
        Task UpdateAsync(string id, UpdateMedicalReportDto dto);
        Task DeleteAsync(string id);
    }
}
