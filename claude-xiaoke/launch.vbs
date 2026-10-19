Option Explicit
' Starts the Xiaoke supervisor directly (no scheduled task). It waits for the Claude main
' window, launches the widget, and exits on supervisor-stop.flag / supervisor-disabled.flag.
Dim widgetShell, widgetFiles, widgetRoot, widgetCommand
Set widgetShell = CreateObject("WScript.Shell")
Set widgetFiles = CreateObject("Scripting.FileSystemObject")
widgetRoot = widgetFiles.GetParentFolderName(WScript.ScriptFullName)
widgetCommand = """" & widgetShell.ExpandEnvironmentStrings("%WINDIR%") & "\System32\WindowsPowerShell\v1.0\powershell.exe"" -NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & widgetRoot & "\runtime\supervisor.ps1"""
widgetShell.Run widgetCommand, 0, False
