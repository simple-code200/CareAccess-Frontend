param(
    [switch]$InTerminal
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"
$stopScriptPath = Join-Path $projectRoot "stop.ps1"

if (-not (Test-Path $backendPath)) {
    throw "Backend folder not found at $backendPath"
}

if (-not (Test-Path $frontendPath)) {
    throw "Frontend folder not found at $frontendPath"
}

if (Test-Path $stopScriptPath) {
    powershell -ExecutionPolicy Bypass -File $stopScriptPath | Out-Null
}

if ($InTerminal) {
    Push-Location $backendPath
    python -m pip install -r requirements.txt
    Pop-Location

    Push-Location $frontendPath
    if (-not (Test-Path "node_modules")) {
        npm install
    }
    Pop-Location

    $backendProcess = Start-Process python -ArgumentList "app.py" -WorkingDirectory $backendPath -NoNewWindow -PassThru
    $frontendProcess = Start-Process npm.cmd -ArgumentList "run", "dev", "--", "--host", "localhost" -WorkingDirectory $frontendPath -NoNewWindow -PassThru

    Write-Host "Started backend and frontend in this terminal session."
    Write-Host "Existing app windows and tracked dev servers were stopped first."
    Write-Host "Backend PID:  $($backendProcess.Id)"
    Write-Host "Frontend PID: $($frontendProcess.Id)"
    Write-Host "Backend:  http://127.0.0.1:5000"
    Write-Host "Frontend: http://localhost:5173"
    Write-Host "Use .\\stop.ps1 to stop both servers."
}
else {
    $backendCommand = @"
Set-Location '$backendPath'
python -m pip install -r requirements.txt
python app.py
"@

    $frontendCommand = @"
Set-Location '$frontendPath'
if (-not (Test-Path 'node_modules')) {
    npm install
}
npm run dev
"@

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

    Write-Host "Opened backend and frontend in separate PowerShell windows."
    Write-Host "Existing app windows and tracked dev servers were stopped first."
    Write-Host "Backend:  http://127.0.0.1:5000"
    Write-Host "Frontend: http://127.0.0.1:5173"
}
