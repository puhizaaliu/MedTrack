using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class SpecializationServiceFixFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PatientUserId",
                table: "PatientFamilyHistories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PatientUserId",
                table: "PatientChronicDiseases",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PatientFamilyHistories_HistoryId",
                table: "PatientFamilyHistories",
                column: "HistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientFamilyHistories_PatientUserId",
                table: "PatientFamilyHistories",
                column: "PatientUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientChronicDiseases_DiseaseId",
                table: "PatientChronicDiseases",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientChronicDiseases_PatientUserId",
                table: "PatientChronicDiseases",
                column: "PatientUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientChronicDiseases_ChronicDiseases_DiseaseId",
                table: "PatientChronicDiseases",
                column: "DiseaseId",
                principalTable: "ChronicDiseases",
                principalColumn: "DiseaseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientChronicDiseases_Patients_PatientUserId",
                table: "PatientChronicDiseases",
                column: "PatientUserId",
                principalTable: "Patients",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientFamilyHistories_FamilyHistories_HistoryId",
                table: "PatientFamilyHistories",
                column: "HistoryId",
                principalTable: "FamilyHistories",
                principalColumn: "HistoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PatientFamilyHistories_Patients_PatientUserId",
                table: "PatientFamilyHistories",
                column: "PatientUserId",
                principalTable: "Patients",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientChronicDiseases_ChronicDiseases_DiseaseId",
                table: "PatientChronicDiseases");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientChronicDiseases_Patients_PatientUserId",
                table: "PatientChronicDiseases");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientFamilyHistories_FamilyHistories_HistoryId",
                table: "PatientFamilyHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_PatientFamilyHistories_Patients_PatientUserId",
                table: "PatientFamilyHistories");

            migrationBuilder.DropIndex(
                name: "IX_PatientFamilyHistories_HistoryId",
                table: "PatientFamilyHistories");

            migrationBuilder.DropIndex(
                name: "IX_PatientFamilyHistories_PatientUserId",
                table: "PatientFamilyHistories");

            migrationBuilder.DropIndex(
                name: "IX_PatientChronicDiseases_DiseaseId",
                table: "PatientChronicDiseases");

            migrationBuilder.DropIndex(
                name: "IX_PatientChronicDiseases_PatientUserId",
                table: "PatientChronicDiseases");

            migrationBuilder.DropColumn(
                name: "PatientUserId",
                table: "PatientFamilyHistories");

            migrationBuilder.DropColumn(
                name: "PatientUserId",
                table: "PatientChronicDiseases");
        }
    }
}
