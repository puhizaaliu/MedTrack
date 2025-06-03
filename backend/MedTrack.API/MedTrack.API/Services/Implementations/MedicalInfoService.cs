using AutoMapper;
using MedTrack.API.DTOs;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class MedicalInfoService : IMedicalInfoService
    {
        private readonly IMedicalInfoRepository _medicalInfoRepository;
        private readonly IMapper _mapper;

        public MedicalInfoService(IMedicalInfoRepository medicalInfoRepository, IMapper mapper)
        {
            _medicalInfoRepository = medicalInfoRepository;
            _mapper = mapper;
        }

        public async Task<MedicalInfoDTO?> GetMedicalInfoByPatientIdAsync(int patientId)
        {
            var medicalInfo = await _medicalInfoRepository.GetMedicalInfoByPatientIdAsync(patientId);
            return medicalInfo == null ? null : _mapper.Map<MedicalInfoDTO>(medicalInfo);
        }

        public async Task AddMedicalInfoAsync(CreateMedicalInfoDTO medicalInfoDto)
        {
            var medicalInfo = _mapper.Map<MedicalInfo>(medicalInfoDto);
            await _medicalInfoRepository.AddMedicalInfoAsync(medicalInfo);
        }

        public async Task UpdateMedicalInfoAsync(int id, UpdateMedicalInfoDTO medicalInfoDto)
        {
            var existingInfo = await _medicalInfoRepository.GetMedicalInfoByPatientIdAsync(id);
            if (existingInfo == null) throw new Exception("MedicalInfo not found");

            _mapper.Map(medicalInfoDto, existingInfo);
            await _medicalInfoRepository.UpdateMedicalInfoAsync(existingInfo);
        }

        public async Task DeleteMedicalInfoAsync(int id)
        {
            await _medicalInfoRepository.DeleteMedicalInfoAsync(id);
        }
    }
}
