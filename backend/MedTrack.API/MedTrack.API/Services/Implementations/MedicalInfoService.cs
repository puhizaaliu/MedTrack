using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class MedicalInfoService : IMedicalInfoService
    {
        private readonly IMedicalInfoRepository _medicalInfoRepository;

        public MedicalInfoService(IMedicalInfoRepository medicalInfoRepository)
        {
            _medicalInfoRepository = medicalInfoRepository;
        }

        public async Task<MedicalInfo?> GetMedicalInfoByPatientIdAsync(int patientId)
        {
            return await _medicalInfoRepository.GetMedicalInfoByPatientIdAsync(patientId);
        }

        public async Task AddMedicalInfoAsync(MedicalInfo medicalInfo)
        {
            await _medicalInfoRepository.AddMedicalInfoAsync(medicalInfo);
        }

        public async Task UpdateMedicalInfoAsync(MedicalInfo medicalInfo)
        {
            await _medicalInfoRepository.UpdateMedicalInfoAsync(medicalInfo);
        }

        public async Task DeleteMedicalInfoAsync(int id)
        {
            await _medicalInfoRepository.DeleteMedicalInfoAsync(id);
        }
    }
}
