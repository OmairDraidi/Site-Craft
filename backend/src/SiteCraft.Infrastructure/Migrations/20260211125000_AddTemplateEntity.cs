using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SiteCraft.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Templates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TenantId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Category = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PreviewImageUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsPublic = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    IsPremium = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    TemplateData = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UsageCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Templates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Templates_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Templates_Category",
                table: "Templates",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Templates_IsPremium",
                table: "Templates",
                column: "IsPremium");

            migrationBuilder.CreateIndex(
                name: "IX_Templates_IsPublic",
                table: "Templates",
                column: "IsPublic");

            migrationBuilder.CreateIndex(
                name: "IX_Templates_TenantId",
                table: "Templates",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Templates");
        }
    }
}
