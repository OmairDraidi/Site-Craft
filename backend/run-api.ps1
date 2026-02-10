# تسكريبت لتشغيل API
$ErrorActionPreference = "Continue"

# تعيين متغيرات البيئة
$env:ASPNETCORE_ENVIRONMENT='Development'
$env:ASPNETCORE_URLS='http://localhost:5263'

# الانتقال إلى مجلد API
Set-Location "C:\Users\hp\Documents\Project with iman\backend\src\SiteCraft.API"

Write-Host "=================================" -ForegroundColor Cyan
Write-Host " تشغيل SiteCraft API" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment: Development" -ForegroundColor Yellow  
Write-Host "URL: http://localhost:5263" -ForegroundColor Yellow
Write-Host "Swagger: http://localhost:5263/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "جاري تشغيل التطبيق..." -ForegroundColor White
Write-Host ""

# تشغيل التطبيق
dotnet run --no-build
