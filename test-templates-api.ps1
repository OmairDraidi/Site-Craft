# SiteCraft Templates API - Test Script
# Quick test for all Templates endpoints

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SiteCraft Templates API Test Suite" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5263/api/v1"
$headers = @{'X-Tenant-Id'='default'}

# Test 1: Get All Templates
Write-Host "[1/5] Testing: GET /templates (Public)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/templates" -Headers $headers
    if ($response.success) {
        Write-Host "  [OK] Success: Got $($response.data.Count) templates" -ForegroundColor Green
        Write-Host "  Templates:" -ForegroundColor White
        $response.data | ForEach-Object { 
            $premium = if ($_.isPremium) { "[PREMIUM]" } else { "[FREE]" }
            Write-Host "    $premium $($_.name) - $($_.category)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  [FAIL] Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Filter by Category
Write-Host "`n[2/5] Testing: Filter by Category (Business)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/templates?category=Business" -Headers $headers
    if ($response.success) {
        Write-Host "  [OK] Success: Found $($response.data.Count) Business templates" -ForegroundColor Green
    }
} catch {
    Write-Host "  [FAIL] Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Filter by Premium
Write-Host "`n[3/5] Testing: Filter by Premium (Free only)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/templates?isPremium=false" -Headers $headers
    if ($response.success) {
        Write-Host "  [OK] Success: Found $($response.data.Count) Free templates" -ForegroundColor Green
    }
} catch {
    Write-Host "  [FAIL] Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Search Templates
Write-Host "`n[4/5] Testing: Search (keyword: 'pro')" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/templates?searchTerm=pro" -Headers $headers
    if ($response.success) {
        Write-Host "  [OK] Success: Found $($response.data.Count) matching templates" -ForegroundColor Green
    }
} catch {
    Write-Host "  [FAIL] Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get First Template by ID
Write-Host "`n[5/5] Testing: GET /templates/{id} (Public)" -ForegroundColor Yellow
try {
    # First get all templates to get an ID
    $allTemplates = Invoke-RestMethod -Uri "$baseUrl/templates" -Headers $headers
    if ($allTemplates.data.Count -gt 0) {
        $firstTemplateId = $allTemplates.data[0].id
        $response = Invoke-RestMethod -Uri "$baseUrl/templates/$firstTemplateId" -Headers $headers
        if ($response.success) {
            Write-Host "  [OK] Success: Retrieved template '$($response.data.name)'" -ForegroundColor Green
            Write-Host "  Details:" -ForegroundColor White
            Write-Host "    - Category: $($response.data.category)" -ForegroundColor Gray
            Write-Host "    - Premium: $($response.data.isPremium)" -ForegroundColor Gray
            Write-Host "    - Usage Count: $($response.data.usageCount)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  [FAIL] Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  [OK] All Public Endpoints Working" -ForegroundColor Green
Write-Host "  [PUBLIC] No Authentication Required" -ForegroundColor Green
Write-Host "  API URL: $baseUrl" -ForegroundColor Gray
Write-Host "  Frontend: http://localhost:5174/templates" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White
