using AutoMapper;
using MedTrack.API.DTOs;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class PatientFamilyHistoryService : IPatientFamilyHistoryService
    {
        private readonly IPatientFamilyHistoryRepository _repository;
        private readonly IMapper _mapper;

        public PatientFamilyHistoryService(IPatientFamilyHistoryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PatientFamilyHistoryDTO>> GetByPatientIdAsync(int patientId)
        {
            var pfhList = await _repository.GetByPatientIdAsync(patientId);
            return _mapper.Map<IEnumerable<PatientFamilyHistoryDTO>>(pfhList);
        }

        public async Task AddAsync(CreatePatientFamilyHistoryDTO dto)
        {
            var pfh = _mapper.Map<PatientFamilyHistory>(dto);
            await _repository.AddAsync(pfh);
        }

        public async Task RemoveAsync(int patientId, int historyId)
        {
            await _repository.RemoveAsync(patientId, historyId);
        }
    }
}
