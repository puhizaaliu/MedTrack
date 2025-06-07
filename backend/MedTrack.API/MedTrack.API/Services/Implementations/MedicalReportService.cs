using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MedTrack.API.DTOs.MedicalReport;
using MedTrack.API.MongoModels;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;

namespace MedTrack.API.Services.Implementations
{
    public class MedicalReportService : IMedicalReportService
    {
        private readonly IMedicalReportRepository _repository;
        private readonly IMapper _mapper;

        public MedicalReportService(
            IMedicalReportRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MedicalReportDTO>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<MedicalReportDTO>>(entities);
        }

        public async Task<MedicalReportDTO?> GetByIdAsync(string id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                return null;
            return _mapper.Map<MedicalReportDTO>(entity);
        }

        public async Task<string> CreateAsync(CreateMedicalReportDTO dto)
        {
            var entity = _mapper.Map<MedicalReport>(dto);
            
            entity.CreatedAt = DateTime.UtcNow;
            
            await _repository.CreateAsync(entity);
            
            return entity.Id;
        }

        public async Task UpdateAsync(string id, UpdateMedicalReportDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"MedicalReport me Id = {id} nuk u gjet.");

            _mapper.Map(dto, existing);

            existing.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(id, existing);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
