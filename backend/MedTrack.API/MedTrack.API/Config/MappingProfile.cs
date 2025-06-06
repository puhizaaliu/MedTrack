using AutoMapper;
using MedTrack.API.DTOs;
using MedTrack.API.Models;
using MedTrack.API.MongoModels;

namespace MedTrack.API.Config
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<CreateUserDTO, User>();
            CreateMap<UpdateUserDTO, User>();

            // Doctor
            CreateMap<Doctor, DoctorDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.Surname, opt => opt.MapFrom(src => src.User.Surname))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.SpecializationName, opt => opt.MapFrom(src => src.Specialization.Name));
            CreateMap<UpdateDoctorDTO, Doctor>();

            // Patient
            CreateMap<Patient, PatientDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.Surname, opt => opt.MapFrom(src => src.User.Surname))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.User.Address))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.User.DateOfBirth))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.User.Gender))
                .ForMember(dest => dest.MedicalInfo, opt => opt.MapFrom(src => src.MedicalInfo))
                .ForMember(dest => dest.FamilyHistory, opt => opt.MapFrom(src =>
                    src.FamilyHistories
                        .Where(fh => fh.History != null)
                        .Select(fh => new FamilyHistoryDTO
                        {
                            HistoryId = fh.History.HistoryId,
                            ConditionName = fh.History.ConditionName
                        })));

            // MedicalInfo
            CreateMap<MedicalInfo, MedicalInfoDTO>().ReverseMap();
            CreateMap<CreateMedicalInfoDTO, MedicalInfo>();
            CreateMap<UpdateMedicalInfoDTO, MedicalInfo>();

            // FamilyHistory
            CreateMap<FamilyHistory, FamilyHistoryDTO>().ReverseMap();
            CreateMap<CreateFamilyHistoryDTO, FamilyHistory>();
            CreateMap<UpdateFamilyHistoryDTO, FamilyHistory>();

            // Appointment
            CreateMap<Appointment, AppointmentDTO>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.User.Name))
                .ForMember(dest => dest.PatientSurname, opt => opt.MapFrom(src => src.Patient.User.Surname))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor.User.Name))
                .ForMember(dest => dest.DoctorSurname, opt => opt.MapFrom(src => src.Doctor.User.Surname))
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name));
            CreateMap<CreateAppointmentDTO, Appointment>();
            CreateMap<UpdateAppointmentDTO, Appointment>();

            CreateMap<Invoice, InvoiceDTO>()
             .ForMember(dest => dest.PatientName,
                        opt => opt.MapFrom(src => src.Appointment.Patient.User.Name))
             .ForMember(dest => dest.PatientSurname,
                        opt => opt.MapFrom(src => src.Appointment.Patient.User.Surname))
             .ForMember(dest => dest.DoctorName,
                        opt => opt.MapFrom(src => src.Appointment.Doctor.User.Name))
             .ForMember(dest => dest.DoctorSurname,
                        opt => opt.MapFrom(src => src.Appointment.Doctor.User.Surname))
             .ForMember(dest => dest.ServiceName,
                        opt => opt.MapFrom(src => src.Appointment.Service.Name))
             .ForMember(dest => dest.ServiceId,
                        opt => opt.MapFrom(src => src.Appointment.Service.ServiceId));

            // Service
            CreateMap<Service, ServiceDTO>().ReverseMap();

            // Specialization
            CreateMap<Specialization, SpecializationDTO>().ReverseMap();

            // SpecializationService
            CreateMap<SpecializationService, SpecializationServiceDTO>()
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name));
            
            // Patient Family History
            CreateMap<CreatePatientFamilyHistoryDTO, PatientFamilyHistory>();
            CreateMap<PatientFamilyHistory, PatientFamilyHistoryDTO>()
                .ForMember(dest => dest.ConditionName, opt => opt.MapFrom(src => src.History.ConditionName));

            // Medical Report
            CreateMap<MedicalReport, MedicalReportDTO>();
            CreateMap<CreateMedicalReportDTO, MedicalReport>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
            CreateMap<UpdateMedicalReportDto, MedicalReport>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        }
    }
}
