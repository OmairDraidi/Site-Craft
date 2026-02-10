# Add Default Tenant for Development
$tenantName = "Default Tenant"
$subdomain = "default"

Write-Host "=================================" -ForegroundColor Cyan
Write-Host " Adding Default Tenant" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tenant Name: $tenantName" -ForegroundColor Yellow
Write-Host "Subdomain: $subdomain" -ForegroundColor Yellow
Write-Host ""

# SQL Command to add tenant
$sqlCommand = @"
INSERT INTO Tenants (Id, Name, Subdomain, Status, CreatedAt)
VALUES (
    UUID(), 
    '$tenantName', 
    '$subdomain', 
    1, 
    NOW()
);
"@

# Execute command
docker exec sitecraft_mysql mysql -usitecraft_user -psitecraft_pass sitecraft_db -e "$sqlCommand"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Tenant added successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Get Tenant ID
    $getTenantId = "SELECT BIN_TO_UUID(Id) as TenantId, Name, Subdomain FROM Tenants WHERE Subdomain='$subdomain' LIMIT 1;"
    Write-Host "Tenant Details:" -ForegroundColor Yellow
    docker exec sitecraft_mysql mysql -usitecraft_user -psitecraft_pass sitecraft_db -e "$getTenantId"
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to add tenant" -ForegroundColor Red
}
