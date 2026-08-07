$ErrorActionPreference = "Stop"

$controller = ".\app\Http\Controllers\Admin\CrmController.php"
$testFiles = @(
    ".\tests\Feature\EnterpriseCrmCompatibilityV671Test.php",
    ".\tests\Feature\EnterpriseCrmUiV67Test.php"
)

if (-not (Test-Path $controller)) {
    throw "CrmController.php not found: $controller"
}

$content = Get-Content $controller -Raw
$content = $content.Replace("Admin/Crm/Show", "Admin/CRM/Show")
Set-Content -Path $controller -Value $content -Encoding UTF8

foreach ($testFile in $testFiles) {
    if (Test-Path $testFile) {
        $testContent = Get-Content $testFile -Raw
        $testContent = $testContent.Replace("Admin/Crm/Show", "Admin/CRM/Show")
        Set-Content -Path $testFile -Value $testContent -Encoding UTF8
    }
}

Write-Host ""
Write-Host "CRM page component casing fixed:"
Write-Host "Admin/Crm/Show -> Admin/CRM/Show"
Write-Host ""
