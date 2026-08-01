$ErrorActionPreference = "Stop"

Write-Host "NuhaMart Windows npm recovery" -ForegroundColor Cyan
Write-Host "Project: $PSScriptRoot"

Set-Location $PSScriptRoot

Write-Host "Stopping Node/Vite/esbuild processes..." -ForegroundColor Yellow
Get-Process node, esbuild -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

if (Test-Path "node_modules") {
    Write-Host "Removing locked node_modules..." -ForegroundColor Yellow
    cmd /c "attrib -R node_modules\* /S /D" | Out-Null
    cmd /c "rmdir /S /Q node_modules"
}

if (Test-Path "node_modules") {
    throw "node_modules could not be removed. Close VS Code, Chrome DevTools, antivirus scan, and run PowerShell as Administrator."
}

Write-Host "Verifying npm cache..." -ForegroundColor Yellow
npm cache verify

Write-Host "Installing exact dependencies from package-lock.json..." -ForegroundColor Yellow
npm ci

Write-Host "Building frontend assets..." -ForegroundColor Yellow
npm run build

Write-Host "npm recovery and production build completed successfully." -ForegroundColor Green
