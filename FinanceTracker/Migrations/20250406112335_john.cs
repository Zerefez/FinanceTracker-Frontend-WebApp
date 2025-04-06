using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Migrations
{
    /// <inheritdoc />
    public partial class john : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_UserId1",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_supplementPays_Jobs_JobUserId_JobCVR",
                table: "supplementPays");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkShifts_AspNetUsers_UserId1",
                table: "WorkShifts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkShifts",
                table: "WorkShifts");

            migrationBuilder.DropIndex(
                name: "IX_WorkShifts_UserId1",
                table: "WorkShifts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_UserId1",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "WorkShifts");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Jobs");

            migrationBuilder.RenameColumn(
                name: "JobUserId",
                table: "supplementPays",
                newName: "JobFinanceUserId");

            migrationBuilder.RenameIndex(
                name: "IX_supplementPays_JobUserId_JobCVR",
                table: "supplementPays",
                newName: "IX_supplementPays_JobFinanceUserId_JobCVR");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "WorkShifts",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "FinanceUserId",
                table: "WorkShifts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Jobs",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "FinanceUserId",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "JobId",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkShifts",
                table: "WorkShifts",
                columns: new[] { "StartTime", "EndTime", "FinanceUserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs",
                columns: new[] { "FinanceUserId", "CVR" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkShifts_UserId",
                table: "WorkShifts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_UserId",
                table: "Jobs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_UserId",
                table: "Jobs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_supplementPays_Jobs_JobFinanceUserId_JobCVR",
                table: "supplementPays",
                columns: new[] { "JobFinanceUserId", "JobCVR" },
                principalTable: "Jobs",
                principalColumns: new[] { "FinanceUserId", "CVR" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkShifts_AspNetUsers_UserId",
                table: "WorkShifts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_AspNetUsers_UserId",
                table: "Jobs");

            migrationBuilder.DropForeignKey(
                name: "FK_supplementPays_Jobs_JobFinanceUserId_JobCVR",
                table: "supplementPays");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkShifts_AspNetUsers_UserId",
                table: "WorkShifts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WorkShifts",
                table: "WorkShifts");

            migrationBuilder.DropIndex(
                name: "IX_WorkShifts_UserId",
                table: "WorkShifts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_UserId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "FinanceUserId",
                table: "WorkShifts");

            migrationBuilder.DropColumn(
                name: "FinanceUserId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "JobId",
                table: "Jobs");

            migrationBuilder.RenameColumn(
                name: "JobFinanceUserId",
                table: "supplementPays",
                newName: "JobUserId");

            migrationBuilder.RenameIndex(
                name: "IX_supplementPays_JobFinanceUserId_JobCVR",
                table: "supplementPays",
                newName: "IX_supplementPays_JobUserId_JobCVR");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "WorkShifts",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "WorkShifts",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "Jobs",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_WorkShifts",
                table: "WorkShifts",
                columns: new[] { "StartTime", "EndTime", "UserId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Jobs",
                table: "Jobs",
                columns: new[] { "UserId", "CVR" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkShifts_UserId1",
                table: "WorkShifts",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_UserId1",
                table: "Jobs",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_AspNetUsers_UserId1",
                table: "Jobs",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_supplementPays_Jobs_JobUserId_JobCVR",
                table: "supplementPays",
                columns: new[] { "JobUserId", "JobCVR" },
                principalTable: "Jobs",
                principalColumns: new[] { "UserId", "CVR" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkShifts_AspNetUsers_UserId1",
                table: "WorkShifts",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
