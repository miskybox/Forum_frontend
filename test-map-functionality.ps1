# Test Map Functionality - Add countries to my map
# Prerequisites: User must be logged in and provide their token

Write-Host "=== Testing Map Functionality ===" -ForegroundColor Cyan
Write-Host "This test adds visited countries to your map" -ForegroundColor White

# Get token from user
$token = Read-Host "`nEnter your access token (login first in the browser and use LocalStorageDebug to get it)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "No token provided. Exiting." -ForegroundColor Red
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test adding different countries with different statuses
$testCountries = @(
    @{ country = "ES"; status = "LIVED"; notes = "Born here, lived for 20 years"; rating = 5 }
    @{ country = "FR"; status = "VISITED"; notes = "Amazing trip to Paris"; rating = 5 }
    @{ country = "IT"; status = "VISITED"; notes = "Rome and Venice were incredible"; rating = 5 }
    @{ country = "DE"; status = "WISHLIST"; notes = "Want to visit Berlin"; rating = 0 }
    @{ country = "JP"; status = "WISHLIST"; notes = "Dream destination"; rating = 0 }
)

$successCount = 0
$failCount = 0

foreach ($testPlace in $testCountries) {
    Write-Host "`nAdding $($testPlace.country) with status $($testPlace.status)..." -ForegroundColor Yellow

    $body = $testPlace | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/travel/places" -Method POST -Headers $headers -Body $body
        Write-Host "Success! Added $($testPlace.country)" -ForegroundColor Green
        $successCount++
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.ErrorDetails.Message

        if ($statusCode -eq 409) {
            Write-Host "Country already exists, updating..." -ForegroundColor Yellow
            try {
                # Try to update instead
                $response = Invoke-RestMethod -Uri "http://localhost:8080/api/travel/places/$($testPlace.country)" -Method PUT -Headers $headers -Body $body
                Write-Host "Updated $($testPlace.country)" -ForegroundColor Green
                $successCount++
            } catch {
                Write-Host "Failed to update: $errorMessage" -ForegroundColor Red
                $failCount++
            }
        } else {
            Write-Host "Failed: $errorMessage" -ForegroundColor Red
            $failCount++
        }
    }

    Start-Sleep -Milliseconds 500
}

# Get all user's places
Write-Host "`nRetrieving all your places..." -ForegroundColor Yellow
try {
    $allPlaces = Invoke-RestMethod -Uri "http://localhost:8080/api/travel/places" -Method GET -Headers $headers
    Write-Host "You have $($allPlaces.Count) place(s) on your map:" -ForegroundColor Green

    $allPlaces | ForEach-Object {
        $statusEmoji = switch ($_.status) {
            "VISITED" { "checkmark" }
            "WISHLIST" { "star" }
            "LIVED" { "house" }
            "LIVING" { "pin" }
            default { "?" }
        }
        Write-Host "  - $($_.country): $($_.status) ($statusEmoji) - Rating: $($_.rating)/5" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Failed to retrieve places: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n=== Map Test Complete ===" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor White
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

if ($successCount -gt 0) {
    Write-Host "`nYou can now view your map at: http://localhost:5173/my-map" -ForegroundColor Cyan
}
