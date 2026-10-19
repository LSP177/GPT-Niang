param([switch]$CheckOnly)
# 小克 installer: no admin rights, no Codex, no scheduled task, no self-update.
# Writes installation.json, adds a Startup shortcut and starts the supervisor.
$ErrorActionPreference='Stop'
$appDir=$PSScriptRoot
. (Join-Path $appDir 'runtime\supervisor-task.ps1')

# The character art is not distributed with the code; see docs/character-art.md.
if(!(Test-Path -LiteralPath (Join-Path $appDir 'assets\xiaoke-bust.png'))){
  throw '缺少角色图：请把 1254x1254 透明背景 PNG 放到 assets\xiaoke-bust.png（做法见 docs\character-art.md），再重新安装。'
}

$node=(Get-Command node.exe -ErrorAction SilentlyContinue).Source
if(!$node){throw 'Node.js 20+ is required. Install it from https://nodejs.org/ first.'}
$major=[int]((& $node -p 'parseInt(process.versions.node)').Trim())
if($major-lt 20){throw "Node.js 20+ is required (found $major)."}
$dataDir=Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'ClaudeXiaoke\state'
$startup=Join-Path ([Environment]::GetFolderPath('Startup')) 'Claude Xiaoke.lnk'
$version=(Get-Content -LiteralPath (Join-Path $appDir 'package.json') -Raw -Encoding UTF8|ConvertFrom-Json).version
$config=[ordered]@{version=$version;appDir=$appDir;dataDir=$dataDir;nodePath=$node;startupShortcut=$startup;installedAt=[DateTime]::UtcNow.ToString('o')}
if($CheckOnly){$config|ConvertTo-Json;return}

$null=New-Item -ItemType Directory -Path $dataDir -Force
if(Test-Path -LiteralPath (Join-Path $appDir 'installation.json')){Stop-WidgetGui -AppDir $appDir -DataDir $dataDir}
Write-WidgetSupervisorJson (Join-Path $appDir 'installation.json') $config

$link=(New-Object -ComObject WScript.Shell).CreateShortcut($startup)
$link.TargetPath=Join-Path $env:WINDIR 'System32\wscript.exe'
$link.Arguments='"'+(Join-Path $appDir 'launch.vbs')+'"'
$link.WorkingDirectory=$appDir
$link.Description='小克: Claude desktop usage widget'
$link.Save()

foreach($name in @('supervisor-pause.json','supervisor-disabled.flag','supervisor-stop.flag','stop.flag')){Remove-Item -LiteralPath (Join-Path $dataDir $name) -ErrorAction SilentlyContinue}
Start-Process -FilePath (Join-Path $env:WINDIR 'System32\wscript.exe') -ArgumentList ('"'+(Join-Path $appDir 'launch.vbs')+'"')
Write-Output "小克 $version installed. Data: $dataDir"
