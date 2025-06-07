using AutoMapper;
using MedTrack.API.DTOs.Specialization;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class SpecializationService : ISpecializationService
    {
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IMapper _mapper;

        public SpecializationService(ISpecializationRepository specializationRepository, IMapper mapper)
        {
            _specializationRepository = specializationRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SpecializationDTO>> GetAllSpecializationsAsync()
        {
            var specializations = await _specializationRepository.GetAllSpecializationsAsync();
            return _mapper.Map<IEnumerable<SpecializationDTO>>(specializations);
        }

        public async Task<SpecializationDTO?> GetSpecializationByIdAsync(int id)
        {
            var specialization = await _specializationRepository.GetSpecializationByIdAsync(id);
            return specialization == null ? null : _mapper.Map<SpecializationDTO>(specialization);
        }

        public async Task AddSpecializationAsync(SpecializationDTO specializationDto)
        {
            var specialization = _mapper.Map<Specialization>(specializationDto);
            await _specializationRepository.AddSpecializationAsync(specialization);
        }

        public async Task UpdateSpecializationAsync(int id, SpecializationDTO specializationDto)
        {
            var existingSpecialization = await _specializationRepository.GetSpecializationByIdAsync(id);
            if (existingSpecialization == null) throw new Exception("Specialization not found");

            _mapper.Map(specializationDto, existingSpecialization);
            await _specializationRepository.UpdateSpecializationAsync(existingSpecialization);
        }

        public async Task DeleteSpecializationAsync(int id)
        {
            await _specializationRepository.DeleteSpecializationAsync(id);
        }
    }
}
