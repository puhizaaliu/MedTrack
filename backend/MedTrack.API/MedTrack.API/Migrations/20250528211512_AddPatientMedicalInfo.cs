using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientMedicalInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChronicDiseases",
                columns: table => new
                {
                    DiseaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DiseaseName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronicDiseases", x => x.DiseaseId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FamilyHistories",
                columns: table => new
                {
                    HistoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ConditionName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyHistories", x => x.HistoryId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MedicalInfos",
                columns: table => new
                {
                    MedicalInfoId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Allergies = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Medications = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Smoking = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Alcohol = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PhysicalActivity = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalInfos", x => x.MedicalInfoId);
                    table.ForeignKey(
                        name: "FK_MedicalInfos_Patients_UserId",
                        column: x => x.UserId,
                        principalTable: "Patients",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PatientChronicDiseases",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false),
                    OtherText = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChronicDiseaseDiseaseId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientChronicDiseases", x => new { x.PatientId, x.DiseaseId });
                    table.ForeignKey(
                        name: "FK_PatientChronicDiseases_ChronicDiseases_ChronicDiseaseDisease~",
                        column: x => x.ChronicDiseaseDiseaseId,
                        principalTable: "ChronicDiseases",
                        principalColumn: "DiseaseId");
                    table.ForeignKey(
                        name: "FK_PatientChronicDiseases_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PatientFamilyHistories",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    HistoryId = table.Column<int>(type: "int", nullable: false),
                    OtherText = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FamilyHistoryHistoryId = table.Column<int>(type: "int", nullable: true)
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
                        name: "FK_PatientFamilyHistories_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInfos_UserId",
                table: "MedicalInfos",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PatientChronicDiseases_ChronicDiseaseDiseaseId",
                table: "PatientChronicDiseases",
                column: "ChronicDiseaseDiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFamilyHistories_FamilyHistoryHistoryId",
                table: "PatientFamilyHistories",
                column: "FamilyHistoryHistoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicalInfos");

            migrationBuilder.DropTable(
                name: "PatientChronicDiseases");

            migrationBuilder.DropTable(
                name: "PatientFamilyHistories");

            migrationBuilder.DropTable(
                name: "ChronicDiseases");

            migrationBuilder.DropTable(
                name: "FamilyHistories");

            migrationBuilder.DropTable(
                name: "Patients");
        }
    }
}
