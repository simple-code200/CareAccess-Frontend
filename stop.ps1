$ErrorActionPreference = "SilentlyContinue"

$targets = @(
    @{ Name = "python"; Match = "app.py" },
    @{ Name = "node"; Match = "vite" },
    @{ Name = "npm"; Match = "run dev" }
)

foreach ($target in $targets) {
    $processes = Get-CimInstance Win32_Process |
        Where-Object {
            $_.Name -ieq "$($target.Name).exe" -and
            $_.CommandLine -and
            $_.CommandLine -match [regex]::Escape($target.Match)
        }

    foreach ($process in $processes) {
        Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Stopped matching backend/frontend dev processes if any were running."
