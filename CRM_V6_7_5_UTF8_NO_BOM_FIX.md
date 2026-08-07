# NuhaMart Enterprise CRM v6.7.5 — UTF-8 No-BOM Fix

## Root cause

Windows PowerShell 5.1 `Set-Content -Encoding UTF8` writes a UTF-8 BOM.

The v6.7.4 case-fix script rewrote:

```text
app/Http/Controllers/Admin/CrmController.php
```

with a BOM before `<?php`.

PHP then sees bytes before the namespace declaration and throws:

```text
Namespace declaration statement has to be the very first statement
```

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-CRM-v6.7.5-UTF8-No-BOM-Fix.zip `
-DestinationPath . `
-Force

powershell -ExecutionPolicy Bypass -File .\fix-utf8-no-bom.ps1

composer dump-autoload
php artisan optimize:clear
```

Then verify PHP syntax:

```powershell
php -l .\app\Http\Controllers\Admin\CrmController.php
```

Expected:

```text
No syntax errors detected
```

Then test:

```powershell
php artisan test --filter=EnterpriseCrmCompatibilityV671Test
npm run build
```

If using Vite dev mode, restart:

```powershell
npm run dev
```

Then hard refresh Chrome with:

```text
Ctrl + Shift + R
```
