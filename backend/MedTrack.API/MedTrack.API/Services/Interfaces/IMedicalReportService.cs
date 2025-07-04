﻿using System.Collections.Generic;
using System.Threading.Tasks;
using MedTrack.API.DTOs.MedicalReport;

namespace MedTrack.API.Services.Interfaces
{
    public interface IMedicalReportService
    {
        Task<IEnumerable<MedicalReportDTO>> GetAllAsync();
        Task<MedicalReportDetailDTO?> GetByIdAsync(string id);
        Task<string> CreateAsync(CreateMedicalReportDTO dto);
        Task UpdateAsync(string id, UpdateMedicalReportDto dto);
        Task DeleteAsync(string id);
    }
}
