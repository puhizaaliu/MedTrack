using AutoMapper;
using MedTrack.API.Data;
using MedTrack.API.DTOs.Appointments; 
using MedTrack.API.DTOs.Doctor; 
using MedTrack.API.DTOs.FamilyHistory;
using MedTrack.API.DTOs.MedicalInfo;
using MedTrack.API.DTOs.MedicalReport;
using MedTrack.API.DTOs.Patient;     
using MedTrack.API.DTOs.PatientChronicDisease;
using MedTrack.API.Models;      
using MedTrack.API.MongoModels;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class MedicalReportService : IMedicalReportService
    {
        private readonly IMedicalReportRepository _repository;
        private readonly AppDbContext _sql;       
        private readonly IMapper _mapper;

        public MedicalReportService(
            IMedicalReportRepository repository,
             AppDbContext sqlContext,
            IMapper mapper)
        {
            _repository = repository;
              _sql = sqlContext;
            _mapper = mapper;
        }


        public async Task<IEnumerable<MedicalReportDTO>> GetAllAsync()
        {
            var reports = await _repository.GetAllAsync();
            var appointmentIds = reports.Select(r => r.AppointmentId).ToList();

            // Get appointments and include patient -> user
            var appointments = await _sql.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Where(a => appointmentIds.Contains(a.AppointmentId))
                .ToListAsync();

            // Create lookup to avoid N+1
            var appointmentLookup = appointments.ToDictionary(a => a.AppointmentId);

            var dtos = new List<MedicalReportDTO>();

            foreach (var report in reports)
            {
                var dto = _mapper.Map<MedicalReportDTO>(report);

                if (appointmentLookup.TryGetValue(report.AppointmentId, out var appt))
                {
                    dto.PatientName = appt.Patient?.User?.Name;
                    dto.PatientSurname = appt.Patient?.User?.Surname;
                    dto.DoctorName = appt.Doctor?.User?.Name;
                    dto.DoctorSurname = appt.Doctor?.User?.Surname;
                }

                dtos.Add(dto);
            }

            return dtos;
        }

        public async Task<MedicalReportDetailDTO?> GetByIdAsync(string id)
        {
            // 1) Fetch the raw report from MongoDB
            var report = await _repository.GetByIdAsync(id);
            if (report == null)
                return null;

            // 2) Load the appointment with all related data
            var appt = await _sql.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.MedicalInfo)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.FamilyHistories)
                .Include(a => a.Patient)
                    .ThenInclude(p => p.ChronicDiseases)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Specialization)
                .Include(a => a.Service)
                .FirstOrDefaultAsync(a => a.AppointmentId == report.AppointmentId);

            if (appt == null)
                return null;

            // 3) Project into your detail DTO
            return new MedicalReportDetailDTO
            {
                Report = _mapper.Map<MedicalReportDTO>(report),

                Appointment = new AppointmentDTO  // :contentReference[oaicite:0]{index=0}
                {
                    AppointmentId = appt.AppointmentId,
                    PatientId = appt.PatientId,
                    PatientName = appt.Patient.User.Name,
                    PatientSurname = appt.Patient.User.Surname,
                    DoctorId = appt.DoctorId,
                    DoctorName = appt.Doctor.User.Name,
                    DoctorSurname = appt.Doctor.User.Surname,
                    ServiceId = appt.ServiceId,
                    ServiceName = appt.Service.Name,
                    Date = appt.Date,
                    Time = appt.Time,
                    Status = appt.Status
                },

                Patient = new PatientDTO    // :contentReference[oaicite:1]{index=1}
                {
                    UserId = appt.PatientId,
                    Name = appt.Patient.User.Name,
                    Surname = appt.Patient.User.Surname,
                    ParentName = appt.Patient.User.ParentName,
                    Phone = appt.Patient.User.Phone,
                    Email = appt.Patient.User.Email,
                    Address = appt.Patient.User.Address,
                    DateOfBirth = appt.Patient.User.DateOfBirth,
                    Gender = appt.Patient.User.Gender,
                    MedicalInfo = _mapper.Map<MedicalInfoDTO>(appt.Patient.MedicalInfo),
                    FamilyHistory = _mapper.Map<List<FamilyHistoryDTO>>(appt.Patient.FamilyHistories),
                    ChronicDiseases = _mapper.Map<List<PatientChronicDiseaseDTO>>(appt.Patient.ChronicDiseases)
                },

                Doctor = new DoctorDTO      // :contentReference[oaicite:2]{index=2}
                {
                    UserId = appt.DoctorId,
                    Name = appt.Doctor.User.Name,
                    Surname = appt.Doctor.User.Surname,
                    Phone = appt.Doctor.User.Phone,
                    Email = appt.Doctor.User.Email,
                    SpecializationId = appt.Doctor.SpecializationId,
                    SpecializationName = appt.Doctor.Specialization.Name
                }
            };
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
