$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$argsList = @(
    "--noconfirm"
    "--clean"
    "--name", "UltronSchoolDesktop"
    "--windowed"
    "--add-data", "config.yaml;."
    "--add-data", "tts_worker.py;."
    "--add-data", "authorized_faces;authorized_faces"
    "--add-data", "unauthorized_faces;unauthorized_faces"
    "--add-data", "logs;logs"
    "--hidden-import", "pyttsx3.drivers"
    "--hidden-import", "pyttsx3.drivers.sapi5"
    "main.py"
)

$filtered = $argsList | Where-Object { $_ -ne "" }
python -m PyInstaller @filtered

Write-Host "Build complete. Output is in dist\\UltronSchoolDesktop"
