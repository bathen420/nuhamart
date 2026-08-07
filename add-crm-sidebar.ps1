$ErrorActionPreference = "Stop"

$path = ".\resources\js\Components\Admin\AdminNavigation.js"

if (-not (Test-Path $path)) {
    throw "AdminNavigation.js not found: $path"
}

$content = [System.IO.File]::ReadAllText((Resolve-Path $path))

$anchor = @'
            {
                label: "Customers",
                description: "Customer directory",
                routeName: "admin.customers.index",
                urlPrefix: "/admin/customers",
                permission: "customers.view",
                icon: Users,
                keywords: "customers crm buyers",
            },
'@

$crmItem = @'
            {
                label: "CRM",
                description: "Customer intelligence & relationships",
                routeName: "admin.crm.index",
                urlPrefix: "/admin/crm",
                permission: "crm.view",
                icon: Contact,
                keywords: "crm customers relationships loyalty wallet customer intelligence",
            },
'@

if ($content.Contains('routeName: "admin.crm.index"')) {
    Write-Host "CRM navigation item already exists. No change needed."
} elseif ($content.Contains($anchor)) {
    $content = $content.Replace($anchor, $crmItem + $anchor)

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText((Resolve-Path $path), $content, $utf8NoBom)

    Write-Host "CRM sidebar navigation added successfully."
} else {
    throw "Could not find Customers navigation block. No file was changed."
}
