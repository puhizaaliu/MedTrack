using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChronicDiseases",
                columns: table => new
                {
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiseaseName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronicDiseases", x => x.DiseaseId);
                });

            migrationBuilder.CreateTable(
                name: "FamilyHistories",
                columns: table => new
                {
                    HistoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConditionName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyHistories", x => x.HistoryId);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    ServiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.ServiceId);
                });

            migrationBuilder.CreateTable(
                name: "Specializations",
                columns: table => new
                {
                    SpecializationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specializations", x => x.SpecializationId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PersonalNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "SpecializationServices",
                columns: table => new
                {
                    SpecializationId = table.Column<int>(type: "int", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecializationServices", x => new { x.SpecializationId, x.ServiceId });
                    table.ForeignKey(
                        name: "FK_SpecializationServices_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SpecializationServices_Specializations_SpecializationId",
                        column: x => x.SpecializationId,
                        principalTable: "Specializations",
                        principalColumn: "SpecializationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SpecializationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Doctors_Specializations_SpecializationId",
                        column: x => x.SpecializationId,
                        principalTable: "Specializations",
                        principalColumn: "SpecializationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Doctors_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Patients_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Expires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Revoked = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    AppointmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Time = table.Column<TimeOnly>(type: "time", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.AppointmentId);
                    table.ForeignKey(
                        name: "FK_Appointments_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalInfos",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Allergies = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Medications = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Smoking = table.Column<bool>(type: "bit", nullable: false),
                    Alcohol = table.Column<bool>(type: "bit", nullable: false),
                    PhysicalActivity = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalInfos", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_MedicalInfos_Patients_UserId",
                        column: x => x.UserId,
                        principalTable: "Patients",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientChronicDiseases",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false),
                    OtherText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChronicDiseaseDiseaseId = table.Column<int>(type: "int", nullable: true),
                    PatientUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientChronicDiseases", x => new { x.PatientId, x.DiseaseId });
                    table.ForeignKey(
                        name: "FK_PatientChronicDiseases_ChronicDiseases_ChronicDiseaseDiseaseId",
                        column: x => x.ChronicDiseaseDiseaseId,
                        principalTable: "ChronicDiseases",
                        principalColumn: "DiseaseId");
                    table.ForeignKey(
                        name: "FK_PatientChronicDiseases_ChronicDiseases_DiseaseId",
                        column: x => x.DiseaseId,
                        principalTable: "ChronicDiseases",
                        principalColumn: "DiseaseId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientChronicDiseases_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientChronicDiseases_Patients_PatientUserId",
                        column: x => x.PatientUserId,
                        principalTable: "Patients",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "PatientFamilyHistories",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    HistoryId = table.Column<int>(type: "int", nullable: false),
                    OtherText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyHistoryHistoryId = table.Column<int>(type: "int", nullable: true),
                    PatientUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientFamilyHistories", x => new { x.PatientId, x.HistoryId });
                    table.ForeignKey(
                        name: "FK_PatientFamilyHistories_FamilyHistories_FamilyHistoryHistoryId",
                        column: x => x.FamilyHistoryHistoryId,
                        principalTable: "FamilyHistories",
                        principalColumn: "HistoryId");
                    table.ForeignKey(
                        name: "FK_PatientFamilyHistories_FamilyHistories_HistoryId",
                        column: x => x.HistoryId,
                        principalTable: "FamilyHistories",
                        principalColumn: "HistoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientFamilyHistories_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientFamilyHistories_Patients_PatientUserId",
                        column: x => x.PatientUserId,
                        principalTable: "Patients",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    InvoiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Method = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentStatus = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.InvoiceId);
                    table.ForeignKey(
                        name: "FK_Invoices_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "AppointmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId",
                table: "Appointments",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PatientId",
                table: "Appointments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ServiceId",
                table: "Appointments",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_SpecializationId",
                table: "Doctors",
                column: "SpecializationId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_AppointmentId",
                table: "Invoices",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PatientChronicDiseases_ChronicDiseaseDiseaseId",
                table: "PatientChronicDiseases",
                column: "ChronicDiseaseDiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientChronicDiseases_DiseaseId",
                table: "PatientChronicDiseases",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientChronicDiseases_PatientUserId",
                table: "PatientChronicDiseases",
                column: "PatientUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFamilyHistories_FamilyHistoryHistoryId",
                table: "PatientFamilyHistories",
                column: "FamilyHistoryHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFamilyHistories_HistoryId",
                table: "PatientFamilyHistories",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFamilyHistories_PatientUserId",
                table: "PatientFamilyHistories",
                column: "PatientUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SpecializationServices_ServiceId",
                table: "SpecializationServices",
                column: "ServiceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "MedicalInfos");

            migrationBuilder.DropTable(
                name: "PatientChronicDiseases");

            migrationBuilder.DropTable(
                name: "PatientFamilyHistories");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "SpecializationServices");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "ChronicDiseases");

            migrationBuilder.DropTable(
                name: "FamilyHistories");

            migrationBuilder.DropTable(
                name: "Doctors");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Specializations");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
