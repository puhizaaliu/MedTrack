using MedTrack.API.Config;
using MedTrack.API.Data;
using MedTrack.API.Repositories.Implementations;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Implementations;
using MedTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Text.Json.Serialization;
using MongoServerVersion = MongoDB.Driver.ServerVersion;
using ServerVersion = Microsoft.EntityFrameworkCore.ServerVersion;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MedTrack.API.Hubs;


var builder = WebApplication.CreateBuilder(args);
// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IMedicalInfoRepository, MedicalInfoRepository>();
builder.Services.AddScoped<IFamilyHistoryRepository, FamilyHistoryRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<ISpecializationRepository, SpecializationRepository>();
builder.Services.AddScoped<ISpecializationServiceRepository, SpecializationServiceRepository>();
builder.Services.AddScoped<IPatientFamilyHistoryRepository, PatientFamilyHistoryRepository>();
builder.Services.AddScoped<IMedicalReportRepository, MedicalReportRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IMedicalInfoService, MedicalInfoService>();
builder.Services.AddScoped<IFamilyHistoryService, FamilyHistoryService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<ISpecializationService, SpecializationService>();
builder.Services.AddScoped<ISpecializationServiceService, SpecializationServiceService>();
builder.Services.AddScoped<IPatientFamilyHistoryService, PatientFamilyHistoryService>();
builder.Services.AddScoped<IMedicalReportService, MedicalReportService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();


// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Controllers & JSON options
builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
        opts.JsonSerializerOptions.Converters.Add(
          new JsonStringEnumConverter()));


// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Konfigurimi për DbContext (MySQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Konfigurimi i MongoDBSettings
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

//MongoClient
builder.Services.AddSingleton<IMongoClient>(s =>
{
    var settings = s.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

//JWT 
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services
  .AddAuthentication(options =>
  {
      options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  })
  .AddJwtBearer(options =>
  {
      options.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer = true,
          ValidIssuer = jwtSettings["Issuer"],
          ValidateAudience = true,
          ValidAudience = jwtSettings["Audience"],
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ValidateLifetime = true,
          ClockSkew = TimeSpan.FromSeconds(30)
      };
  });

builder.Services.AddAuthorization();

// Register SignalR - per notifications
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
  options.AddDefaultPolicy(policy =>
    policy
      .WithOrigins("http://localhost:5173")  // your Vite dev URL
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials()
  )
);

// build app
var app = builder.Build();

//HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseCors();
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
