using MedTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MedTrack.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<SpecializationService> SpecializationServices { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<MedicalInfo> MedicalInfos { get; set; }
        public DbSet<ChronicDisease> ChronicDiseases { get; set; }
        public DbSet<PatientChronicDisease> PatientChronicDiseases { get; set; }
        public DbSet<FamilyHistory> FamilyHistories { get; set; }
        public DbSet<PatientFamilyHistory> PatientFamilyHistories { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // DOCTOR
            modelBuilder.Entity<Doctor>()
                .HasKey(d => d.UserId);

            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.User)
                .WithOne()
                .HasForeignKey<Doctor>(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // PATIENT
            modelBuilder.Entity<Patient>()
                .HasKey(p => p.UserId);

            modelBuilder.Entity<Patient>()
                .HasOne(p => p.User)
                .WithOne()
                .HasForeignKey<Patient>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // MEDICAL INFO
            modelBuilder.Entity<MedicalInfo>()
                .HasOne(mi => mi.Patient)
                .WithOne(p => p.MedicalInfo)
                .HasForeignKey<MedicalInfo>(mi => mi.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // PATIENT - CHRONIC DISEASE
            modelBuilder.Entity<PatientChronicDisease>()
                .HasKey(pcd => new { pcd.PatientId, pcd.DiseaseId });

            modelBuilder.Entity<PatientChronicDisease>()
                .HasOne(pcd => pcd.Patient)
                .WithMany()
                .HasForeignKey(pcd => pcd.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatientChronicDisease>()
                .HasOne(pcd => pcd.Disease)
                .WithMany()
                .HasForeignKey(pcd => pcd.DiseaseId)
                .OnDelete(DeleteBehavior.Cascade);

            // PATIENT - FAMILY HISTORY
            modelBuilder.Entity<PatientFamilyHistory>()
                .HasKey(pfh => new { pfh.PatientId, pfh.HistoryId });

            modelBuilder.Entity<PatientFamilyHistory>()
                .HasOne(pfh => pfh.Patient)
                .WithMany()
                .HasForeignKey(pfh => pfh.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatientFamilyHistory>()
                .HasOne(pfh => pfh.History)
                .WithMany()
                .HasForeignKey(pfh => pfh.HistoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // SPECIALIZATION - SERVICE
            modelBuilder.Entity<SpecializationService>()
                .HasKey(ss => new { ss.SpecializationId, ss.ServiceId });

            modelBuilder.Entity<SpecializationService>()
                .HasOne(ss => ss.Specialization)
                .WithMany(s => s.SpecializationServices)
                .HasForeignKey(ss => ss.SpecializationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SpecializationService>()
                .HasOne(ss => ss.Service)
                .WithMany(s => s.SpecializationServices)
                .HasForeignKey(ss => ss.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            //APPOINTMENT STATUS
            modelBuilder.Entity<Appointment>()
                .Property(a => a.Status)
                .HasConversion<string>();

            //INVOICE
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Appointment)
                .WithOne()
                .HasForeignKey<Invoice>(i => i.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Invoice>()
                .Property(i => i.Method)
                .HasConversion<string>(); // Enum stored as string


        }
    }
}
