$ErrorActionPreference = 'Stop'

Write-Host "🚀 VintageDagoShop Staging Deployment (Windows)" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$composeFile = "docker-compose.staging.yml"
$frontendUrl = "http://localhost:5173"
$backendHealthUrl = "http://localhost:5000/api/health"

if (-not (Test-Path $composeFile)) {
  Write-Host "❌ $composeFile not found. Run from project root." -ForegroundColor Red
  exit 1
}

Write-Host "🧹 Cleaning previous staging containers..." -ForegroundColor Yellow
docker compose -f $composeFile down | Out-Null

Write-Host "🔨 Building and starting staging stack..." -ForegroundColor Yellow
docker compose -f $composeFile up -d --build

Write-Host "⏳ Waiting for services to initialize (30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

try {
  $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 10
  if ($frontendResponse.StatusCode -ge 200 -and $frontendResponse.StatusCode -lt 500) {
    Write-Host "✅ Frontend reachable: $frontendUrl" -ForegroundColor Green
  }
} catch {
  Write-Host "⚠️ Frontend not ready yet: $frontendUrl" -ForegroundColor Yellow
}

try {
  $health = Invoke-RestMethod -Uri $backendHealthUrl -TimeoutSec 10
  Write-Host "✅ Backend health endpoint reachable: $backendHealthUrl" -ForegroundColor Green
  $health | ConvertTo-Json -Depth 6
} catch {
  Write-Host "⚠️ Backend health check failed: $backendHealthUrl" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📌 Next commands:" -ForegroundColor Cyan
Write-Host "  npm run staging:logs"
Write-Host "  `$env:STAGING_URL='http://localhost:5173'; npm run test:e2e:staging"
Write-Host "  npm run staging:down"
