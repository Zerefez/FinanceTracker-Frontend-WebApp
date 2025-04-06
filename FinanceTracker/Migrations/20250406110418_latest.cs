using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Migrations
{
    /// <inheritdoc />
    public partial class latest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HolidayPays");

            migrationBuilder.DropTable(
                name: "SuPayments");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "HolidayPays",
                columns: table => new
                {
                    ExperationDate = table.Column<DateOnly>(type: "date", nullable: false),
                    FirstHoliday = table.Column<DateOnly>(type: "date", nullable: false),
                    HolidayPayAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HolidayPays", x => x.ExperationDate);
                });

            migrationBuilder.CreateTable(
                name: "SuPayments",
                columns: table => new
                {
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    SuAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxCard = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuPayments", x => x.Date);
                });
        }
    }
}
