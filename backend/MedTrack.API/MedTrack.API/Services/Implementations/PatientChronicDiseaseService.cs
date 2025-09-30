using AutoMapper;
using MedTrack.API.DTOs.ChronicDisease;
using MedTrack.API.DTOs.PatientChronicDisease;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;

namespace MedTrack.API.Services.Implementations
{
    public class PatientChronicDiseaseService : IPatientChronicDiseaseService
    {
        private readonly IPatientChronicDiseaseRepository _repo;
        private readonly IMapper _mapper;
        public PatientChronicDiseaseService(
            IPatientChronicDiseaseRepository repo,
            IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PatientChronicDiseaseDTO>> GetByPatientIdAsync(int patientId)
        {
            var links = await _repo.GetByPatientIdAsync(patientId);
            return _mapper.Map<IEnumerable<PatientChronicDiseaseDTO>>(links);
        }

        public async Task AddAsync(CreatePatientChronicDiseaseDTO dto)
        {
            var link = _mapper.Map<PatientChronicDisease>(dto);
            link.PatientId = dto.PatientId;
            await _repo.AddAsync(link);
        }

        //public async Task UpdateAsync(int patientId, int diseaseId, UpdatePatientChronicDiseaseDTO dto)
        //{
        //    var all = await _repo.GetByPatientIdAsync(patientId);
        //    var link = all.FirstOrDefault(x => x.DiseaseId == diseaseId);
        //    if (link == null) throw new KeyNotFoundException();
        //    _mapper.Map(dto, link);
        //    await _repo.UpdateAsync(link);
        //}

        public async Task RemoveAsync(int patientId, int diseaseId) =>
            await _repo.RemoveAsync(patientId, diseaseId);
    }

}
