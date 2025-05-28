using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace MedTrack.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TestEntity> TestEntities { get; set; }
    }

    public class TestEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
