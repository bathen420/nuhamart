$ErrorActionPreference = "Stop"

$files = @(
    ".\app\Http\Controllers\Admin\CrmController.php",
    ".\tests\Feature\EnterpriseCrmCompatibilityV671Test.php",
    ".\tests\Feature\EnterpriseCrmUiV67Test.php"
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = [System.IO.File]::ReadAllText((Resolve-Path $file))
        [System.IO.File]::WriteAllText((Resolve-Path $file), $content, $utf8NoBom)
        Write-Host "Rewritten UTF-8 without BOM: $file"
    }
}

Write-Host ""
Write-Host "UTF-8 BOM removed successfully."
