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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Doctor: UserId is both PK and FK
            modelBuilder.Entity<Doctor>()
                .HasKey(d => d.UserId);

            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.User)
                .WithOne()
                .HasForeignKey<Doctor>(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Composite key for SpecializationService
            modelBuilder.Entity<SpecializationService>()
                .HasKey(ss => new { ss.SpecializationId, ss.ServiceId });
        }
    }
}
