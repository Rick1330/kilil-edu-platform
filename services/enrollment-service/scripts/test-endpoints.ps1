# Test endpoints for the enrollment service

Write-Host "Testing Enrollment Service Endpoints"
Write-Host "==================================="

# Test catalog search
Write-Host "1. Testing catalog search:"
Invoke-WebRequest -Uri "http://localhost:4003/api/catalog/courses?query=CS" -Method GET -ContentType "application/json"

Write-Host ""

# Test sections endpoint
Write-Host "2. Testing sections endpoint:"
Invoke-WebRequest -Uri "http://localhost:4003/api/sections?termId=2025SP&courseId=CS120" -Method GET -ContentType "application/json"

Write-Host ""

# Test student enrollments
Write-Host "3. Testing student enrollments:"
Invoke-WebRequest -Uri "http://localhost:4003/api/student/demo-user-123/enrollments?termId=2025SP" -Method GET -ContentType "application/json"

Write-Host ""

# Test registration validation
Write-Host "4. Testing registration validation:"
$body = @{
    personId = "demo-user-123"
    termId = "2025SP"
    sectionIds = @("sec-1", "sec-2")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4003/api/registration/validate" -Method POST -ContentType "application/json" -Body $body

Write-Host ""

# Test registration confirmation
Write-Host "5. Testing registration confirmation:"
$body = @{
    personId = "demo-user-123"
    termId = "2025SP"
    sectionIds = @("sec-1", "sec-2")
    clientRef = "test-ref-123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4003/api/registration/confirm" -Method POST -ContentType "application/json" -Body $body

Write-Host ""

# Test enrollment swap
Write-Host "6. Testing enrollment swap:"
$body = @{
    personId = "demo-user-123"
    termId = "2025SP"
    fromSectionId = "sec-1"
    toSectionId = "sec-2"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4003/api/enrollments/swap" -Method POST -ContentType "application/json" -Body $body

Write-Host ""

Write-Host "All endpoint tests completed."