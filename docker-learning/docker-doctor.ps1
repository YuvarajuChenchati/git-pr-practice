# ==============================================================================
# 🩺 Docker Doctor - Interactive Diagnostic & Health Utility
# Run in PowerShell: .\docker-doctor.ps1
# ==============================================================================

Clear-Host
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "          🐳 DOCKER DOCTOR HEALTH INSPECTOR              " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. Check Docker Daemon
Write-Host "`n1. Checking Docker Daemon Status..." -ForegroundColor Yellow
$version = docker --version 2>$null
if ($version) {
    Write-Host "  ✅ Docker is running: $version" -ForegroundColor Green
} else {
    Write-Host "  ❌ Docker is NOT running! Please start Docker Desktop." -ForegroundColor Red
    exit
}

# 2. Running Containers
Write-Host "`n2. Active Running Containers:" -ForegroundColor Yellow
$running = docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
if ($running -and $running.Count -gt 1) {
    Write-Host $running -ForegroundColor White
} else {
    Write-Host "  (No containers currently running)" -ForegroundColor Gray
}

# 3. Disk Space Analysis
Write-Host "`n3. Docker Disk Usage (docker system df):" -ForegroundColor Yellow
docker system df

# 4. Interactive Cleanup Menu
Write-Host "`n=========================================================" -ForegroundColor Cyan
Write-Host "Quick Actions:" -ForegroundColor Yellow
Write-Host "  [1] Stop all running containers"
Write-Host "  [2] Clean unused build cache (builder prune)"
Write-Host "  [3] Clean stopped containers and dangling images"
Write-Host "  [4] Nuclear Clean (prune all unused containers, images, networks)"
Write-Host "  [Q] Quit"
Write-Host "=========================================================" -ForegroundColor Cyan

$choice = Read-Host "Select an option [1-4 or Q]"
switch ($choice) {
    "1" {
        Write-Host "Stopping all running containers..." -ForegroundColor Cyan
        $ids = docker ps -q
        if ($ids) { docker stop $ids }
        Write-Host "Done!" -ForegroundColor Green
    }
    "2" {
        Write-Host "Pruning build cache..." -ForegroundColor Cyan
        docker builder prune -f
        Write-Host "Done!" -ForegroundColor Green
    }
    "3" {
        Write-Host "Cleaning stopped containers and dangling images..." -ForegroundColor Cyan
        docker container prune -f
        docker image prune -f
        Write-Host "Done!" -ForegroundColor Green
    }
    "4" {
        Write-Host "Running full system prune..." -ForegroundColor Magenta
        docker system prune -a -f
        Write-Host "Cleaned!" -ForegroundColor Green
    }
    default {
        Write-Host "Exiting Docker Doctor." -ForegroundColor Gray
    }
}
