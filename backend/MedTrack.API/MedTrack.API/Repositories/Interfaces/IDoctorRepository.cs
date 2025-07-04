﻿using MedTrack.API.DTOs.Doctor;
using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IDoctorRepository
    {
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
        Task<Doctor?> GetDoctorByIdAsync(int id);
        Task AddDoctorAsync(Doctor doctor);
        Task UpdateDoctorAsync(Doctor doctor);
        Task DeleteDoctorAsync(int id);
        Task DeleteDoctorByUserIdAsync(int userId);
        Task<IEnumerable<Doctor>> GetDoctorsBySpecializationIdAsync(int specializationId);
        Task<List<DoctorDTO>> GetDoctorsByServiceAsync(int serviceId);

    }
}
