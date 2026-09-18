# ==============================================================================
# DevOps Capstone: Traffic & Chaos Simulator
# ==============================================================================
param(
    [string]$BaseUrl = "http://localhost:3000",
    [int]$TotalRequests = 100,
    [int]$DelayMs = 200,
    [switch]$Chaos
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 DEVOPS CAPSTONE: TRAFFIC GENERATOR" -ForegroundColor Yellow
Write-Host " Target URL: $BaseUrl" -ForegroundColor White
Write-Host " Total Requests: $TotalRequests" -ForegroundColor White
Write-Host " Delay: $DelayMs ms" -ForegroundColor White
Write-Host " Chaos Mode: $Chaos" -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Cyan

$endpoints = @(
    "/",
    "/api/products",
    "/api/products",
    "/api/products",
    "/healthz"
)

for ($i = 1; $i -le $TotalRequests; $i++) {
    $endpoint = $endpoints | Get-Random

    # If chaos is enabled, inject 15% slow responses and 10% errors
    if ($Chaos) {
        $rnd = Get-Random -Minimum 1 -Maximum 100
        if ($rnd -lt 15) {
            $endpoint = "/api/slow?delayMs=1200"
        } elseif ($rnd -lt 25) {
            $endpoint = "/api/error"
        }
    }

    $target = "$BaseUrl$endpoint"
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-WebRequest -Uri $target -Method Get -TimeoutSec 5 -ErrorAction Stop
        $stopwatch.Stop()
        $elapsed = [math]::Round($stopwatch.Elapsed.TotalMilliseconds, 1)

        Write-Host "[$i/$TotalRequests] HTTP $($response.StatusCode) - $endpoint (${elapsed}ms)" -ForegroundColor Green
    }
    catch {
        Write-Host "[$i/$TotalRequests] HTTP 500 FAIL - $endpoint" -ForegroundColor Red
    }

    Start-Sleep -Milliseconds $DelayMs
}

Write-Host "`n✅ Traffic simulation batch finished!" -ForegroundColor Green
Write-Host "📊 Check live metrics at: $BaseUrl/metrics" -ForegroundColor Cyan
Write-Host "📈 Check Prometheus targets at: http://localhost:9090/targets" -ForegroundColor Cyan
Write-Host "📊 Open Grafana dashboard at: http://localhost:3001" -ForegroundColor Yellow
