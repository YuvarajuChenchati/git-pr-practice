# ==============================================================================
# PowerShell Script: Launch Project 02 Microservice Stack Using Pure Docker CLI
# This shows you how networking, volumes, and containers connect under the hood!
# ==============================================================================

Write-Host "1. Creating user-defined bridge network: microservice-net..." -ForegroundColor Cyan
docker network create microservice-net 2>$null

Write-Host "2. Creating persistent volume for MySQL: mysql_store..." -ForegroundColor Cyan
docker volume create mysql_store 2>$null

Write-Host "3. Starting Redis container..." -ForegroundColor Cyan
docker run -d `
  --name redis-cache `
  --network microservice-net `
  redis:alpine

Write-Host "4. Starting MySQL container..." -ForegroundColor Cyan
docker run -d `
  --name mysql-db `
  --network microservice-net `
  -e MYSQL_ROOT_PASSWORD=root_secret `
  -e MYSQL_DATABASE=app_database `
  -e MYSQL_USER=app_user `
  -e MYSQL_PASSWORD=app_secret123 `
  -v mysql_store:/var/lib/mysql `
  mysql:8.0

Write-Host "Waiting 12 seconds for MySQL to initialize tables..." -ForegroundColor Yellow
Start-Sleep -Seconds 12

Write-Host "5. Building Node.js API image..." -ForegroundColor Cyan
docker build -t microservice-api:v1 ./api

Write-Host "6. Starting Node.js API container..." -ForegroundColor Cyan
docker run -d `
  --name microservice-api `
  --network microservice-net `
  -p 3000:3000 `
  -e DB_HOST=mysql-db `
  -e REDIS_HOST=redis-cache `
  microservice-api:v1

Write-Host "`nAll services online! Test in your browser:" -ForegroundColor Green
Write-Host "http://localhost:3000/users" -ForegroundColor Green
