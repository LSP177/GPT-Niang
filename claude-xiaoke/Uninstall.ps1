# Stops 小克 and removes the Startup shortcut. Program files and preferences are kept.
$ErrorActionPreference='Stop'
$config=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'installation.json') -Raw -Encoding UTF8|ConvertFrom-Json
. (Join-Path $PSScriptRoot 'runtime\supervisor-task.ps1')
$null=New-Item -ItemType Directory -Path $config.dataDir -Force
[IO.File]::WriteAllText((Join-Path $config.dataDir 'supervisor-disabled.flag'),'disabled')
[IO.File]::WriteAllText((Join-Path $config.dataDir 'supervisor-stop.flag'),'stop')
Stop-WidgetGui -AppDir $PSScriptRoot -DataDir $config.dataDir
if($config.startupShortcut -and (Test-Path -LiteralPath $config.startupShortcut)){Remove-Item -LiteralPath $config.startupShortcut}
Write-Output '小克 stopped and removed from Startup. Files and preferences were kept.'
