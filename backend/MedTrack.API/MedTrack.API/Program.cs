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
using Microsoft.OpenApi.Models;

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
builder.Services.AddScoped<IChronicDiseaseRepository, ChronicDiseaseRepository>();
builder.Services.AddScoped<IPatientChronicDiseaseRepository, PatientChronicDiseaseRepository>();

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
builder.Services.AddScoped<IChronicDiseaseService, ChronicDiseaseService>();
builder.Services.AddScoped<IPatientChronicDiseaseService, PatientChronicDiseaseService>();

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
//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    // (Optional) if you haven’t already, register your Swagger doc here:
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MedTrack API", Version = "v1" });

    // Add JWT Bearer Authorization to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT token like: Bearer eyJhbGciOiJI…"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            Array.Empty<string>()
        }
    });
});

// DbContext (MySQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// MongoDB settings
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// MongoClient
builder.Services.AddSingleton<IMongoClient>(s =>
{
    var settings = s.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

// JWT Authentication
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

      // ** this is for SignalR to negotiate ***
      options.Events = new JwtBearerEvents
      {
          OnMessageReceived = context =>
          {
              // look for token in query string for hub requests
              var accessToken = context.Request.Query["access_token"];
              var path = context.HttpContext.Request.Path;
              if (!string.IsNullOrEmpty(accessToken) &&
                  path.StartsWithSegments("/hubs/notifications"))
              {
                  context.Token = accessToken;
              }
              return Task.CompletedTask;
          }
      };
  });

builder.Services.AddAuthorization();

// SignalR for notifications
builder.Services.AddSignalR();

// CORS policy to allow your Vite dev server and SignalR
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("https://localhost:5173") // Your frontend URL/port
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
//CORS must come before anything that handles requests
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map SignalR hub
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();
