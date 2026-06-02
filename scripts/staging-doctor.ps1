$ErrorActionPreference = 'Continue'

Write-Host "🩺 VintageDagoShop Staging Doctor (Windows)" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

$desktopExe = 'C:\Program Files\Docker\Docker\Docker Desktop.exe'

function Test-DockerEngine {
  docker info *> $null
  return ($LASTEXITCODE -eq 0)
}

Write-Host "1) Checking Docker CLI..." -ForegroundColor Yellow
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Docker CLI not found in PATH." -ForegroundColor Red
  exit 1
}
Write-Host "✅ Docker CLI found" -ForegroundColor Green

Write-Host "2) Checking Docker service..." -ForegroundColor Yellow
$service = Get-Service -Name com.docker.service -ErrorAction SilentlyContinue
if ($null -eq $service) {
  Write-Host "⚠️ com.docker.service not found. Docker Desktop may not be installed correctly." -ForegroundColor Yellow
} else {
  Write-Host "✅ Service status: $($service.Status)" -ForegroundColor Green
}

Write-Host "3) Checking engine pipe connectivity..." -ForegroundColor Yellow
if (Test-DockerEngine) {
  Write-Host "✅ Docker engine is reachable." -ForegroundColor Green
  docker context ls
  exit 0
}

Write-Host "⚠️ Docker engine is not reachable from this shell." -ForegroundColor Yellow

if (Test-Path $desktopExe) {
  Write-Host "4) Launching Docker Desktop..." -ForegroundColor Yellow
  Start-Process -FilePath $desktopExe
  Start-Sleep -Seconds 25
}

if (Test-DockerEngine) {
  Write-Host "✅ Docker engine became reachable after launch." -ForegroundColor Green
  docker context ls
  exit 0
}

Write-Host "❌ Docker engine is still unavailable." -ForegroundColor Red
Write-Host "Try these steps:" -ForegroundColor Yellow
Write-Host "  - Open Docker Desktop and wait until status is 'Engine running'"
Write-Host "  - In Docker Desktop: Settings > General > Use WSL 2 based engine (enabled)"
Write-Host "  - In Docker Desktop: Settings > Resources > WSL integration (enable your distro)"
Write-Host "  - Restart Docker Desktop"
Write-Host "  - Re-run: npm run staging:doctor"

exit 1
