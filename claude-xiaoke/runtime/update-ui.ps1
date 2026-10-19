# 小克 does not self-update from GitHub (that would replace this Claude build with the Codex one).
# The widget still calls these hooks, so they stay as no-ops.
function Initialize-WidgetUpdater {}
function Update-WidgetUpdateMenu {}
function Tick-WidgetUpdater([long]$Now) {}
function Test-WidgetUpdateEditor {return [bool](($script:quoteEditor -and $script:quoteEditor.IsVisible) -or ($script:colorTriggerEditor -and $script:colorTriggerEditor.IsVisible))}
