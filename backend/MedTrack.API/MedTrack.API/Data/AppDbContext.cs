﻿using MedTrack.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace MedTrack.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

    }
}
